#!/bin/bash
# Usage:
#   $0 odoo
#   $0 odoo scaffold
#   $0 odoo --test-enable --workers=0 --stop-after-init -d testodoo -i base

set -e

# set the postgres database host, port, user and password according to the environment
# and pass them as arguments to the odoo process if not present in the config file
: ${HOST:=${DB_PORT_5432_TCP_ADDR:='db'}}
: ${PORT:=${DB_PORT_5432_TCP_PORT:=5432}}
: ${USER:=${DB_ENV_POSTGRES_USER:=${POSTGRES_USER:='odoo'}}}
: ${PASSWORD:=${DB_ENV_POSTGRES_PASSWORD:=${POSTGRES_PASSWORD:='odoo'}}}
: ${MODE:=${MODE:='full'}}

DB_ARGS=()

function check_config() {
    param="$1"
    value="$2"
    if grep -q -E "^\s*\b${param}\b\s*=" "$ODOO_RC" ; then
        value=$(grep -E "^\s*\b${param}\b\s*=" "$ODOO_RC" |cut -d " " -f3|sed 's/["\n\r]//g')
    fi;
    DB_ARGS+=("--${param}")
    DB_ARGS+=("${value}")
}

function migrate() {
  OLD=""
  DB_EXIST=$(psql -X -A -t -h $HOST -p $PORT postgres -c "SELECT 1 AS result FROM pg_database WHERE datname = '$1'";)
  if [ "$DB_EXIST" = "1" ]; then
    TABLE_EXIST=$(psql -X -A -t -h $HOST -p $PORT -d $1 -c "
      SELECT EXISTS(
        SELECT *
        FROM information_schema.tables
        WHERE table_schema='public' AND
          table_catalog='$1' AND
          table_name='ir_config_parameter'
      )";)
    if [ "$TABLE_EXIST" = "1" ]; then
      OLD=$(psql -X -A -t -h $HOST -p $PORT -v ON_ERROR_STOP=1 -d $1 -c "SELECT value FROM ir_config_parameter WHERE key = 'database.version'" 2> /dev/null ;)
    fi
  fi
  NEW=$(grep version= /odoo/setup.py | sed -e 's/^ *version="//' -e 's/",$//')
  if [ "$OLD" != "$NEW" ]; then
    echo "db_name = $1" >> $OPENERP_SERVER
    export MARABUNTA_DATABASE=$1
    [ ! "$OLD" = "" ] && export MARABUNTA_FORCE_VERSION=$NEW
    marabunta --allow-serie=True
    sed -i -e '/db_name.*$/d' $OPENERP_SERVER
  fi
}

check_config "db_host" "$HOST"
check_config "db_port" "$PORT"
check_config "db_user" "$USER"
check_config "db_password" "$PASSWORD"

wait-for-psql.py ${DB_ARGS[@]} --timeout=30

export PGPASSWORD=$PASSWORD
# For Marabunta
export MARABUNTA_MIGRATION_FILE=/odoo/migration.yml
export MARABUNTA_DB_USER=$USER
export MARABUNTA_DB_PASSWORD=$PASSWORD
export MARABUNTA_DB_PORT=$PORT
export MARABUNTA_DB_HOST=$HOST
export MARABUNTA_MODE=$MODE
# For anthem
export OPENERP_SERVER=/etc/odoo/odoo.conf
export ODOO_DATA_PATH=/odoo/data

# Set database configuration in odoo.conf
grep db_host $OPENERP_SERVER > /dev/null || echo "db_host = $HOST" >> $OPENERP_SERVER
grep db_port $OPENERP_SERVER > /dev/null || echo "db_port = $PORT" >> $OPENERP_SERVER
grep db_user $OPENERP_SERVER > /dev/null || echo "db_user = $USER" >> $OPENERP_SERVER
grep db_password $OPENERP_SERVER > /dev/null || echo "db_password = $PASSWORD" >> $OPENERP_SERVER
sed -i -e '/db_name.*$/d' $OPENERP_SERVER

cd /odoo

# Check if the 2nd command line argument is --test-enable
if [ "$1" == "--test-enable" ] ; then
  # Change configuration of demo data
  sed -i -e 's/without_demo = all/without_demo = False/g' $OPENERP_SERVER
  # Run odoo with all command line arguments
  echo "Running Odoo with the following commands: odoo $@"
  exec odoo "$@"
  exit 0
else
  echo "Upgrade existing databases"
  DATABASES=$(psql -X -A -t -h $HOST -p $PORT postgres -c "
    SELECT datname
    FROM pg_database
    WHERE datname not in ('MASTER', 'BACKUP', 'LATEST', 'postgres', 'template0', 'template1')";)
  for DB_NAME in $DATABASES; do
    echo $DB_NAME
    migrate $DB_NAME
  done

  MASTER=$(psql -X -A -t -h $HOST -p $PORT postgres -c "SELECT 1 AS result FROM pg_database WHERE datname = 'MASTER'";)
  BACKUP=$(psql -X -A -t -h $HOST -p $PORT postgres -c "SELECT 1 AS result FROM pg_database WHERE datname = 'BACKUP'";)
  LATEST=$(psql -X -A -t -h $HOST -p $PORT postgres -c "SELECT 1 AS result FROM pg_database WHERE datname = 'LATEST'";)

  # If LATEST database exists, drop it, re-create it and upgrade
  if [ "$LATEST" = "1" ]; then
    echo "Drop, recreate and upgrade LATEST"
    export DB_NAME=LATEST
    dropdb -h $HOST -p $PORT $DB_NAME
    rm -rf /var/lib/odoo/filestore/$DB_NAME
    createdb -h $HOST -p $PORT $DB_NAME
    migrate $DB_NAME
  elif [ "$BACKUP" = "1" ]; then
    # If BACKUP database exists, copy it and upgrade it
    # TODO: Build DB_NAME with the tag of the image
    export DB_NAME=Test_$(date +'%Y%m%d')
    TODAY=$(psql -X -A -t -h $HOST -p $PORT postgres -c "SELECT 1 AS result FROM pg_database WHERE datname = '$DB_NAME';")
    # Create one TEST_YYYYMMDD database per day
    if [ ! "$TODAY" = "1" ] ; then
      echo "Create and upgrade $DB_NAME"
      psql -h $HOST -p $PORT postgres -c "CREATE DATABASE \"$DB_NAME\" WITH TEMPLATE 'BACKUP'";
      cp -R /var/lib/odoo/filestore/BACKUP /var/lib/odoo/filestore/$DB_NAME
      migrate $DB_NAME
    fi
  else
    # If MASTER database doesn't exist, create one...
    export DB_NAME=MASTER
    if [ ! "$MASTER" = "1" ]; then
      echo "Create MASTER"
      createdb -h $HOST -p $PORT $DB_NAME
    fi
    echo "Upgrade MASTER"
    migrate $DB_NAME
  fi

  # Start Odoo
  case "$1" in
      -- | odoo)
          shift
          if [[ "$1" == "scaffold" ]] ; then
              exec odoo "$@"
          else
              exec odoo "$@" "${DB_ARGS[@]}"
          fi
          ;;
      -*)
          exec odoo "$@" "${DB_ARGS[@]}"
          ;;
      *)
          exec "$@"
  esac
fi

exit 1
