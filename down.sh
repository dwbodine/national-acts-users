#!/bin/bash
docker compose -f /d/Websites/national-acts-users/docker-compose.yml down
docker rmi nationalactsvip/nationalactsusers:latest