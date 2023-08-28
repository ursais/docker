#!/bin/bash

set -e

# Set default value to environment variables
export RUNNING_ENV="${RUNNING_ENV:='dev'}"

# PostgreSQL
export PGHOST="${POSTGRES_HOST:=db}"
export PGPORT="${POSTGRES_PORT:=5432}"
export PGUSER="${POSTGRES_USER:=frepple}"
export PGPASSWORD="${POSTGRES_PASSWORD:=frepple}"
export PGDATABASE="${POSTGRES_DBNAME:=false}"
export DEFAULTDB="${DEFAULTDB:=postgres}"

# Functions
function config_frepple() {
  echo "Configure FrePPLe"
  dockerize -template $TEMPLATES/djangosettings.py.tmpl:/etc/frepple/djangosettings.py
}

# For dockerize
export TEMPLATES=/frepple/templates
config_frepple

# Wait for database to be ready
echo "Waiting for the database to be ready"
retries=10
until pg_isready --timeout=1 "${params[@]}" >/dev/null 2>&1
do
  sleep 1
  ((retries=retries-1))
  if [ $retries -eq 0 ]
  then
    echo "Can't connect to PostgreSQL on $POSTGRES_HOST:$POSTGRES_PORT as user ${POSTGRES_USER:-frepple}"
    exit 1
  fi
done
echo "Connected to PostgreSQL on $POSTGRES_HOST:$POSTGRES_PORT as user ${POSTGRES_USER:-frepple}"

# Create and migrate the databases
frepplectl createdatabase --skip-if-exists
frepplectl migrate --noinput

# Configure Apache
grep -qxF 'ServerName' /etc/apache2/apache2.conf || echo "ServerName localhost" >> /etc/apache2/apache2.conf
rm -f /usr/local/apache2/logs/httpd.pid

# Allow custom configuration steps to be added
if [[ -d "/etc/frepple/entrypoint.d" ]]; then
  /bin/run-parts --verbose "/etc/frepple/entrypoint.d"
fi

#Start apache web server
echo "Starting web server"
exec apachectl -D FOREGROUND

exit 1