from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import (SAFE_METHODS, AllowAny,
                                        IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)

from .serializers import PrivateUserSerializer, PublicUserSerializer
from .models import User


class UserView(viewsets.ModelViewSet):
    serializer_class = PublicUserSerializer
    lookup_field = 'username'
    queryset = User.objects.all()
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = PrivateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def check_object_permissions(self, request, obj):
        super(UserView, self).check_object_permissions(request, obj)
        if request.method not in ('GET', 'HEAD', 'OPTIONS', 'POST') and request.user != obj:
            self.permission_denied(request,
                                   message='User cannot edit this object.')
