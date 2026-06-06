# Gray Matter Logic Docker Images

| Workflow | Status |
|---|---|
| Test | [![Test](https://github.com/ursais/docker/actions/workflows/test.yml/badge.svg)](https://github.com/ursais/docker/actions/workflows/test.yml) |
| Publish | [![Publish](https://github.com/ursais/docker/actions/workflows/publish.yml/badge.svg)](https://github.com/ursais/docker/actions/workflows/publish.yml) |

This repository contains Dockerfiles used to build solutions provided by
[Gray Matter Logic](https://www.graymatterlogic.com).

Images are published to the [GitHub Container Registry](https://github.com/orgs/ursais/packages?repo_name=docker)
as `ghcr.io/ursais/<image>:<tag>`.

## Table of Contents

* [Applications](#applications)
  * [FrePPLe](#frepple)
  * [Odoo](#odoo)
  * [PostgreSQL](#postgresql)
  * [Tools](#tools)
* [Operating Systems](#operating-systems)
  * [Ubuntu](#ubuntu)
* [Support](#support)

## Applications

### FrePPLe

| Version | Dockerfile |
|---|---|
| 8 | [frepple/8](https://github.com/ursais/docker/blob/master/frepple/8/frepple/Dockerfile) |

### Odoo

| Version | Image |
|---|---|
| 19.0 | `ghcr.io/ursais/odoo-19.0:latest` |

Base image: `ghcr.io/ursais/ubuntu-24.04:latest`

### PostgreSQL

| Version | Image |
|---|---|
| 16 | `ghcr.io/ursais/postgresql:latest` |

### Tools

| Tool | Image |
|---|---|
| Backup | `ghcr.io/ursais/backup:latest` |
| PySpy | `ghcr.io/ursais/pyspy:latest` |

## Operating Systems

### Ubuntu

| Version | Image |
|---|---|
| 24.04 | `ghcr.io/ursais/ubuntu-24.04:latest` |

## Support

Report any problem or question by creating an issue on the
[GitHub project](https://github.com/ursais/docker/issues).
