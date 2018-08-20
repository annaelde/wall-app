import json

from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from users.models import User

from .models import Post
from .serializers import PostSerializer


class PostTestCase(TestCase):
    """
    Testing that you must be authorized to post and
    that you must have the correct object-level permissions
    to update and delete a post.
    """

    def setUp(self):
        # Create and log into a user
        self.user = User.objects.create_user(
            username='test-user', password='mock123it', email='me@mail.com')
        self.client = APIClient()
        response = self.client.post(
            '/auth/', {'username': 'test-user', 'password': 'mock123it'})
        self.token = json.loads(response.content)['token']

    def test_authorized_listing(self):
        Post.objects.create(message='Hello!', author=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        response = self.client.get('/posts/')
        posts = json.loads(response.content)
        self.assertEqual(len(posts), 1)

    def test_unauthorized_listing(self):
        Post.objects.create(message='Hello!', author=self.user)
        response = self.client.get('/posts/')
        posts = json.loads(response.content)
        self.assertEqual(len(posts), 1)

    def test_authorized_posting(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        post = 'Making a post on the wall!'
        self.client.post('/posts/', {'message': post})
        # The post should now exist
        self.assertTrue(Post.objects.filter(message=post).exists())

    def test_unauthorized_posting(self):
        post = 'Making a post on the wall!'
        self.client.post('/posts/', {'message': post})
        # The post should not exist
        self.assertFalse(Post.objects.filter(message=post).exists())

    def test_authorized_update(self):
        # Create a post with the original user
        post = 'Making a post on the wall!'
        instance = Post.objects.create(message=post, author=self.user)
        # Try to update the post when authorized
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        new_post = 'Updating a post on the wall!'
        self.client.patch('/posts/%i/' % instance.id, {'message': new_post})
        # The content of the post should have changed to the new post
        self.assertTrue(Post.objects.filter(message=new_post).exists())

    def test_unauthorized_update(self):
        # Create a post with the original user
        post = 'Making a post on the wall!'
        instance = Post.objects.create(message=post, author=self.user)
        # Create and log into a second user
        new_user = User.objects.create_user(
            username='test-user2', password='mock123it', email='me@mail.com')
        response = self.client.post(
            '/auth/', {'username': 'test-user2', 'password': 'mock123it'})
        new_token = json.loads(response.content)['token']
        # Now, try to make an update with the new user's credentials
        new_post = 'Updating a post on the wall!'
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + new_token)
        self.client.patch('/posts/%i/' % instance.id, {'message': new_post})
        # The original post should still be up
        self.assertTrue(Post.objects.filter(message=post).exists())
        # Now, totally deauthorize and try to do an update
        self.client.credentials(HTTP_AUTHORIZATION='')
        self.client.patch('/posts/%i/' % instance.id, {'message': new_post})
        # The original post should still be up
        self.assertTrue(Post.objects.filter(message=post).exists())

    def test_authorized_full_update(self):
        # Create a post with the original user
        post = 'Making a post on the wall!'
        instance = Post.objects.create(message=post, author=self.user)
        # Set-up the object we'll replace our post with
        post_data = PostSerializer(instance).data
        new_message = 'Updating a post on the wall!'
        post_data['message'] = new_message
        post_data['author'] = post_data['author']['username']
        # Login and try to do a full update
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        self.client.put('/posts/%i/' % instance.id, post_data)
        # The content of the post should have changed to the new post
        self.assertTrue(Post.objects.filter(message=new_message).exists())

    def test_unauthorized_full_update(self):
        # Create a post with the original user
        post = 'Making a post on the wall!'
        instance = Post.objects.create(message=post, author=self.user)
        # Set-up the object we'll replace our post with
        post_data = PostSerializer(instance).data
        new_message = 'Updating a post on the wall!'
        post_data['message'] = new_message
        post_data['author'] = post_data['author']['username']
        # Create and log into a second user
        new_user = User.objects.create_user(
            username='test-user2', password='mock123it', email='me@mail.com')
        response = self.client.post(
            '/auth/', {'username': 'test-user2', 'password': 'mock123it'})
        new_token = json.loads(response.content)['token']
        # Now, try to make an update with the new user's credentials
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + new_token)
        self.client.put('/posts/%i/' % instance.id, post_data)
        # The original post should still be up
        self.assertTrue(Post.objects.filter(message=post).exists())
        # Now, totally deauthorize and try to do an update
        self.client.credentials(HTTP_AUTHORIZATION='')
        self.client.put('/posts/%i/' % instance.id, post_data)
        # The original post should still be up
        self.assertTrue(Post.objects.filter(message=post).exists())

    def test_authorized_deletion(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        post = 'Making a post on the wall!'
        response = self.client.post('/posts/', {'message': post})
        # Get the ID from the instance
        instance = Post.objects.get(message=post)
        self.client.delete('/posts/%i/' % instance.id)
        # The post should no longer exist
        self.assertFalse(Post.objects.filter(message=post).exists())

    def test_unauthorized_deletion(self):
        # Create a post with the original user
        instance = Post.objects.create(message='Hello!', author=self.user)
        # Create and log into a second user
        new_user = User.objects.create_user(
            username='test-user2', password='mock123it', email='me@mail.com')
        response = self.client.post(
            '/auth/', {'username': 'test-user2', 'password': 'mock123it'})
        new_token = json.loads(response.content)['token']
        # Now, try to delete with the new user's credentials
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + new_token)
        self.client.delete('/posts/%i/' % instance.id)
        # The post should still exist
        self.assertTrue(Post.objects.filter(id=instance.id).exists())
        # Now, totally deauthorize and try to delete
        self.client.credentials(HTTP_AUTHORIZATION='')
        self.client.delete('/posts/%i/' % instance.id)
        # The post should still exist
        self.assertTrue(Post.objects.filter(id=instance.id).exists())
