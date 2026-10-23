#!/bin/bash
# Usage:
#   $0 backup odoo
#   $0 restore odoo

set -eo pipefail

# Environment variables
: ${RUNNING_ENV:='dev'}
# PostgreSQL
: ${PGHOST:='localhost'}
: ${PGPORT:=5432}
: ${PGDATABASE:='master'}
: ${PGUSER:='postgres'}
: ${PGPASSWORD:='postgres'}
: ${PGDEFAULTDB:='postgres'}
: ${PGSSLMODE:='prefer'}
# Recovery Point Objective
: ${RPO_DATE:='latest'}
# Filestore
: ${FILESTORE_PLATFORM:='aws'}
## AWS / DO
: ${FILESTORE_AWS_HOST:='false'}
: ${FILESTORE_AWS_REGION:='false'}
: ${FILESTORE_AWS_ACCESS_KEY_ID:='false'}
: ${FILESTORE_AWS_SECRET_ACCESS_KEY:='false'}
: ${FILESTORE_AWS_BUCKETNAME:='false'}
## Azure
: ${FILESTORE_AZURE_STORAGE_ACCOUNT_URL:='false'}
# BACKUP
: ${BACKUP_PLATFORM:='aws'}
## AWS / DO
: ${BACKUP_AWS_HOST:='false'}
: ${BACKUP_AWS_REGION:='false'}
: ${BACKUP_AWS_ACCESS_KEY_ID:='false'}
: ${BACKUP_AWS_SECRET_ACCESS_KEY:='false'}
: ${BACKUP_AWS_BUCKETNAME:='false'}
## Azure
: ${BACKUP_AZURE_STORAGE_ACCOUNT_URL:='false'}
# REMOTE
: ${REMOTE_ENABLED:='false'}
: ${REMOTE_PLATFORM:='aws'}
## AWS / DO
: ${REMOTE_AWS_HOST:='false'}
: ${REMOTE_AWS_REGION:='false'}
: ${REMOTE_AWS_ACCESS_KEY_ID:='false'}
: ${REMOTE_AWS_SECRET_ACCESS_KEY:='false'}
: ${REMOTE_AWS_BUCKETNAME:='false'}
## Azure
: ${REMOTE_AZURE_STORAGE_ACCOUNT_URL:='false'}
# rclone tuning for many small, immutable filestore objects
: ${RCLONE_TRANSFERS:=32}
: ${RCLONE_CHECKERS:=64}
RCLONE_FILESTORE_FLAGS=(
  --transfers "$RCLONE_TRANSFERS"
  --checkers "$RCLONE_CHECKERS"
  --fast-list
  --size-only
)

export FILESTORE_BUCKET=`echo $FILESTORE_AWS_BUCKETNAME | sed -e "s/{db}/$PGDATABASE/g"`
export BACKUP_BUCKET=`echo $BACKUP_AWS_BUCKETNAME | sed -e "s/{db}/$PGDATABASE/g"`
[ "$REMOTE_ENABLED" == "true" ] && export REMOTE_BUCKET=`echo $REMOTE_AWS_BUCKETNAME | sed -e "s/{db}/$PGDATABASE/g"`
# Date in UTC
export TODAY=$(date -u +%Y%m%d)
export LASTMONTH=$(date -d "1 month ago" -u +%Y%m%d)
# For dockerize
export TEMPLATES=/templates

# Configuration functions
function config_rclone() {
  echo "Configure rclone"
  mkdir -p $HOME/.config/rclone
  dockerize -template $TEMPLATES/rclone.conf.tmpl:$HOME/.config/rclone/rclone.conf
  [ "$DEBUG" == "1" ] && echo "Rclone configuration file:" && cat $HOME/.config/rclone/rclone.conf
  # FILESTORE
  case "$FILESTORE_PLATFORM" in
    "aws")
      ;;
    "azure")
      export FILESTORE_BUCKET=$RUNNING_ENV-$PGDATABASE
      ;;
    "do")
      ;;
    *)
      echo "I don't know how to configure rclone for $FILESTORE_PLATFORM."
      exit 1
      ;;
  esac
  # BACKUP
  case "$BACKUP_PLATFORM" in
    "aws")
      ;;
    "azure")
      export BACKUP_BUCKET=backup
      ;;
    "do")
      ;;
    *)
      echo "I don't know how to configure rclone for $BACKUP_PLATFORM."
      exit 1
      ;;
  esac
  # REMOTE
  if [ "$REMOTE_ENABLED" == "true" ]; then
    case "$REMOTE_PLATFORM" in
      "aws")
        ;;
      "azure")
        export REMOTE_BUCKET=$RUNNING_ENV-$PGDATABASE
        ;;
      "do")
        ;;
      *)
        echo "I don't know how to configure rclone for $REMOTE_PLATFORM."
        exit 1
        ;;
    esac
  fi
}

# Common functions
function wait_jobs() {
  local status=0
  local pid
  for pid in "$@"; do
    if ! wait "$pid"; then
      echo "A parallel step failed (pid $pid)" >&2
      status=1
    fi
  done
  return "$status"
}

function dump_database() {
  pg_dump --clean "$PGDATABASE" | pigz > "$1"
}

