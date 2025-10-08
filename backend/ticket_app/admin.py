from django.contrib import admin
from .models import Ticket, AgentAssignment

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('subject', 'assignee', 'agent', 'due_date', 'priority')
    list_filter = ('priority', 'due_date')
    search_fields = ('subject', 'description')

@admin.register(AgentAssignment)
class AgentAssignmentAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'agent', 'assigned_at')
