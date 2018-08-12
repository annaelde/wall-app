"""
Populates the database for testing and development.
"""
import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.dev")
application = get_wsgi_application()
from users.models import User
from posts.models import Post


if __name__ == '__main__':
    post = 'Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam.'
    try:
        user = User.objects.get(username='guest')
    except:
        user = User.objects.create(
            username='guest', password='password', email='')
    # Create five posts
    for _ in range(5):
        Post.objects.create(message=post, author=user)
