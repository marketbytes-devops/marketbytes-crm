from rest_framework import serializers
from .models import Work

class WorkSerializer(serializers.ModelSerializer):
    # Optional: include project members if needed
    project_members = serializers.SerializerMethodField()

    class Meta:
        model = Work
        fields = '__all__'  # or list fields explicitly
        # Example: fields = ['id', 'workName', 'status', 'project_members']

    def get_project_members(self, obj):
        # Dynamic import to avoid circular import
        from project_members.models import ProjectMember
        members = ProjectMember.objects.filter(project=obj)
        return [{"id": m.member.id, "username": m.member.username, "allocated_hours": m.allocated_hours} for m in members]
