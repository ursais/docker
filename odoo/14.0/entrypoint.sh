#!/bin/bash
# Usage:
#   $0 odoo
#   $0 odoo scaffold
#   $0 odoo --test-enable --workers=0 --stop-after-init -d testodoo -i base

set -e

# Set default value to environment variables
: ${PLATFORM:='do'}
: ${RUNNING_ENV:='dev'}
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
  case "$PLATFORM" in
    "aws")
      SPACE=""
      ;;
    "azure")
      SPACE=""
      ;;
    "do")
      SPACE=`echo $AWS_HOST | sed -e "s/.$AWS_REGION.*$//"`
      ;;
    *)
      echo "I don't know how to get the bucket for this platform."
      ;;
  esac
  export SPACE
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
    # TODO: Build DB_NAME with the tag of the image
    export DB_NAME=$(date -u +'%Y%m%d')
    TODAY=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$DB_NAME';")
    # Create one YYYYMMDD database per day and migrate it
    if [ "$TODAY" != "1" ]; then
      echo "Duplicating backup to $DB_NAME"
      psql $DEFAULTDB -c "CREATE DATABASE \"$DB_NAME\" WITH TEMPLATE \"backup\"";
      case "$PLATFORM" in
        "aws")
          rclone sync remote:/$SPACE/$RUNNING_ENV-backup/ remote:/$SPACE/$RUNNING_ENV-$DB_NAME/
          psql -d $DB_NAME -c "
            UPDATE ir_attachment AS t SET store_fname = s.store_fname FROM (
              SELECT id,REPLACE(store_fname, 'production-master', '$RUNNING_ENV-$DB_NAME')
                AS store_fname FROM ir_attachment WHERE db_datas is NULL)
            AS s(id,store_fname) where t.id = s.id;"
          ;;
        "azure")
          rclone sync remote:/$SPACE/$RUNNING_ENV-backup/ remote:/$SPACE/$RUNNING_ENV-$DB_NAME/
          ;;
        "do")
          rclone sync remote:/$SPACE/$RUNNING_ENV-backup/ remote:/$SPACE/$RUNNING_ENV-$DB_NAME/
          psql -d $DB_NAME -c "
            UPDATE ir_attachment AS t SET store_fname = s.store_fname FROM (
              SELECT id,REPLACE(store_fname, 'production-master', '$RUNNING_ENV-$DB_NAME')
                AS store_fname FROM ir_attachment WHERE db_datas is NULL)
            AS s(id,store_fname) where t.id = s.id;"
          ;;
        *)
          cp -R $ODOO_DATA_DIR/filestore/backup $ODOO_DATA_DIR/filestore/$DB_NAME
          ;;
      esac
      migrate $DB_NAME
    fi
  fi
}

function create() {
  EXIST=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$1'";)
  if [ "$EXIST" != "1" ]; then
    echo "Creating $1"
    createdb --maintenance-db=$DEFAULTDB $1
    case "$PLATFORM" in
      "aws")
        BUCKET=`echo $BUCKET_NAME | sed -e "s/{db}/$1/g"`
        rclone mkdir remote:/$BUCKET/
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
      BUCKET=`echo $AWS_BUCKETNAME | sed -e "s/{db}/$1/g"`
      rclone purge remote:/$BUCKET/
      ;;
    "azure")
      rclone purge remote:/$RUNNING_ENV-$1/
      ;;
    "do")
      BUCKET=`echo $AWS_BUCKETNAME | sed -e "s/{db}/$1/g"`
      rclone purge remote:/$SPACE/$BUCKET/
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
    WHERE datname not in ('master', 'backup', 'latest', 'postgres', 'azure_maintenance', 'azure_sys', '_dodb', 'defaultdb', 'template0', 'template1')";)
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

config_rclone
config_odoo

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
else
  case "$RUNNING_ENV" in
    "production")
      create master
      migrate master
      ;;
    "qa")
      upgrade_existing
      duplicate
      ;;
    "test")
      upgrade_existing
      duplicate
      ;;
    "dev")
      drop latest
      create latest
      migrate latest
      ;;
    *)
      ;;
  esac

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
fi

exit 1
