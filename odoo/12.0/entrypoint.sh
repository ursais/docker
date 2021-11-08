#!/bin/bash
# Usage:
#   $0 odoo
#   $0 odoo scaffold
#   $0 odoo --test-enable --workers=0 --stop-after-init -d testodoo -i base

set -e

# Set default value to environment variables
: ${PLATFORM:='aws'}
: ${RUNNING_ENV:='dev'}
: ${APP_IMAGE_VERSION:='latest'}
: ${MIGRATE:='true'}
# AWS
: ${AWS_HOST:='false'}
# Azure
: ${AZURE_STORAGE_CONNECTION_STRING:='false'}
: ${AZURE_STORAGE_ACCOUNT_KEY:='false'}
# Odoo
: ${ODOO_DATA_DIR:='/odoo/data'}
# PostgreSQL
: ${PGHOST:='db'}
: ${PGPORT:=5432}
: ${PGUSER:='odoo'}
: ${PGPASSWORD:='odoo'}
: ${PGDATABASE:='false'}
: ${DEFAULTDB:='postgres'}
: ${PGSSLMODE:='prefer'}
# MARABUNTA
: ${MARABUNTA_MODE:='base'}
: ${MARABUNTA_ALLOW_SERIE:='false'}

# Configuration functions
function config_rclone() {
  echo "Configure Rclone"
  mkdir -p $HOME/.config/rclone
  dockerize -template $TEMPLATES/rclone.conf.tmpl:$HOME/.config/rclone/rclone.conf
}

function config_odoo() {
  echo "Configure Odoo"
  dockerize -template $TEMPLATES/odoo.conf.tmpl:$ODOO_RC
  chown -R odoo $ODOO_DATA_DIR $ODOO_RC
}

# Main functions
function migrate() {
  OLD=""
  export DB_NAME=$1
  DB_EXIST=$(psql -X -A -t -d $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$DB_NAME'";)
  if [ "$DB_EXIST" = "1" ]; then
    TABLE_EXIST=$(psql -X -A -t -d $DB_NAME -c "
      SELECT EXISTS(
        SELECT *
        FROM information_schema.tables
        WHERE table_schema='public' AND
          table_catalog='$DB_NAME' AND
          table_name='ir_config_parameter'
      )";)
    if [ "$TABLE_EXIST" = "1" ]; then
      OLD=$(psql -X -A -t -v ON_ERROR_STOP=1 -d $DB_NAME -c "SELECT value FROM ir_config_parameter WHERE key = 'database.version'" 2> /dev/null ;)
    fi
  fi
  NEW=$(grep version= /odoo/setup.py | sed -e 's/^ *version="//' -e 's/",$//')
  if [ "$OLD" != "$NEW" ]; then
    sed -i -e "s/db_name =.*/db_name = $DB_NAME/" "$ODOO_RC"
    OLD_PGDATABASE=$PGDATABASE
    export MARABUNTA_DATABASE=$DB_NAME
    export PGDATABASE=$DB_NAME
    [ "$OLD" != "" ] && export MARABUNTA_FORCE_VERSION=$NEW
    echo "Migrating $DB_NAME"
    gosu odoo marabunta
    sed -i -e "s/db_name =.*/db_name = $OLD_PGDATABASE/" "$ODOO_RC"
    export PGDATABASE=$OLD_PGDATABASE
  fi
}

function duplicate() {
  BACKUP=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = 'backup';")
  if [ "$BACKUP" == "1" ]; then
    # If backup database exists, copy it and upgrade it
    EXISTS=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$1';")
    if [ "$EXISTS" != "1" ]; then
      echo "Duplicating backup to $1"
      psql $DEFAULTDB -c "CREATE DATABASE \"$1\" WITH TEMPLATE \"backup\"";
      case "$PLATFORM" in
        "aws")
          BUCKET=`echo $AWS_BUCKETNAME | sed -e "s/{db}/$1/g"`
          BACKUP_BUCKET=`echo $AWS_BUCKETNAME | sed -e "s/{db}/backup/g"`
          # Internal Field Separator: Split string by dashes in to an array
          IFS='-' read -r -a bucket_name_array <<< "$AWS_BUCKETNAME"
          # Put together production bucket string
          PRODUCTION_BUCKET_NAME=`echo production-master-${bucket_name_array[2]}`
          echo "Sync $BACKUP_BUCKET to $BUCKET"
          rclone sync filestore:/$BACKUP_BUCKET/ filestore:/$BUCKET/
          echo "Replace attachment paths for database $1"
          psql -d $1 -c "
            UPDATE ir_attachment AS t SET store_fname = s.store_fname FROM (
              SELECT id,REPLACE(store_fname, '/$PRODUCTION_BUCKET_NAME/', '/$BUCKET/')
                AS store_fname FROM ir_attachment WHERE store_fname IS NOT NULL)
            AS s(id,store_fname) where t.id = s.id;"
          ;;
        "azure")
          rclone sync filestore:/$RUNNING_ENV-backup/ filestore:/$RUNNING_ENV-$1/
          ;;
        "do")
          rclone sync filestore:/$RUNNING_ENV-backup/ filestore:/$RUNNING_ENV-$1/
          psql -d $1 -c "
            UPDATE ir_attachment AS t SET store_fname = s.store_fname FROM (
              SELECT id,REPLACE(store_fname, '/production-master/', '$RUNNING_ENV-$1')
                AS store_fname FROM ir_attachment WHERE db_datas is NULL)
            AS s(id,store_fname) where t.id = s.id;"
          ;;
        *)
          cp -R $ODOO_DATA_DIR/filestore/backup $ODOO_DATA_DIR/filestore/$1
          ;;
      esac
      migrate $1
    fi
  else
    # If backup database does not exist, create the database and upgrade it
    create $1
    migrate $1
  fi
}

