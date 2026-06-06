FROM ubuntu-24.04:latest
LABEL org.opencontainers.image.authors="Gray Matter Logic <support@graymatterlogic.com>"

# Install some dependencies
RUN apt update \
    && apt install -y --no-install-recommends \
      # To install additional Python dependencies \
      python3-numpy \
      python3-pip \
      python3-redis \
      python3-urllib3 \
    && apt clean all

# Install wkhtmltopdf with Qt patch
RUN curl -o wkhtmltox.deb -sL0 "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.jammy_amd64.deb" \
    && apt update \
    && apt -y install --no-install-recommends ./wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/* ./wkhtmltox.deb

# Install Odoo
ENV ODOO_VERSION=19.0
ARG ODOO_RELEASE=latest
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
