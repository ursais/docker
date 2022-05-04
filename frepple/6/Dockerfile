FROM ursa/ubuntu-20.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install FrePPLe
ENV VERSION=6.21.0
RUN apt update \
    && apt install -y --no-install-recommends \
        at \
        gcc \
        gnupg \
        libssl1.1 \
        python3-dev \
        python3-pip \
        python3-psycopg2 \
        python3-setuptools \
        python3-wheel \
    && curl -o frepple.deb -sSL https://github.com/frePPLe/frepple/releases/download/$VERSION/ubuntu20-frepple-$VERSION.deb \
    && apt install -y --no-install-recommends ./frepple.deb \
    && rm -rf /var/lib/apt/lists/* frepple.deb

# Update the PostgreSQL client to match the server
ENV PGVERSION=14
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main' > /etc/apt/sources.list.d/pgdg.list \
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt update \
    && apt install --no-install-recommends -y postgresql-client-$PGVERSION \
    && rm -f /etc/apt/sources.list.d/pgdg.list \
    && rm -rf /var/lib/apt/lists/*

# Configure Apache
RUN a2enmod expires \
    && a2ensite z_frepple \
    && a2enmod wsgi

# Copy files
COPY entrypoint.sh /
COPY requirements.txt /frepple/requirements.txt
COPY templates /frepple/templates
COPY wait-for-psql.py /usr/local/bin/wait-for-psql.py

# Install python3 modules
RUN pip3 install -r /frepple/requirements.txt

# Expose FrePPLe
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
