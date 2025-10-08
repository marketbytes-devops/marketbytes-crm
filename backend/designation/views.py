from rest_framework import viewsets
from .models import Designation
from .serializers import DesignationSerializer
from project_members.models import Profile  # For prefetching

class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.prefetch_related('profile_set')  # Optimizes queries for dynamic fields
    serializer_class = DesignationSerializer