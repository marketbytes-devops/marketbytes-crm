from django.db import models


class Department(models.Model):

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]
    name = models.CharField(max_length=100, unique=True, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default="Active", null=True, blank=True
    )

    def __str__(self):
        return self.name
