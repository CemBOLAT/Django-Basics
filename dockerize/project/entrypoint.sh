#!/bin/sh

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

python manage.py makemigrations

# Start server
echo "Starting server"
daphne -b 0.0.0.0 -p 443 start.asgi:application


exec "$@"
