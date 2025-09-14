#!/bin/bash
aws ecr get-login-password --region us-east-1 --profile deployment_nationalacts | docker login --username AWS --password-stdin 804363746695.dkr.ecr.us-east-1.amazonaws.com
DOCKER_BUILDKIT=1 NEXT_TELEMETRY_DISABLED=1 docker build --no-cache --secret id=_env,src=/d/Websites/national-acts-users/.env -t nationalactsvip/nationalactsusers .
docker tag nationalactsvip/nationalactsusers:latest 804363746695.dkr.ecr.us-east-1.amazonaws.com/nationalactsvip/nationalactsusers:latest
docker push 804363746695.dkr.ecr.us-east-1.amazonaws.com/nationalactsvip/nationalactsusers:latest