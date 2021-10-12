FROM ursa/ubuntu-20.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some deps
RUN apt update \
    && apt install -y --no-install-recommends \
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
    && apt clean all

# Update the PostgreSQL client
ENV PGVERSION=14
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt update \
    && apt install -y --no-install-recommends postgresql-client-$PGVERSION \
    && rm -f /etc/apt/sources.list.d/pgdg.list \
    && rm -rf /var/lib/apt/lists/*

# Copy files
COPY entrypoint.sh /
COPY templates /templates

ENTRYPOINT ["/entrypoint.sh"]
