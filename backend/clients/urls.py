from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet,generate_password

router = DefaultRouter()
router.register(r'', ClientViewSet)

urlpatterns = [
    path('generate-password/', generate_password,),
    path('', include(router.urls)),
    
]
