from django.urls import path, include
from rest_framework.routers import DefaultRouter
from designation.views import DesignationViewSet

router = DefaultRouter()
router.register(r'', DesignationViewSet)


urlpatterns = [
    path('', include(router.urls)),
]