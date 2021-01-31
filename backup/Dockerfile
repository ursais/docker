FROM ursa/ubuntu-20.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      bzip2 \
      ca-certificates \
      gzip \
      openssh-client \
      postgresql-client \
      rsync \
      s3cmd \
      tar \
      wget \
      zip \
      && apt-get clean all

# Copy files
COPY entrypoint.sh /
COPY s3cfg /root/.s3cfg

ENTRYPOINT ["/entrypoint.sh"]