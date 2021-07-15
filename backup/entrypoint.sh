#!/bin/bash
# Usage:
#   $0 backup odoo
#   $0 restore odoo

set -e

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

export FILESTORE_BUCKET=`echo $FILESTORE_AWS_BUCKETNAME | sed -e "s/{db}/$PGDATABASE/g"`
export BACKUP_BUCKET=`echo $BACKUP_AWS_BUCKETNAME | sed -e "s/{db}/$PGDATABASE/g"`
[ "$REMOTE_ENABLED" == "true" ] && export REMOTE_BUCKET=`echo $REMOTE_AWS_BUCKETNAME | sed -e "s/{db}/$PGDATABASE/g"`
# Date in UTC
export TODAY=$(date -u +%Y%m%d)
export YESTERDAY=$(date -d "1 day ago" -u +%Y%m%d)
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
      ;;
    "do")
      export FILESTORE_SPACE=`echo $FILESTORE_AWS_HOST | sed -e "s/.$FILESTORE_AWS_REGION.*$//"`
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
      ;;
    "do")
      export BACKUP_SPACE=`echo $BACKUP_AWS_HOST | sed -e "s/.$BACKUP_AWS_REGION.*$//"`
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
        ;;
      "do")
        export REMOTE_SPACE=`echo $REMOTE_AWS_HOST | sed -e "s/.$REMOTE_AWS_REGION.*$//"`
        ;;
      *)
        echo "I don't know how to configure rclone for $REMOTE_PLATFORM."
        exit 1
        ;;
    esac
  fi
}

# Common functions
function restore_odoo_database() {
 echo "Load dump in $PGDATABASE"
 zcat /tmp/production-master-$YESTERDAY.sql.gz | psql $PGDATABASE
 echo "Deactivate the cron jobs and email servers"
 psql -c "
 UPDATE ir_cron SET active = 'f';
 UPDATE ir_mail_server SET active = 'f';
 UPDATE fetchmail_server SET active = 'f';
 UPDATE ir_config_parameter SET value = 'null' WHERE key = 'database.uuid';
 " $PGDATABASE
}

# Main functions
function backup() {
  case "$1" in
    "odoo")
      echo "Dump the database $PGDATABASE"
      pg_dump --clean $PGDATABASE | gzip > /tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz
      echo "Push it to backup"
      rclone copy /tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz backup:/$BACKUP_SPACE/$BACKUP_BUCKET/
      echo "Sync the filestore to backup"
      rclone sync filestore:/$FILESTORE_SPACE/$FILESTORE_BUCKET/ backup:/$BACKUP_SPACE/$BACKUP_BUCKET/$RUNNING_ENV-$PGDATABASE-$TODAY/
      echo "Cleanup last month copy on backup"
      ! rclone purge backup:/$BACKUP_SPACE/$BACKUP_BUCKET/$RUNNING_ENV-$PGDATABASE-$LASTMONTH/
      ! rclone purge backup:/$BACKUP_SPACE/$BACKUP_BUCKET/$RUNNING_ENV-$PGDATABASE-$LASTMONTH.sql.gz
      if [ $REMOTE_ENABLED == 'true' ]; then
        echo "Push, sync and cleanup to/on remote"
        rclone copy /tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz remote:/$REMOTE_SPACE/$REMOTE_BUCKET/
        rclone sync filestore:/$FILESTORE_SPACE/$FILESTORE_BUCKET/ remote:/$REMOTE_SPACE/$REMOTE_BUCKET/$RUNNING_ENV-$PGDATABASE-$TODAY/
        ! rclone purge remote:/$REMOTE_SPACE/$REMOTE_BUCKET/$RUNNING_ENV-$PGDATABASE-$LASTMONTH/
        ! rclone purge remote:/$REMOTE_SPACE/$REMOTE_BUCKET/$RUNNING_ENV-$PGDATABASE-$LASTMONTH.sql.gz
      fi
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
      echo "Cleanup $PGDATABASE database and filestore"
      dropdb --if-exists $PGDATABASE
      echo "Create $PGDATABASE database"
      createdb $PGDATABASE
      echo "Download yesterday's backup"
      rclone copy backup:/$BACKUP_SPACE/$BACKUP_BUCKET/production-master-$YESTERDAY.sql.gz /tmp/
      echo "Sync the filestore"
      rclone sync backup:/$BACKUP_SPACE/$BACKUP_BUCKET/production-master-$YESTERDAY/ filestore:/$FILESTORE_SPACE/$FILESTORE_BUCKET/
      echo "Restore database dump"
      restore_odoo_database
      ;;
    *)
      echo "Restore profile does not exist. I don't know how to restore $1."
      exit 1
      ;;
  esac
}

[ "$DEBUG" == "1" ] && env | sort

config_rclone

$1 $2

exit 0
