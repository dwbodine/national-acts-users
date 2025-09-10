#!/bin/bash
DOCKER_BUILDKIT=1 docker build --no-cache --secret id=_env,src=/d/Websites/national-acts-users/.env -t nationalactsvip/nationalactsusers .
docker compose -f /d/Websites/national-acts-users/docker-compose.yml up --force-recreate