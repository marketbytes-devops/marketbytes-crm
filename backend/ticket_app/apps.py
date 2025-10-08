# ticket_app/apps.py
from django.apps import AppConfig

class TicketAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ticket_app'  # Must be 'ticket_app', not 'ticket' or 'tickets'