#!/bin/bash

set -e

# Set default value to environment variables
export RUNNING_ENV="${RUNNING_ENV:='dev'}"
# PostgreSQL
export PGHOST="${PGHOST:=db}"
export PGPORT="${PGPORT:=5432}"
export PGUSER="${PGUSER:=frepple}"
export PGPASSWORD="${PGPASSWORD:=frepple}"
export PGDATABASE="${PGDATABASE:=false}"
export DEFAULTDB="${DEFAULTDB:=postgres}"

# Functions
function config_frepple() {
  echo "Configure FrePPle"
  dockerize -template $TEMPLATES/djangosettings.py.tmpl:/etc/frepple/djangosettings.py
}

function config_apache2() {
  echo "Configure Apache 2"
  echo "ServerName localhost" >> /etc/apache2/apache2.conf
}

# For dockerize
export TEMPLATES=/frepple/templates

config_frepple
config_apache2
wait-for-psql.py

EXIST=$(psql -X -A -t $DEFAULTDB -c "SELECT 1 AS result FROM pg_database WHERE datname = '$PGDATABASE'";)
if [ "$EXIST" != "1" ];
then
  echo "Creating $PGDATABASE database"
  createdb $PGDATABASE
  echo "Create FrePPle database schema"
  frepplectl migrate --noinput
fi

echo "Start Apache 2"
exec apachectl -D FOREGROUND

exit 1
