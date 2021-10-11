FROM ursa/ubuntu-20.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      bzip2 \
      ca-certificates \
      gnupg \
      gzip \
      openssh-client \
      rclone \
      rsync \
      tar \
      wget \
      zip \
      && apt-get clean all

# Update the PostgreSQL client to match the server (13)
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client-13 \
    && rm -f /etc/apt/sources.list.d/pgdg.list \
    && rm -rf /var/lib/apt/lists/*

# Copy files
COPY entrypoint.sh /
COPY templates /templates

ENTRYPOINT ["/entrypoint.sh"]
