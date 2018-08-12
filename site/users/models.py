from django.contrib.auth.models import AbstractUser
from django.core import mail
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    pass


@receiver(post_save, sender=User)
def send_success_email(sender, **kwargs):
    """Sends a welcome email after user creation."""
    if kwargs['created']:
        user = kwargs['instance']
        email = mail.EmailMessage('Welcome to Wall App!',
                                '%s, we\'re really happy you decided to join our website! Thanks!' % user.username,
                                'welcome@wall-app.com',
                                [user.email])
        email.send()
