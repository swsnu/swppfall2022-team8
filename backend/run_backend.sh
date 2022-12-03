#!/bin/bash

# TODO: Write automation script for launching BE app
cd bookVillage
python manage.py makemigrations 
python manage.py migrate
mkdir -p /log # for `uwsgi` logging 
uwsgi --ini uwsgi/uwsgi.ini
