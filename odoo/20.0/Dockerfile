FROM ghcr.io/ursais/ubuntu-24.04:latest
LABEL org.opencontainers.image.authors="Gray Matter Logic <support@graymatterlogic.com>"

# Retrieve the target architecture to install the correct wkhtmltopdf package
ARG TARGETARCH

# Install dependencies including wkhtmltopdf compatibility libs
RUN apt update \
    && apt install -y --no-install-recommends \
      python3-numpy \
      python3-pip \
      python3-redis \
      python3-urllib3 \
      fontconfig \
      libx11-6 \
      libxcb1 \
      libxext6 \
      libxrender1 \
    && apt clean all

# Install wkhtmltopdf with Qt patch (jammy .deb, works on Noble/24.04)
RUN if [ -z "${TARGETARCH}" ]; then TARGETARCH="$(dpkg --print-architecture)"; fi; \
    case ${TARGETARCH} in \
      "amd64") WKHTMLTOPDF_SHA=967390a759707337b46d1c02452e2bb6b2dc6d59 ;; \
      "arm64") WKHTMLTOPDF_SHA=90f6e69896d51ef77339d3f3a20f8582bdf496cc ;; \
    esac \
    && curl -o wkhtmltox.deb -sSL "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.jammy_${TARGETARCH}.deb" \
    && echo "${WKHTMLTOPDF_SHA} wkhtmltox.deb" | sha1sum -c - \
    && apt update \
    && apt -y install --no-install-recommends ./wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/* ./wkhtmltox.deb

# Install Odoo 20 from source until nightlies are published at
# http://nightly.odoo.com/20.0/nightly/deb/
ENV ODOO_VERSION=20.0
ARG ODOO_SOURCE_REF=20.0
RUN curl -sSL "https://github.com/odoo/odoo/archive/refs/heads/${ODOO_SOURCE_REF}.tar.gz" \
      | tar -xz -C /opt \
    && mv /opt/odoo-${ODOO_SOURCE_REF} /opt/odoo \
    && /opt/odoo/setup/debinstall.sh \
    && adduser --system --home /var/lib/odoo --group odoo \
    && printf '%s\n' '#!/bin/sh' 'exec /usr/bin/python3 /opt/odoo/odoo-bin "$@"' > /usr/local/bin/odoo \
    && chmod 0755 /usr/local/bin/odoo \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /odoo/addons /odoo/data

# Copy entrypoint script and Odoo configuration file
COPY entrypoint.sh /
COPY templates /odoo/templates
COPY requirements.txt /odoo/
COPY wait-for-psql.py /usr/local/bin/wait-for-psql.py

# Copy Odoo addons
COPY src/odoo-cloud-platform/session_redis /odoo/addons/session_redis

# Expose Odoo services
EXPOSE 8069 8072

RUN pip3 install --break-system-packages -r /odoo/requirements.txt

RUN chown -R odoo /odoo

# Set the default config file and make source-tree Odoo importable
ENV ODOO_RC=/odoo/odoo.conf
ENV PYTHONPATH=/opt/odoo

VOLUME /odoo/data

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
