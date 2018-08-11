from rest_framework import serializers
from users.serializers import PublicUserSerializer
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ('message','timestamp','author')
        depth = 1