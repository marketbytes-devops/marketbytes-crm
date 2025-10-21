from django.db import models
from clients.models import Client
from project_members.models import ProjectMember
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class TicketType(models.Model):
    name = models.CharField(max_length=100, unique=True, null=True, blank=True)

    def __str__(self):
        return self.name

class Channel(models.Model):
    name = models.CharField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, null=True, blank=True)

    def __str__(self):
        return self.name

class Ticket(models.Model):
    assignee_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ticket_assignees"
    )
    assignee_object_id = models.PositiveIntegerField(null=True, blank=True)
    assignee = GenericForeignKey('assignee_content_type', 'assignee_object_id')

    agent = models.ForeignKey(
        ProjectMember, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="handled_tickets"
    )
    subject = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    type = models.ForeignKey(
        TicketType, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="tickets"
    )
    priority = models.CharField(
        max_length=20,
        choices=[("Low", "Low"), ("Medium", "Medium"), ("High", "High")],
        default="Low",
        null=True, blank=True
    )
    tags = models.CharField(max_length=255, null=True, blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now, null=True, blank=True)
    channel = models.ForeignKey(
        Channel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tickets",
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ("Submit Open", "Submit Open"),
            ("Submit Pending", "Submit Pending"),
            ("Submit Resolved", "Submit Resolved"),
            ("Submit Close", "Submit Close")
        ],
        default="Submit Open",
        null=True, blank=True
    )

    def __str__(self):
        return self.subject

class AgentAssignment(models.Model):
    ticket = models.ForeignKey(
        Ticket, 
        on_delete=models.CASCADE, 
        related_name="assignments",
        null=True, blank=True
    )
    agent = models.ForeignKey(
        ProjectMember, 
        on_delete=models.CASCADE, 
        related_name="assignments", 
        null=True, 
        blank=True
    )
    assigned_at = models.DateTimeField(default=timezone.now, null=True, blank=True)

    def __str__(self):
        return f"{self.agent.member if self.agent else 'Unassigned'} assigned to {self.ticket.subject}"