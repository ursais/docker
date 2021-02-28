FROM ursa/ubuntu-18.04:latest
MAINTAINER Open Source Integrators <support@opensourceintegrators.com>

# Install FrePPle
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    python3-pip \
    python3-psycopg2 \
    python3-setuptools \
    python3-wheel \
  && curl -o frepple.deb -sSL https://github.com/frePPLe/frepple/releases/download/6.11.0/ubuntu18-frepple-6.11.0.deb \
  && apt-get install -y --no-install-recommends ./frepple.deb \
  && rm -rf /var/lib/apt/lists/* frepple.deb

# Configure Apache
RUN a2enmod expires \
#  && a2enmod proxy             # Only Enterprise Edition
#  && a2enmod proxy_wstunnel    # Only Enterprise Edition
#  && a2enmod default-ssl \
#  && a2enmod ssl \
  && a2ensite z_frepple \
  && a2enmod wsgi

# Copy files
COPY entrypoint.sh /
COPY requirements.txt /frepple/requirements.txt
COPY templates /frepple/templates
COPY wait-for-psql.py /usr/local/bin/wait-for-psql.py

# Install python3 modules
RUN pip3 install -r /frepple/requirements.txt

# Expose FrePPle
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]