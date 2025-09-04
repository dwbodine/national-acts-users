#!/bin/bash
npm run build
DOCKER_BUILDKIT=1 docker build --no-cache -t nationalactsvip/nationalactsusers .