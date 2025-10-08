from rest_framework import serializers
from .models import Designation
from project_members.models import Profile  # For reverse lookup (profiles by designation)

class DesignationSerializer(serializers.ModelSerializer):
    # Dynamic fields: Computed from related Profiles
    members = serializers.SerializerMethodField()
    employees = serializers.SerializerMethodField()

    class Meta:
        model = Designation
        fields = '__all__'  # Includes id, designation_name, etc.

    def get_members(self, obj):
        # Count profiles assigned to this designation
        return Profile.objects.filter(designation=obj).count()

    def get_employees(self, obj):
        # List of user IDs from profiles assigned to this designation
        return list(Profile.objects.filter(designation=obj).values_list('user__id', flat=True))