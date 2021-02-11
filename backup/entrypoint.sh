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
: ${PGDATABASE:='MASTER'}
: ${PGUSER:='postgres'}
: ${PGPASSWORD:='postgres'}
: ${PGDEFAULTDB:='postgres'}
# AWS
: ${AWS_HOST:='false'}
: ${AWS_REGION:='false'}
: ${AWS_ACCESS_KEY_ID:='false'}
: ${AWS_SECRET_ACCESS_KEY:='false'}
: ${AWS_BUCKETNAME:='false'}
# Date in UTC
export TODAY=$(date -u +%Y%m%d)
export YESTERDAY=$(date -d "1 day ago" -u +%Y%m%d)
export LASTWEEK=$(date -d "1 week ago" -u +%Y%m%d)
# For dockerize
export TEMPLATES=/templates

# Functions
function config_s3() {
  echo "Configure s3cmd"
  export S3CMD_HOST=`echo $AWS_HOST | sed -e "s/^.*.$AWS_REGION/$AWS_REGION/"`
  dockerize -template $TEMPLATES/s3cfg.tmpl:$HOME/.s3cfg
  export DO_SPACE=`echo $AWS_HOST | sed -e "s/.$AWS_REGION.*$//"`
}

function backup() {
  case "$1" in
    "odoo")
      echo "Dump the database $PGDATABASE"
      pg_dump --clean $PGDATABASE | gzip > /tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz
      echo "Push it to the space"
      s3cmd put /tmp/$RUNNING_ENV-$PGDATABASE-$TODAY.sql.gz s3://$DO_SPACE/backup/
      echo "Duplicate the filestore"
      s3cmd cp -r s3://$DO_SPACE/$RUNNING_ENV-$PGDATABASE/ s3://$DO_SPACE/backup/$RUNNING_ENV-$PGDATABASE-$TODAY/
      echo "Cleanup last week backup"
      s3cmd rm -r s3://$DO_SPACE/backup/$RUNNING_ENV-$PGDATABASE-$LASTWEEK/
      s3cmd rm s3://$DO_SPACE/backup/$RUNNING_ENV-$PGDATABASE-$LASTWEEK.sql.gz
      ;;
    *)
      echo "Backup profile does not exist. I don't know how to backup $1."
      ;;
  esac
}

function restore() {
  case "$1" in
    "odoo")
      echo "Cleanup $PGDATABASE database and filestore"
      dropdb --if-exists $PGDATABASE
      s3cmd rm -r s3://$DO_SPACE/$RUNNING_ENV-$PGDATABASE/
      echo "Create $PGDATABASE database"
      createdb $PGDATABASE
      echo "Download yesterday's backup"
      s3cmd get s3://$DO_SPACE/backup/production-MASTER-$YESTERDAY.sql.gz /tmp/production-MASTER-$YESTERDAY.sql.gz
      echo "Load it in $PGDATABASE"
      zcat /tmp/production-MASTER-$YESTERDAY.sql.gz | psql $PGDATABASE
      echo "Deactivate the cron jobs and email servers"
      psql -c "
      UPDATE ir_cron SET active = 'f';
      UPDATE ir_mail_server SET active = 'f';
      UPDATE fetchmail_server SET active = 'f';
      " $PGDATABASE
      echo "Copy the filestore"
      s3cmd cp -r s3://$DO_SPACE/backup/production-MASTER-$YESTERDAY/ s3://$DO_SPACE/$RUNNING_ENV-$PGDATABASE/
      ;;
    *)
      echo "Restore profile does not exist. I don't know how to restore $1."
      ;;
  esac
}

config_s3

$1 $2

exit 0
