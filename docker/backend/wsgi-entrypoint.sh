#!/usr/bin/env bash

#ls -al /app/backend/server/static/client/static/js


until cd /app/backend/server
do
    echo "Waiting for server volume..."
done

until ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

./manage.py collectstatic --noinput

echo "START SERVER"
gunicorn server.wsgi --bind 0.0.0.0:8003 --workers 4 --threads 4
#./manage.py runserver 0.0.0.0:8003 # --settings=settings.dev_docker