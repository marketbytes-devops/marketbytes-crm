from rest_framework import serializers
from .models import Client
from rest_framework.validators import UniqueTogetherValidator
import random
import string


class ClientSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(
        required=False, allow_null=True, format="%Y-%m-%d", input_formats=["%Y-%m-%d"]
    )
    class Meta:
        model = Client
        fields = [
            'id', 'name', 'email', 'company_name', 'website', 'address', 'mobile',
            'office_phone', 'city', 'state', 'country', 'date_of_birth', 'password',
            'skype', 'linkedin', 'twitter', 'facebook', 'gst_number', 'log_in',
            'shipping_address', 'note','status', 'created_at'
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=Client.objects.all(),
                fields=['name', 'email'],
                message="A client with this name and email already exists."
            )
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def generate_random_password(self, length=12):
        """Generate a random secure password"""
        chars = string.ascii_letters + string.digits + '!@#$%^&*()'
        return ''.join(random.choices(chars, k=length))

    def create(self, validated_data):
        """Create a new client with hashed password."""
        if not validated_data.get('password'):
            validated_data['password'] = self.generate_random_password()
        client = Client(**validated_data)
        client.set_password(validated_data['password'])
        client.save()
        return client

    def update(self, instance, validated_data):
        """Update a client, handling password separately."""
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance