from django.db import models

class Department(models.Model):
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(blank=True, null=True)   # allow multiple emails as string
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')

    def __str__(self):
        return self.name
