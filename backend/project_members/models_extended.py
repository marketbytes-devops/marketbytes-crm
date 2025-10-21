from django.db import models
from .models import Employee

# class EmployeeProfile(models.Model):
#     employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='profile')
#     department = models.CharField(max_length=100, blank=True, null=True)
#     report_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
#     probation_period = models.DateField(null=True, blank=True)
#     slack_username = models.CharField(max_length=100, blank=True, null=True)
#     exit_date = models.DateField(null=True, blank=True)
#     gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
#     address = models.TextField(blank=True, null=True)
#     skills = models.TextField(blank=True, null=True)
#     mobile = models.CharField(max_length=15, blank=True, null=True)
#     hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     login_enabled = models.CharField(max_length=10, choices=[('Enable', 'Enable'), ('Disable', 'Disable')], default='Enable')
#     email_notifications = models.CharField(max_length=10, choices=[('Enable', 'Enable'), ('Disable', 'Disable')], default='Enable')
#     profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

#     def __str__(self):
#         return f"Profile for {self.employee.name}"
