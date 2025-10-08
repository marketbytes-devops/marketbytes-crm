# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Ticket, TicketType, Channel
from clients.models import Client
from project_members.models import ProjectMember
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', 'email']

class ProjectMemberSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='member.email')
    name = serializers.SerializerMethodField()

    class Meta:
        model = ProjectMember
        fields = ['id', 'name', 'email']

    def get_name(self, obj):
        return obj.member.get_full_name() or obj.member.email

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id', 'name']

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name']

class TicketSerializer(serializers.ModelSerializer):
    assignee = serializers.SerializerMethodField()
    requester = serializers.SerializerMethodField()
    requestedOn = serializers.SerializerMethodField()
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    assignee_type = serializers.ChoiceField(
        choices=[('client', 'Client'), ('projectmember', 'Project Member')],
        required=False,
        allow_null=True
    )
    assignee_name = serializers.SerializerMethodField()
    assignee_email = serializers.SerializerMethodField()
    agent = serializers.PrimaryKeyRelatedField(
        queryset=ProjectMember.objects.all(),
        allow_null=True,
        required=False
    )
    type = serializers.PrimaryKeyRelatedField(
        queryset=TicketType.objects.all(),
        allow_null=True,
        required=False
    )
    channel = serializers.PrimaryKeyRelatedField(
        queryset=Channel.objects.all(),
        allow_null=True,
        required=False
    )
    status = serializers.CharField(max_length=20, required=False, allow_null=True, default="Submit Open")

    class Meta:
        model = Ticket
        fields = [
            'id', 'assignee', 'assignee_id', 'assignee_type', 'agent', 'subject', 'description',
            'due_date', 'type', 'priority', 'channel', 'tags', 'created_at', 'status',
            'requester', 'requestedOn', 'assignee_name', 'assignee_email'
        ]
        read_only_fields = ['id', 'created_at', 'assignee', 'requester', 'requestedOn', 'assignee_name', 'assignee_email']

    def get_assignee(self, obj):
        if obj.assignee:
            if obj.assignee_content_type.model == 'client':
                client = Client.objects.get(id=obj.assignee_object_id)
                return {'id': client.id, 'name': client.name, 'email': client.email, 'type': 'client'}
            elif obj.assignee_content_type.model == 'projectmember':
                pm = ProjectMember.objects.get(id=obj.assignee_object_id)
                return {
                    'id': pm.id,
                    'name': pm.member.get_full_name() or pm.member.email,
                    'email': pm.member.email,
                    'type': 'employee'
                }
        return None

    def get_assignee_name(self, obj):
        assignee = self.get_assignee(obj)
        return assignee.get('name') if assignee else 'Unassigned'

    def get_assignee_email(self, obj):
        assignee = self.get_assignee(obj)
        return assignee.get('email') if assignee else ''

    def get_requester(self, obj):
        assignee = self.get_assignee(obj)
        return f"{assignee.get('name', 'Unassigned')} ({assignee.get('email', '')})" if assignee else 'Unassigned'

    def get_requestedOn(self, obj):
        return obj.created_at.strftime('%d-%m-%Y %I:%M %p') if obj.created_at else ''

    def create(self, validated_data):
        assignee_id = validated_data.pop('assignee_id', None)
        assignee_type = validated_data.pop('assignee_type', None)
        status = validated_data.pop('status', 'Submit Open')
        validated_data.setdefault('channel', None)
        validated_data.setdefault('agent', None)
        validated_data.setdefault('type', None)
        if assignee_id and assignee_type:
            try:
                app_label = 'clients' if assignee_type == 'client' else 'project_members'
                content_type = ContentType.objects.get(app_label=app_label, model=assignee_type)
                validated_data['assignee_content_type'] = content_type
                validated_data['assignee_object_id'] = assignee_id
            except ObjectDoesNotExist:
                raise serializers.ValidationError({"assignee_type": f"Invalid assignee type: {assignee_type}. Must be 'client' or 'projectmember'."})
        ticket = Ticket.objects.create(status=status, **validated_data)
        return ticket

    def update(self, instance, validated_data):
        assignee_id = validated_data.pop('assignee_id', None)
        assignee_type = validated_data.pop('assignee_type', None)
        status = validated_data.pop('status', instance.status)
        if assignee_id and assignee_type:
            try:
                app_label = 'clients' if assignee_type == 'client' else 'project_members'
                content_type = ContentType.objects.get(app_label=app_label, model=assignee_type)
                instance.assignee_content_type = content_type
                instance.assignee_object_id = assignee_id
            except ObjectDoesNotExist:
                raise serializers.ValidationError({"assignee_type": f"Invalid assignee type: {assignee_type}. Must be 'client' or 'projectmember'."})
        instance.status = status
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance