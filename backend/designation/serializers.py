from rest_framework import serializers
from .models import Designation
from project_members.models import Profile 

class DesignationSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    employees = serializers.SerializerMethodField()

    class Meta:
        model = Designation
        fields = '__all__'  

    def get_members(self, obj):
        return Profile.objects.filter(designation=obj).count()

    def get_employees(self, obj):
        return list(Profile.objects.filter(designation=obj).values_list('user__id', flat=True))