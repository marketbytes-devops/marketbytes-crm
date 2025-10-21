from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import ProjectCategory
from .serializers import ProjectCategorySerializer


class ProjectCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
