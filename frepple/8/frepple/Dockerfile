#FROM 880063853698.dkr.ecr.us-west-2.amazonaws.com/strymon-frepple:frepple-8-0-3-official
FROM ghcr.io/frepple/frepple-enterprise:8.0.3
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>


# Update the PostgreSQL client to match the server
ENV PGVERSION=14
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main' > /etc/apt/sources.list.d/pgdg.list \
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt update \
    && apt install --no-install-recommends -y postgresql-client-$PGVERSION \
    && rm -f /etc/apt/sources.list.d/pgdg.list \
    && rm -rf /var/lib/apt/lists/*

# Install Dockerize in order to use the djangosettings template
ENV DOCKERIZE_VERSION v0.7.0
RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

# Install python and pip to install frePPLe requirements
RUN apt-get install -y python3
RUN apt-get update && apt-get -y install python3-pip

# Copy files
COPY entrypoint.sh /
COPY templates /frepple/templates
COPY requirements.txt /frepple/requirements.txt
COPY license.xml /etc/frepple/

# Install python3 modules
RUN pip install -r /frepple/requirements.txt

# Expose FrePPLe
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
