FROM ubuntu:noble
LABEL org.opencontainers.image.authors="Gray Matter Logic <support@graymatterlogic.com>"

SHELL ["/bin/bash", "-xo", "pipefail", "-c"]

# Generate locale C.UTF-8
ENV LANG=C.UTF-8
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update \
  && apt upgrade -y \
  && apt install -y --no-install-recommends \
    ca-certificates \
    curl \
    gosu \
    htop \
    iotop \
    rsync \
    tar \
    vim \
    unzip \
  && apt clean all \
  && apt autoremove

# Install dockerize for config files
RUN curl -sfL https://github.com/powerman/dockerize/releases/download/v0.24.3/dockerize-v0.24.3-linux-amd64 \
  | install /dev/stdin /usr/local/bin/dockerize
