from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from .views import PostView

router = DefaultRouter()
router.register('', PostView)

urlpatterns = [
    url('', include(router.urls))
]
