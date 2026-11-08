import os
from django.core.wsgi import get_wsgi_application

# Substitua 'config.settings' pelo nome da sua pasta de configurações, caso seja diferente
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = get_wsgi_application()