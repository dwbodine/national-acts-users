#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITES_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

docker compose -f $WEBSITES_ROOT/docker-compose.yml down
docker rmi nationalactsvip/nationalactsusers:latest