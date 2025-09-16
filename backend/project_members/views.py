# project_members/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import ProjectMember
from .serializers import EmployeeSerializer, ProjectMemberSerializer
import uuid  # <— added to generate random strings

User = get_user_model()

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = EmployeeSerializer

    # automatically generate a unique dummy email if not provided
    def perform_create(self, serializer):
        username = self.request.data.get("username")
        email = self.request.data.get("email")

        if not email:
            # make a guaranteed unique email
            email = f"{username}_{uuid.uuid4().hex[:6]}@example.com"

        serializer.save(email=email)

class ProjectMemberViewSet(viewsets.ModelViewSet):
    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer
    permission_classes = []  # For testing; adjust as needed

    @action(detail=False, methods=['get'])
    def employees(self, request):
        users = User.objects.all()
        serializer = EmployeeSerializer(users, many=True)
        return Response(serializer.data)
