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

# Functions
function config_s3() {
  command -v s3cmd > /dev/null 2>&1
  if [ "$AWS_HOST" != "false" ] && [ "$?" == "0" ]; then
    # If AWS_HOST is set and s3cmd is installed, configure it
    S3CMD_HOST=`echo $AWS_HOST | sed -e "s/^.*.$AWS_REGION/$AWS_REGION/"`
    cat << EOF >  ~/.s3cfg
[default]
access_key = $AWS_ACCESS_KEY_ID
host_base = $S3CMD_HOST
host_bucket = %(bucket)s.$S3CMD_HOST
secret_key = $AWS_SECRET_ACCESS_KEY
EOF
    export DO_SPACE=`echo $AWS_HOST | sed -e "s/.$AWS_REGION.*$//"`
  fi
}

function backup() {
  case "$1" in
    "odoo")
      # Dump the database
      pg_dump --clean $PGDATABASE | gzip > /tmp/$TODAY.sql.gz
      # Push it to the space
      s3cmd put /tmp/$TODAY.sql.gz s3://$DO_SPACE/backup/
      # Duplicate the filestore
      s3cmd cp --recursive s3://$DO_SPACE/$RUNNING_ENV/$PGDATABASE/ s3://$DO_SPACE/backup/$TODAY/
      # Cleanup last week backup
      s3cmd rm --recursive s3://$DO_SPACE/backup/$LASTWEEK/
      ;;
    *)
      echo "Backup profile does not exist. I don't know how to backup $1."
      ;;
  esac
}

function restore() {
  case "$1" in
    "odoo")
      # Cleanup
      dropdb --if-exists BACKUP
      s3cmd rm --recursive s3://$DO_SPACE/$RUNNING_ENV/BACKUP
      createdb BACKUP
      # Download the latest one
      s3cmd get s3://$DO_SPACE/backup/$YESTERDAY.sql.gz /tmp/$YESTERDAY.sql.gz
      # Load it in BACKUP
      zcat /tmp/$YESTERDAY.sql.gz | psql BACKUP
      # Deactivate the cron jobs and email servers
      psql -c "
      UPDATE ir_cron SET active = 'f';
      UPDATE ir_mail_server SET active = 'f';
      UPDATE fetchmail_server SET active = 'f';
      " BACKUP
      # Copy the filestore
      s3cmd cp --recursive s3://$DO_SPACE/backup/$YESTERDAY/ s3://$DO_SPACE/$RUNNING_ENV/BACKUP/
      ;;
    *)
      echo "Restore profile does not exist. I don't know how to restore $1."
      ;;
  esac
}

config_s3

$1 $2

exit 0
