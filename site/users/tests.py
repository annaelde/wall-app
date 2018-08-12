import json
from unittest.mock import patch

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from posts.models import Post

from .models import User, send_success_email


class UserTestCase(TestCase):
    """ 
    Testing that you can create a new user, 
    login and logout (via token creation/destruction),
    and that all new users receive a welcome email.
    """

    def setUp(self):
        self.client = APIClient()

    def test_user_creation(self):
        self.client.post(
            '/users/', {'username': 'test-user', 'password': 'mock123it', 'email': 'me@mail.com'})
        self.assertTrue(User.objects.filter(username='test-user').exists())

    def test_user_login(self):
        user = User.objects.create_user(
            username='test-user', password='mock123it', email='me@mail.com')
        self.client.post(
            '/auth/', {'username': 'test-user', 'password': 'mock123it'})
        self.assertTrue(Token.objects.filter(user=user).exists())

    def test_user_logout(self):
        user = User.objects.create_user(
            username='test-user', password='mock123it', email='me@mail.com')
        # Get a token for authorization
        response = self.client.post(
            '/auth/', {'username': 'test-user', 'password': 'mock123it'})
        token = json.loads(response.content)['token']
        # Logout using token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        self.client.delete('/auth/')
        # The token should no longer exist
        self.assertFalse(Token.objects.filter(user=user).exists())

    @patch('django.core.mail.EmailMessage.send')
    def test_welcome_email(self, mockEmail):
        # Connect the signal receiver
        post_save.connect(send_success_email, sender=User)
        # Create new user to trigger the signal
        user = User.objects.create_user(
            username='test-user', password='mock123it', email='me@mail.com')
        # Welcome email should've been sent
        self.assertTrue(mockEmail.called)
        self.assertTrue(mockEmail.call_count, 1)
        mockEmail.reset_mock()
        # Now, update user
        user.save()
        # No further emails should've been sent
        self.assertFalse(mockEmail.called)
