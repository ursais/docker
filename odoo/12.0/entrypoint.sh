#!/bin/bash
# Usage:
#   $0 odoo
#   $0 odoo scaffold
#   $0 odoo --test-enable --workers=0 --stop-after-init -d testodoo -i base

set -e

# Set default value to environment variables
: ${RUNNING_ENV:='dev'}
# Odoo
: ${ODOO_DATA_DIR:='/data'}
# PostgreSQL
: ${PGHOST:='db'}
: ${PGPORT:=5432}
: ${PGUSER:='odoo'}
: ${PGPASSWORD:='odoo'}
: ${PGDATABASE:='False'}
: ${DEFAULTDB:='postgres'}
# MARABUNTA
: ${MARABUNTA_MODE:='full'}
: ${MARABUNTA_ALLOW_SERIE:='false'}

function config_s3cmd() {
  echo "Configure s3cmd"
  export S3CMD_HOST=`echo $AWS_HOST | sed -e "s/^.*.$AWS_REGION/$AWS_REGION/"`
  dockerize -template $TEMPLATES/s3cfg.tmpl:$HOME/.s3cfg
  export DO_SPACE=`echo $AWS_HOST | sed -e "s/.$AWS_REGION.*$//"`
}

function config_odoo() {
  echo "Configure Odoo"
  dockerize -template $TEMPLATES/odoo.conf.tmpl:$ODOO_RC
}

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
    marabunta
    sed -i -e "s/db_name =.*/db_name = $OLD_PGDATABASE/" "$ODOO_RC"
    export PGDATABASE=$OLD_PGDATABASE
  fi
}

function duplicate() {
  BACKUP=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = 'BACKUP';")
  if [ "$BACKUP" == "1" ]; then
    # If BACKUP database exists, copy it and upgrade it
    # TODO: Build DB_NAME with the tag of the image
    export DB_NAME=$(date -u +'%Y%m%d')
    TODAY=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$DB_NAME';")
    # Create one YYYYMMDD database per day and migrate it
    if [ "$TODAY" != "1" ] ; then
      echo "Duplicating BACKUP to $DB_NAME"
      psql $DEFAULTDB -c "CREATE DATABASE \"$DB_NAME\" WITH TEMPLATE \"BACKUP\"";
      if [ "$AWS_HOST" == "false" ]; then
        cp -R $ODOO_DATA_DIR/filestore/BACKUP $ODOO_DATA_DIR/filestore/$DB_NAME
      else
        s3cmd sync s3://$DO_SPACE/$RUNNING_ENV-BACKUP/ s3://$DO_SPACE/$RUNNING_ENV-$DB_NAME/
      fi
      migrate $DB_NAME
    fi
  fi
}

function create() {
  EXIST=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$1'";)
  if [ "$EXIST" != "1" ]; then
    echo "Creating $1"
    createdb $1
  fi
}

function drop() {
  echo "Dropping $1"
  dropdb --if-exists $1
  if [ "$AWS_HOST" == "false" ]; then
    rm -Rf $ODOO_DATA_DIR/filestore/$1
  else
    s3cmd rm --force --recursive s3://$DO_SPACE/$RUNNING_ENV-$1/
  fi
}

function upgrade_existing () {
  echo "Upgrade existing databases"
  DATABASES=$(psql -X -A -t $DEFAULTDB -c "
    SELECT datname
    FROM pg_database
    WHERE datname not in ('MASTER', 'BACKUP', 'LATEST', 'postgres', '_dodb', 'defaultdb', 'template0', 'template1')";)
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
export ODOO_DATA_PATH=/odoo/data

[[ -z "$AWS_HOST" ]] || config_s3cmd
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
  exec odoo "$@"
  exit 0
else
  case "$RUNNING_ENV" in
    "production")
      create MASTER
      migrate MASTER
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
      drop LATEST
      create LATEST
      migrate LATEST
      ;;
    *)
      ;;
  esac
  
  # Start Odoo
  case "$1" in
      -- | odoo)
          shift
          if [[ "$1" == "scaffold" ]] ; then
              exec odoo "$@"
          else
              exec odoo "$@"
          fi
          ;;
      -*)
          exec odoo "$@"
          ;;
      *)
          exec "$@"
  esac
fi

exit 1
