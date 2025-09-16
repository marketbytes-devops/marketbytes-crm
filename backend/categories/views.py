from rest_framework import viewsets
from .models import ProjectCategory
from .serializers import ProjectCategorySerializer

class ProjectCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