function create() {
  EXIST=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$1'";)
  if [ "$EXIST" != "1" ]; then
    echo "Creating $1"
    createdb --maintenance-db=$DEFAULTDB $1
    case "$PLATFORM" in
      "aws")
        export BUCKET=`echo $AWS_BUCKETNAME | sed -e "s/{db}/$1/g"`
        rclone mkdir filestore:/$BUCKET/
        ;;
      *)
        ;;
    esac
  fi
}

function drop() {
  echo "Dropping $1"
  dropdb --if-exists --maintenance-db=$DEFAULTDB $1
  case "$PLATFORM" in
    "aws")
      export BUCKET=`echo $AWS_BUCKETNAME | sed -e "s/{db}/$1/g"`
      ! rclone purge filestore:/$BUCKET/
      ;;
    "azure")
      ! rclone purge filestore:/$RUNNING_ENV-$1/
      ;;
    "do")
      export BUCKET=`echo $AWS_BUCKETNAME | sed -e "s/{db}/$1/g"`
      ! rclone purge filestore:/$BUCKET/
      ;;
    *)
      rm -Rf $ODOO_DATA_DIR/filestore/$1
      ;;
  esac
}

function upgrade_existing() {
  echo "Upgrade existing databases"
  DATABASES=$(psql -X -A -t $DEFAULTDB -c "
    SELECT datname
    FROM pg_database
    WHERE datname not in ('master', 'backup', 'latest', 'postgres', 'azure_maintenance', 'azure_sys', '_dodb', 'defaultdb', 'rdsadmin', 'template0', 'template1')";)
  for DB_NAME in $DATABASES; do
    echo "Upgrading $DB_NAME"
    migrate $DB_NAME
  done
}

# For dockerize
export TEMPLATES=/odoo/templates
# For Marabunta
export MARABUNTA_MIGRATION_FILE=/odoo/migration.yml
export MARABUNTA_DB_USER=$PGUSER
export MARABUNTA_DB_PASSWORD=$PGPASSWORD
export MARABUNTA_DB_PORT=$PGPORT
export MARABUNTA_DB_HOST=$PGHOST
# For anthem
export ODOO_DATA_PATH=/odoo/songs/data

[ "$DEBUG" == "1" ] && env | sort
config_rclone
[ "$DEBUG" == "1" ] && env | sort
config_odoo
[ "$DEBUG" == "1" ] && env | sort

# shellcheck disable=SC2068
wait-for-psql.py --db_host=$PGHOST --db_port=$PGPORT --db_user=$PGUSER --db_password=$PGPASSWORD --timeout=30 --db_name=${DEFAULTDB}

cd /odoo

# Check if the 2nd command line argument is --test-enable
if [ "$1" == "--test-enable" ] ; then
  # Change configuration of demo data
  sed -i -e 's/without_demo = all/without_demo = False/g' $ODOO_RC
  # Run odoo with all command line arguments
  # shellcheck disable=SC2145
  echo "Running Odoo with the following commands: odoo $@"
  exec gosu odoo odoo "$@"
  exit 0
# RUNNING_ENV must be set and MIGRATE must be true to perform migration.
elif [ ${MIGRATE,,} == "true" ]; then
  case "$RUNNING_ENV" in
    "production")
      create master
      migrate master
      ;;
    "qa")
      upgrade_existing
      duplicate $APP_IMAGE_VERSION
      ;;
    "test")
      upgrade_existing
      duplicate $(date -u +'%Y%m%d')
      ;;
    "dev")
      drop latest
      create latest
      migrate latest
      ;;
    *)
      echo Running environment is not set.
      ;;
  esac
else
  echo Migration has been turned off.
fi


  # Start Odoo
  case "$1" in
      -- | odoo)
          shift
          if [[ "$1" == "scaffold" ]] ; then
              exec gosu odoo odoo "$@"
          else
              exec gosu odoo odoo "$@"
          fi
          ;;
      -*)
          exec gosu odoo odoo "$@"
          ;;
      *)
          exec gosu odoo "$@"
          ;;
  esac

exit 1
