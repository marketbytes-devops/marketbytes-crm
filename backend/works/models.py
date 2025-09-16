from django.db import models
from django.conf import settings  

from clients.models import Client
from categories.models import ProjectCategory
from departments.models import Department


class Work(models.Model):
    RENEWAL_FREQUENCY_CHOICES = [
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('halfyearly', 'Half-Yearly'),
        ('yearly', 'Yearly'),
    ]

    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('due', 'Due'),
        ('overdue', 'Overdue'),
    ]

    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('INR', 'Indian Rupee'),
    ]

    workName = models.CharField(max_length=255)

    # Foreign keys
    category = models.ForeignKey(
        ProjectCategory, on_delete=models.SET_NULL, null=True, blank=True
    )
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True
    )

    # Choices instead of foreign key
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='ongoing'
    )
    currency = models.CharField(
        max_length=10, choices=CURRENCY_CHOICES, default='USD'
    )

    startDate = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    noDeadline = models.BooleanField(default=False)

    amc = models.BooleanField(default=False)
    amc_start_date = models.DateField(null=True, blank=True)
    amc_end_date = models.DateField(null=True, blank=True)

    renewable = models.BooleanField(default=False)
    renewalFrequency = models.CharField(
        max_length=20, choices=RENEWAL_FREQUENCY_CHOICES, null=True, blank=True
    )

    workMembers = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="works"
    )

    summary = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    client = models.ForeignKey(Client, null=True, blank=True, on_delete=models.SET_NULL)
    cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    milestones = models.JSONField(null=True, blank=True)
    file = models.FileField(upload_to="work_files/", null=True, blank=True)

    def __str__(self):
        return self.workName
