FROM postgres:14
LABEL org.opencontainers.image.authors="Gray Matter Logic <support@graymatterlogic.com>"

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        htop \
        iotop \
        postgresql-14-postgis-3 \
        postgresql-14-postgis-3-scripts \
        postgresql-contrib \
        pg-activity \
        vim \
    && rm -rf /var/lib/apt/lists/*
