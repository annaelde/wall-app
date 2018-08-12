from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from .views import AuthenticationView

urlpatterns = [
    url('', AuthenticationView.as_view())
]
