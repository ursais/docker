FROM ursa/ubuntu-24.04:latest
LABEL MAINTAINER="Gray Matter Logic <support@graymatterlogic.com>"

# Install some deps
RUN apt update \
    && apt install -y --no-install-recommends \
      bzip2 \
      ca-certificates \
      gnupg \
      gzip \
      openssh-client \
      rsync \
      tar \
      wget \
      zip \
    && apt clean all

# Install Rclone
RUN curl https://rclone.org/install.sh | bash

# Update the PostgreSQL client
ENV PGVERSION=14
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/pgdg-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/pgdg-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt update \
    && apt install -y --no-install-recommends postgresql-client-$PGVERSION \
    && rm -f /etc/apt/sources.list.d/pgdg.list /usr/share/keyrings/pgdg-archive-keyring.gpg \
    && rm -rf /var/lib/apt/lists/*

# Copy files
COPY entrypoint.sh /
COPY templates /templates

ENTRYPOINT ["/entrypoint.sh"]
