#!/bin/bash

docker stop node-app-template_dev
docker rm node-app-template_dev
docker volume rm $(docker volume ls -qf "name=node-app-template_dev_*")
