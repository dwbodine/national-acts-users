#!/bin/bash
docker pull 804363746695.dkr.ecr.us-east-1.amazonaws.com/nationalactsvip/nationalactsusers
docker compose up -d --no-deps nationalactsusers