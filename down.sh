#!/bin/bash

WEBSITES_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

docker compose -f $WEBSITES_ROOT/docker-compose.yml down -v
docker rmi nationalactsvip/nationalactsusers:latest
