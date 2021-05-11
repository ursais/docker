FROM ursa/ubuntu-20.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some deps, lessc and less-plugin-clean-css, and wkhtmltopdf
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        dirmngr \
        fonts-noto-cjk \
        gnupg \
        gosu \
        libssl-dev \
        node-less \
        npm \
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
        s3cmd \
        xz-utils \
    && curl -o wkhtmltox.deb -sSL https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.focal_amd64.deb \
    && echo 'ae4e85641f004a2097621787bf4381e962fb91e1 wkhtmltox.deb' | sha1sum -c - \
    && apt-get install -y --no-install-recommends ./wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/* wkhtmltox.deb

# install latest postgresql-client
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main' > /etc/apt/sources.list.d/pgdg.list \
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt-get update  \
    && apt-get install --no-install-recommends -y postgresql-client \
    && rm -f /etc/apt/sources.list.d/pgdg.list \
    && rm -rf /var/lib/apt/lists/*

# Install Odoo
ENV ODOO_VERSION 14.0
ARG ODOO_RELEASE=latest
RUN curl -o odoo.deb -sSL http://nightly.odoo.com/${ODOO_VERSION}/nightly/deb/odoo_${ODOO_VERSION}.${ODOO_RELEASE}_all.deb \
    && apt-get update \
    && apt-get -y install --no-install-recommends ./odoo.deb \
    && rm -rf /var/lib/apt/lists/* odoo.deb

# Install azcopy
RUN curl -L -o downloadazcopy-v10-linux.tgz https://aka.ms/downloadazcopy-v10-linux \
    && tar -xvf downloadazcopy-v10-linux.tgz \
    && cp ./azcopy_linux_amd64_*/azcopy /usr/local/bin/

RUN mkdir -p /odoo/addons /odoo/data

# Copy entrypoint script and Odoo configuration file
COPY entrypoint.sh /
COPY templates /odoo/templates
COPY requirements.txt /odoo/
COPY wait-for-psql.py /usr/local/bin/wait-for-psql.py

# Copy Odoo addons
# COPY src/odoo-cloud-platform/attachment_azure /odoo/addons/attachment_azure
COPY src/odoo-cloud-platform/attachment_s3 /odoo/addons/attachment_s3
COPY src/odoo-cloud-platform/base_attachment_object_storage /odoo/addons/base_attachment_object_storage
COPY src/odoo-cloud-platform/monitoring_status /odoo/addons/monitoring_status
COPY src/odoo-cloud-platform/session_redis /odoo/addons/session_redis

# Expose Odoo services
EXPOSE 8069 8072

RUN pip3 install -r /odoo/requirements.txt

RUN chown -R odoo /odoo

# Set the default config file
ENV ODOO_RC /odoo/odoo.conf

VOLUME /odoo/data

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
