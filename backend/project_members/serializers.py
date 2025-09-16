from rest_framework import serializers
from .models import ProjectMember
from django.contrib.auth import get_user_model

User = get_user_model()

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", ]

class ProjectMemberSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.username", read_only=True)
    project_name = serializers.CharField(source="project.workName", read_only=True)

    class Meta:
        model = ProjectMember
        fields = ["id", "project", "project_name", "member", "member_name", "allocated_hours"]
