#!/bin/bash


# This script is used to run the python scripts in the project

python manage.py makemigrations
python manage.py migrate

exec "$@"
