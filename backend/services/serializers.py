from rest_framework import serializers
from .models import Service
from departments.models import Department

class ServiceSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'department', 'department_name', 'status', 'status_display']
