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
  echo "Configure FrePPLe"
  dockerize -template $TEMPLATES/djangosettings.py.tmpl:/etc/frepple/djangosettings.py
  chown www-data:www-data /etc/frepple/djangosettings.py
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
  echo "Creating $PGDATABASE databases"
  createdb $PGDATABASE
  echo "Create FrePPLe databases"
  frepplectl migrate --noinput
  frepplectl createdatabase --database=scenario1
  frepplectl createdatabase --database=scenario2
  frepplectl createdatabase --database=scenario3
fi

echo "Configure atd"
echo www-data > /etc/at.allow

echo "Start atd"
service atd start

echo "Start Apache 2"
exec apachectl -D FOREGROUND

exit 1
