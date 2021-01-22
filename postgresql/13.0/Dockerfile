FROM postgres:13
MAINTAINER Open Source Integrators <contact@opensourceintegrators.com>

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-13-postgis-3 \
        postgresql-13-postgis-3-scripts \
        postgresql-contrib \
        pg-activity \
    && rm -rf /var/lib/apt/lists/*
