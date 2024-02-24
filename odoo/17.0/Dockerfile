FROM ursa/ubuntu-22.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some dependencies
RUN apt update \
    && apt install -y --no-install-recommends \
       # For the entrypoint.sh
       gosu \
       # To install additional Python dependencies
       python3-pip \
    && apt clean all

# Install wkhtmltopdf with Qt patch
RUN curl -o wkhtmltox.deb -sL0 "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.jammy_amd64.deb" \
    && apt update \
    && apt -y install --no-install-recommends ./wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/* ./wkhtmltox.deb

# Install Rclone
RUN curl https://rclone.org/install.sh | bash

# Install Odoo
ENV ODOO_VERSION 17.0
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
# COPY src/odoo-cloud-platform/monitoring_status /odoo/addons/monitoring_status
# COPY src/odoo-cloud-platform/session_redis /odoo/addons/session_redis

# Expose Odoo services
EXPOSE 8069 8072

RUN pip3 install -r /odoo/requirements.txt

RUN chown -R odoo /odoo

# Set the default config file
ENV ODOO_RC /odoo/odoo.conf

VOLUME /odoo/data

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
