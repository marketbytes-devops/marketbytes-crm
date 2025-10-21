from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Ticket, TicketType, Channel
from .serializers import (
    TicketSerializer,
    ClientSerializer,
    ProjectMemberSerializer,
    TicketTypeSerializer,
    ChannelSerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from clients.models import Client
from project_members.models import ProjectMember
from django.db import IntegrityError
from rest_framework.serializers import Serializer, CharField, IntegerField
from django.db.models import Count


class AssigneeSerializer(Serializer):
    id = IntegerField()
    name = CharField()
    email = CharField()
    type = CharField()


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Ticket.objects.select_related(
        "agent", "type", "channel"
    ).prefetch_related("assignee_content_type")
    serializer_class = TicketSerializer

    @action(detail=False, methods=["get"])
    def assignees(self, request):
        clients = Client.objects.all().values("id", "name", "email")
        client_data = [
            {"id": c["id"], "name": c["name"], "email": c["email"], "type": "client"}
            for c in clients
        ]
        project_members = ProjectMember.objects.select_related("member").all()
        member_data = [
            {
                "id": pm.id,
                "name": pm.member.get_full_name() or pm.member.email,
                "email": pm.member.email,
                "type": "employee",
            }
            for pm in project_members
        ]
        combined_assignees = client_data + member_data
        serializer = AssigneeSerializer(combined_assignees, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def agents(self, request):
        agents = ProjectMember.objects.all()
        serializer = ProjectMemberSerializer(agents, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def types(self, request):
        types_data = (
            Ticket.objects.values("type__name")
            .annotate(count=Count("id"))
            .filter(count__gt=0)
        )
        formatted_data = [
            {"name": item["type__name"], "count": item["count"]} for item in types_data
        ]
        return Response(formatted_data)

    @action(detail=False, methods=["get"])
    def channels(self, request):
        channels_data = (
            Ticket.objects.values("channel__name")
            .annotate(count=Count("id"))
            .filter(count__gt=0)
        )
        formatted_data = [
            {"name": item["channel__name"], "count": item["count"]}
            for item in channels_data
        ]
        return Response(formatted_data)

    @action(detail=False, methods=["get"])
    def status(self, request):
        status_counts = (
            Ticket.objects.values("status")
            .annotate(count=Count("id"))
            .filter(count__gt=0)
        )
        return Response(status_counts)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        unresolved = Ticket.objects.filter(
            status__in=["Submit Open", "Submit Pending"]
        ).count()
        unassigned = Ticket.objects.filter(assignee_object_id__isnull=True).count()
        return Response({"unresolved": unresolved, "unassigned": unassigned})

    @action(detail=False, methods=["post"])
    def add_type(self, request):
        ticket_type = request.data.get("type")
        if not ticket_type:
            return Response(
                {"status": "error", "message": "Type is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            ticket_type_instance = TicketType.objects.create(name=ticket_type)
            return Response(
                {"id": ticket_type_instance.id, "name": ticket_type_instance.name},
                status=status.HTTP_201_CREATED,
            )
        except IntegrityError:
            return Response(
                {"status": "error", "message": "Ticket type already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"])
    def add_channel(self, request):
        channel_name = request.data.get("name")
        if not channel_name:
            return Response(
                {"status": "error", "message": "Channel name is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            channel = Channel.objects.create(name=channel_name)
            return Response(
                {"id": channel.id, "name": channel.name}, status=status.HTTP_201_CREATED
            )
        except IntegrityError:
            return Response(
                {"status": "error", "message": "Channel already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()
