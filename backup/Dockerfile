FROM ubuntu-24.04:latest
LABEL org.opencontainers.image.authors="Gray Matter Logic <support@graymatterlogic.com>"

# Install some deps
RUN apt update \
    && apt install -y --no-install-recommends \
      bzip2 \
      ca-certificates \
      gnupg \
      gzip \
      openssh-client \
      postgresql-client \
      rclone \
      rsync \
      tar \
      wget \
      zip \
    && apt clean all


# Copy files
COPY entrypoint.sh /
COPY templates /templates

ENTRYPOINT ["/entrypoint.sh"]
