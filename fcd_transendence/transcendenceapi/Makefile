
all: db runserver

db: 
	python manage.py makemigrations
	python manage.py migrate

runserver:
	python manage.py runserver


# how to run aphne
daphne: db
	daphne -b 0.0.0.0 -p 8000 transendenceapi.asgi:application
	