import json
from .base import *

secretFile = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'prod.json')

with open(secretFile) as f:
    secrets = json.loads(f.read())

SECRET_KEY = get_secret('SECRET_KEY', secrets)
DEBUG = False
DATABASES = {
    'default': get_secret('DATABASE_CONFIG', secrets)
}
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = get_secret('EMAIL_HOST', secrets)
EMAIL_HOST_USER = get_secret('EMAIL_USER', secrets)
EMAIL_HOST_PASSWORD = get_secret('EMAIL_PASSWORD', secrets)
EMAIL_PORT = get_secret('EMAIL_PORT', secrets)
EMAIL_USE_TLS = True