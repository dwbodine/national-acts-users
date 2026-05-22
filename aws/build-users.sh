#!/bin/bash
docker compose rm -s -v -f nationalactsusers
docker rmi 804363746695.dkr.ecr.us-east-1.amazonaws.com/nationalactsvip/nationalactsusers:latest
docker pull 804363746695.dkr.ecr.us-east-1.amazonaws.com/nationalactsvip/nationalactsusers:latest
docker compose up -d --no-deps nationalactsusers