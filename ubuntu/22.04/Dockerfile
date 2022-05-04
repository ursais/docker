FROM ubuntu:jammy
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

SHELL ["/bin/bash", "-xo", "pipefail", "-c"]

# Generate locale C.UTF-8
ENV LANG C.UTF-8
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update \
  && apt upgrade -y \
  && apt install -y --no-install-recommends \
    ca-certificates \
    curl \
    htop \
    iotop \
    rsync \
    tar \
    vim \
    unzip \
  && apt clean all \
  && apt autoremove

# Install dockerize for config files
RUN curl -sfL $(curl -s https://api.github.com/repos/powerman/dockerize/releases/latest \
  | grep -i /dockerize-$(uname -s)-$(uname -m)\" | cut -d\" -f4) \
  | install /dev/stdin /usr/local/bin/dockerize
