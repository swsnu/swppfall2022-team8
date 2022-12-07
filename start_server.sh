#!/bin/bash

# Please check if you updated public DNS and IP in settings.py and nginx.conf

sh delete_images.sh
sh build_images.sh
sh run_docker_backend.sh
sh run_docker_frontend.sh