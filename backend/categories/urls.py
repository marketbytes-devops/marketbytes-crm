from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectCategoryViewSet

router = DefaultRouter()
router.register(r"", ProjectCategoryViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
