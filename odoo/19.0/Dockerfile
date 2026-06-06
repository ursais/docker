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

# Install Odoo
ENV ODOO_VERSION=19.0
ARG ODOO_RELEASE=20250101
RUN curl -o odoo.deb -sSL http://nightly.odoo.com/${ODOO_VERSION}/nightly/deb/odoo_${ODOO_VERSION}.${ODOO_RELEASE}_all.deb \
    && apt update \
    && apt -y install --no-install-recommends ./odoo.deb \
    && rm -rf /var/lib/apt/lists/* odoo.deb

RUN mkdir -p /odoo/addons /odoo/data

# Copy entrypoint script and Odoo configuration file
COPY entrypoint.sh /
COPY templates /odoo/templates
COPY requirements.txt /odoo/
COPY wait-for-psql.py /usr/local/bin/wait-for-psql.py

# Copy Odoo addons
COPY src/odoo-cloud-platform/monitoring_status /odoo/addons/monitoring_status
COPY src/odoo-cloud-platform/session_redis /odoo/addons/session_redis

# Expose Odoo services
EXPOSE 8069 8072

RUN pip3 install --break-system-packages -r /odoo/requirements.txt

RUN chown -R odoo /odoo

# Set the default config file
ENV ODOO_RC=/odoo/odoo.conf

VOLUME /odoo/data

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
