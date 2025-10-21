from rest_framework import serializers
from .models import Work

class WorkSerializer(serializers.ModelSerializer):
    project_members = serializers.SerializerMethodField()

    class Meta:
        model = Work
        fields = '__all__' 

    def get_project_members(self, obj):
        from project_members.models import ProjectMember
        members = ProjectMember.objects.filter(project=obj)
        return [{"id": m.member.id, "username": m.member.username, "allocated_hours": m.allocated_hours} for m in members]
