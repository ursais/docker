#!/bin/bash
# Usage:
#   $0 backup odoo
#   $0 restore odoo

set -e

# Environment variables
: ${RUNNING_ENV:='dev'}
: ${PLATFORM:='do'}
# PostgreSQL
: ${PGHOST:='localhost'}
: ${PGPORT:=5432}
: ${PGDATABASE:='master'}
: ${PGUSER:='postgres'}
: ${PGPASSWORD:='postgres'}
: ${PGDEFAULTDB:='postgres'}
: ${PGSSLMODE:='prefer'}
# AWS / DO
: ${AWS_HOST:='false'}
: ${AWS_REGION:='false'}
: ${AWS_ACCESS_KEY_ID:='false'}
: ${AWS_SECRET_ACCESS_KEY:='false'}
: ${AWS_BUCKETNAME:='false'}
# Azure
: ${AZURE_STORAGE_ACCOUNT_URL:='false'}
# Date in UTC
export TODAY=$(date -u +%Y%m%d)
export YESTERDAY=$(date -d "1 day ago" -u +%Y%m%d)
export LASTWEEK=$(date -d "1 week ago" -u +%Y%m%d)
# For dockerize
export TEMPLATES=/templates

# Configuration functions
function config_rclone() {
  echo "Configure rclone"
  mkdir -p $HOME/.config/rclone
  dockerize -template $TEMPLATES/rclone.conf.tmpl:$HOME/.config/rclone/rclone.conf
  case "$PLATFORM" in
    "aws")
      export SPACE=""
      ;;
    "azure")
      export SPACE=""
      ;;
    "do")
      export SPACE=`echo $AWS_HOST | sed -e "s/.$AWS_REGION.*$//"`
      ;;
    *)
      echo "I don't know how to configure rclone for $PLATFORM."
      exit 1
      ;;
  esac
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
 " $PGDATABASE
}

# Main functions
function backup() {
  case "$1" in
    "odoo")
      echo "Dump the database $PGDATABASE"
      pg_dump --clean $PGDATABASE | gzip > /tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz
      echo "Push it to the container"
      rclone copy /tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz remote:/$SPACE/backup/
      echo "Duplicate the filestore"
      rclone sync remote:/$SPACE/$RUNNING_ENV-$PGDATABASE/ remote:/$SPACE/backup/$RUNNING_ENV-$PGDATABASE-$TODAY/
      echo "Cleanup last week backup"
      rclone purge remote:/$SPACE/backup/$RUNNING_ENV-$PGDATABASE-$LASTWEEK/
      rclone purge remote:/$SPACE/backup/$RUNNING_ENV-$PGDATABASE-$LASTWEEK.sql.gz
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
      echo "Delete current $PGDATABASE filestore"
      rclone purge remote:/$SPACE/$RUNNING_ENV-$PGDATABASE/
      echo "Download yesterday's backup"
      rclone copy remote:/$SPACE/backup/production-master-$YESTERDAY.sql.gz /tmp/
      echo "Copy the filestore"
      rclone sync remote:/$SPACE/backup/production-master-$YESTERDAY/ remote:/$SPACE/$RUNNING_ENV-$PGDATABASE/
      echo "Restore database dump"
      restore_odoo_database
      ;;
    *)
      echo "Restore profile does not exist. I don't know how to restore $1."
      exit 1
      ;;
  esac
}

config_rclone

$1 $2

exit 0
