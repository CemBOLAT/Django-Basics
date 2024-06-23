#!/bin/sh

# Start the backend

until nc -z -v -w30 db 3306
do
  echo "Waiting for database connection..."
  sleep 5
done

echo "Database is up and running!"

python manage.py makemigrations
python manage.py migrate
python manage.py runserver

exec "$@"