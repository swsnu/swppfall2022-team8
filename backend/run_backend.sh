#!/bin/bash

# TODO: Write automation script for launching BE app
cd bookVillage
python manage.py makemigrations 
python manage.py migrate
mkdir -p /log # for `uwsgi` logging
celery -A bookVillage worker -l INFO &
daphne -p 8001 bookVillage.asgi:application &
uwsgi --ini uwsgi/uwsgi.ini
