#!/usr/bin/env bash
# Cancela a execução se ocorrer algum erro
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Cria o superutilizador automaticamente (o "|| true" evita que o deploy falhe se o utilizador já existir)
python manage.py createsuperuser --noinput || true