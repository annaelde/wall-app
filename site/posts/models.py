from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model


class Post(models.Model):
    message = models.CharField(max_length=1028)
    timestamp = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-timestamp']