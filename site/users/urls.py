from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from .views import UserView

router = DefaultRouter()
router.register('', UserView)

urlpatterns = [
    url('', include(router.urls))
]
