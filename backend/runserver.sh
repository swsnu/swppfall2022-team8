source venv/bin/activate
pip install -r requirements.txt
cd bookVillage
python manage.py makemigrations
python manage.py migrate
sudo docker run -p 6379:6379 -d redis:5
celery -A bookVillage worker -l INFO & python manage.py runserver
