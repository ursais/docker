FROM postgres:13
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        htop \
        iotop \
        postgresql-13-postgis-3 \
        postgresql-13-postgis-3-scripts \
        postgresql-contrib \
        pg-activity \
        vim \
    && rm -rf /var/lib/apt/lists/*

USER postgres
