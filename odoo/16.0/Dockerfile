FROM ursa/ubuntu-22.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some deps, lessc and less-plugin-clean-css, and wkhtmltopdf
RUN apt update \
    && apt install -y --no-install-recommends \
        ca-certificates \
        dirmngr \
        fonts-noto-cjk \
        gnupg \
        gosu \
        gsfonts \
        libssl-dev \
        node-less \
        npm \
        postgresql-client \
        python3-num2words \
        python3-pip \
        python3-phonenumbers \
        python3-pyldap \
        python3-qrcode \
        python3-renderpm \
        python3-setuptools \
        python3-slugify \
        python3-vobject \
        python3-watchdog \
        python3-wheel \
        python3-xlrd \
        python3-xlwt \
        wkhtmltopdf \
        xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Rclone
RUN curl https://rclone.org/install.sh | bash

# Install Odoo
ENV ODOO_VERSION 16.0
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
#COPY src/odoo-cloud-platform/attachment_azure /odoo/addons/attachment_azure
#COPY src/odoo-cloud-platform/attachment_s3 /odoo/addons/attachment_s3
#COPY src/odoo-cloud-platform/base_attachment_object_storage /odoo/addons/base_attachment_object_storage
#COPY src/odoo-cloud-platform/monitoring_status /odoo/addons/monitoring_status
#COPY src/odoo-cloud-platform/session_redis /odoo/addons/session_redis

# Expose Odoo services
EXPOSE 8069 8072

RUN pip3 install -r /odoo/requirements.txt

RUN chown -R odoo /odoo

# Set the default config file
ENV ODOO_RC /odoo/odoo.conf

VOLUME /odoo/data

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
