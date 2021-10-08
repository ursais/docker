FROM ubuntu:18.04
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

SHELL ["/bin/bash", "-xo", "pipefail", "-c"]

# Generate locale C.UTF-8
ENV LANG C.UTF-8

RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    htop \
    tar \
    vim \
  && apt-get clean all \
  && apt-get autoremove

# Install dockerize for config files
RUN curl -sfL $(curl -s https://api.github.com/repos/powerman/dockerize/releases/latest \
  | grep -i /dockerize-$(uname -s)-$(uname -m)\" | cut -d\" -f4) \
  | install /dev/stdin /usr/local/bin/dockerize
