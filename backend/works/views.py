from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Work
from .serializers import WorkSerializer

class WorkViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