# Server-side copy of the previous snapshot. A missing prefix (exit 3 or 4)
# means this is the first run and the following sync uploads everything.
function seed_dated_filestore() {
  local code=0
  rclone copy "$1" "$2" "${RCLONE_FILESTORE_FLAGS[@]}" || code=$?
  if [ "$code" -eq 3 ] || [ "$code" -eq 4 ]; then
    echo "No $RPO_DATE filestore yet; today's copy will be a full sync"
    return 0
  fi
  return "$code"
}

function restore_odoo_database() {
 echo "Load dump in $PGDATABASE"
 zcat /tmp/production-master-$RPO_DATE.sql.gz | psql $PGDATABASE
 echo "Deactivate the cron jobs and email servers"
 psql -c "
 UPDATE ir_cron SET active = 'f';
 UPDATE ir_mail_server SET active = 'f';
 UPDATE fetchmail_server SET active = 'f';
 UPDATE ir_config_parameter SET value = 'null' WHERE key = 'database.uuid';
 UPDATE queue_job SET state = 'pending' WHERE state in ('started', 'enqueued');
 " $PGDATABASE
}

# Main functions
function backup() {
  case "$1" in
    "odoo")
      local dump="/tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz"
      local backup_root="backup:/$BACKUP_SPACE/$BACKUP_BUCKET"
      local dated_name="$RUNNING_ENV-$PGDATABASE-$TODAY"
      local latest_name="$RUNNING_ENV-$PGDATABASE-$RPO_DATE"
      local dated_fs="$backup_root/$dated_name"
      local latest_fs="$backup_root/$latest_name"
      local filestore_src="filestore:/$FILESTORE_SPACE/$FILESTORE_BUCKET"
      local dump_pid seed_pid sql_pid fs_pid
      local latest_sql_pid latest_fs_pid
      local -a remote_pids=()

      echo "Dump the database $PGDATABASE"
      dump_database "$dump" &
      dump_pid=$!

      echo "Seed today's filestore from $RPO_DATE"
      seed_dated_filestore "$latest_fs/" "$dated_fs/" &
      seed_pid=$!

      wait_jobs "$dump_pid" "$seed_pid"

      echo "Push it to backup"
      rclone copy "$dump" "$backup_root/" &
      sql_pid=$!

      echo "Sync the filestore to backup"
      rclone sync "$filestore_src/" "$dated_fs/" "${RCLONE_FILESTORE_FLAGS[@]}" &
      fs_pid=$!

      if [ "$REMOTE_ENABLED" == "true" ]; then
        echo "Push the database dump to remote"
        rclone copy "$dump" "remote:/$REMOTE_BUCKET/" &
        remote_pids+=($!)
        echo "Sync the filestore to remote"
        rclone sync "$filestore_src/" "remote:/$REMOTE_BUCKET/$dated_name/" "${RCLONE_FILESTORE_FLAGS[@]}" &
        remote_pids+=($!)
      fi

      wait_jobs "$sql_pid" "$fs_pid"

      echo "Overwrite latest database backup"
      rclone copyto "$backup_root/$dated_name.sql.gz" "$backup_root/$latest_name.sql.gz" &
      latest_sql_pid=$!

      echo "Overwrite latest filestore backup"
      rclone sync "$dated_fs/" "$latest_fs/" "${RCLONE_FILESTORE_FLAGS[@]}" &
      latest_fs_pid=$!

      wait_jobs "$latest_sql_pid" "$latest_fs_pid" "${remote_pids[@]}"

      echo "Cleanup last month copy on backup"
      ! rclone purge "$backup_root/$RUNNING_ENV-$PGDATABASE-$LASTMONTH/"
      ! rclone delete "$backup_root/$RUNNING_ENV-$PGDATABASE-$LASTMONTH.sql.gz"
      ;;
    *)
      echo "Backup profile does not exist. I don't know how to backup $1."
      exit 1
      ;;
  esac
}

function restore() {
  case "$1" in
    "odoo")
      local backup_root="backup:/$BACKUP_SPACE/$BACKUP_BUCKET"
      local snapshot="production-master-$RPO_DATE"
      local sql_pid fs_pid

      echo "Kill Connections to $PGDATABASE"
      psql -d template1 -c "SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = '$PGDATABASE'"

      echo "Download $RPO_DATE backup"
      rclone copy "$backup_root/$snapshot.sql.gz" /tmp/ &
      sql_pid=$!

      echo "Sync the $RPO_DATE filestore"
      rclone sync "$backup_root/$snapshot/" "filestore:/$FILESTORE_SPACE/$FILESTORE_BUCKET/" "${RCLONE_FILESTORE_FLAGS[@]}" &
      fs_pid=$!

      echo "Cleanup $PGDATABASE database and filestore"
      dropdb --if-exists $PGDATABASE
      echo "Create $PGDATABASE database"
      createdb $PGDATABASE

      wait "$sql_pid"
      echo "Restore database dump"
      restore_odoo_database
      wait "$fs_pid"
      ;;
    *)
      echo "Restore profile does not exist. I don't know how to restore $1."
      exit 1
      ;;
  esac
}

[ "$DEBUG" == "1" ] && env | sort
config_rclone
[ "$DEBUG" == "1" ] && env | sort
$1 $2
exit 0
