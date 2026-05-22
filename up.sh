#!/bin/bash

WEBSITES_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DOCKER_BUILDKIT=1 docker build --no-cache --secret id=_env,src=$WEBSITES_ROOT/.env -t nationalactsvip/nationalactsusers .
docker compose -f $WEBSITES_ROOT/docker-compose.yml up --force-recreate