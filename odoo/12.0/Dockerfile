FROM ursa/ubuntu-18.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some deps, lessc and less-plugin-clean-css, and wkhtmltopdf
RUN apt update \
    && apt install -y --no-install-recommends \
        ca-certificates \
        dirmngr \
        fonts-noto-cjk \
        gnupg \
        libpq-dev \
        gosu \
        libssl1.0-dev \
        nodejs-dev \
        node-gyp \
        node-less \
        npm \
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
        rsync \
        xz-utils \
    && curl -o wkhtmltox.deb -sSL https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.bionic_amd64.deb \
    && echo 'f1689a1b302ff102160f2693129f789410a1708a wkhtmltox.deb' | sha1sum -c - \
    && apt install -y --no-install-recommends ./wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/* wkhtmltox.deb

# Install Rclone
RUN curl https://rclone.org/install.sh | bash

# install latest postgresql-client
ENV PGVERSION=12
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main' > /etc/apt/sources.list.d/pgdg.list \
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt update  \
    && apt install --no-install-recommends -y postgresql-client-$PGVERSION \
    && rm -f /etc/apt/sources.list.d/pgdg.list \
    && rm -rf /var/lib/apt/lists/*

# Install Odoo
ENV ODOO_VERSION 12.0
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
COPY src/odoo-cloud-platform/attachment_azure /odoo/addons/attachment_azure
COPY src/odoo-cloud-platform/attachment_s3 /odoo/addons/attachment_s3
COPY src/odoo-cloud-platform/base_attachment_object_storage /odoo/addons/base_attachment_object_storage
COPY src/odoo-cloud-platform/monitoring_status /odoo/addons/monitoring_status
COPY src/odoo-cloud-platform/session_redis /odoo/addons/session_redis

# Expose Odoo services
EXPOSE 8069 8072

RUN pip3 install --upgrade pip
RUN pip3 install -r /odoo/requirements.txt

RUN chown -R odoo /odoo

# Set the default config file
ENV ODOO_RC /odoo/odoo.conf

VOLUME /odoo/data

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
