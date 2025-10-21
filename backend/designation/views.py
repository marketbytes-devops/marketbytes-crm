from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Designation
from .serializers import DesignationSerializer
from project_members.models import Profile

class DesignationViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Designation.objects.prefetch_related("profile_set")
    serializer_class = DesignationSerializer
