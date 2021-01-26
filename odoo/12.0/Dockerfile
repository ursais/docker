FROM ursa/ubuntu-18.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install some deps, lessc and less-plugin-clean-css, and wkhtmltopdf
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        dirmngr \
        fonts-noto-cjk \
        gnupg \
        libpq-dev \
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
        s3cmd \
        xz-utils \
    && curl -o wkhtmltox.deb -sSL https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.bionic_amd64.deb \
    && echo 'f1689a1b302ff102160f2693129f789410a1708a wkhtmltox.deb' | sha1sum -c - \
    && apt-get install -y --no-install-recommends ./wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/* wkhtmltox.deb

# install latest postgresql-client
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main' > /etc/apt/sources.list.d/pgdg.list \
    && GNUPGHOME="$(mktemp -d)" \
    && export GNUPGHOME \
    && repokey='B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8' \
    && gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "${repokey}" \
    && gpg --batch --armor --export "${repokey}" > /etc/apt/trusted.gpg.d/pgdg.gpg.asc \
    && gpgconf --kill all \
    && rm -rf "$GNUPGHOME" \
    && apt-get update  \
    && apt-get install --no-install-recommends -y postgresql-client \
    && rm -f /etc/apt/sources.list.d/pgdg.list \
    && rm -rf /var/lib/apt/lists/*

# Install Odoo
ENV ODOO_VERSION 12.0
ARG ODOO_RELEASE=20210125
ARG ODOO_SHA=5d7f14dbe452f48c3ac6caf28a44ba2469f06cfd
RUN curl -o odoo.deb -sSL http://nightly.odoo.com/${ODOO_VERSION}/nightly/deb/odoo_${ODOO_VERSION}.${ODOO_RELEASE}_all.deb \
    && echo "${ODOO_SHA} odoo.deb" | sha1sum -c - \
    && apt-get update \
    && apt-get -y install --no-install-recommends ./odoo.deb \
    && rm -rf /var/lib/apt/lists/* odoo.deb

RUN mkdir -p /odoo && mkdir -p /mnt/extra-addons

# Copy entrypoint script and Odoo configuration file
COPY entrypoint.sh /
COPY odoo.conf /etc/odoo/
COPY requirements.txt /odoo/
COPY wait-for-psql.py /usr/local/bin/wait-for-psql.py

# Copy Odoo addons
COPY src/odoo-cloud-platform/attachment_s3 /mnt/extra-addons/attachment_s3
COPY src/odoo-cloud-platform/base_attachment_object_storage /mnt/extra-addons/base_attachment_object_storage
COPY src/odoo-cloud-platform/monitoring_status /mnt/extra-addons/monitoring_status
COPY src/odoo-cloud-platform/session_redis /mnt/extra-addons/session_redis

# Expose Odoo services
EXPOSE 8069 8072

RUN pip3 install -r /odoo/requirements.txt

RUN chown -R odoo /etc/odoo /mnt/extra-addons /odoo

# Set the default config file
ENV ODOO_RC /etc/odoo/odoo.conf

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
