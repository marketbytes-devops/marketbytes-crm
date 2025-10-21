# Updated models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from works.models import Work
from departments.models import Department
from designation.models import Designation

class ProjectMember(models.Model):
    project = models.ForeignKey(
        Work, on_delete=models.CASCADE, related_name="project_members"
    )
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="member_projects"
    )
    allocated_hours = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.member.username} - {self.project.workName}"

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    employeeId = models.CharField(max_length=50, unique=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, blank=True)
    dateOfBirth = models.DateField(blank=True, null=True)
    joiningDate = models.DateField(blank=True, null=True)
    probationPeriod = models.DateField(blank=True, null=True)
    slackUsername = models.CharField(max_length=100, blank=True, null=True)
    exitDate = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    address = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    hourlyRate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, validators=[MinValueValidator(0)])
    logIn = models.CharField(max_length=20, choices=[('Enable', 'Enable'), ('Disable', 'Disable')], default='Enable')
    emailNotifications = models.CharField(max_length=20, choices=[('Enable', 'Enable'), ('Disable', 'Disable')], default='Enable')
    profilePicture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    reportTo = models.CharField(max_length=100, blank=True, null=True)  # Added reportTo field
    updated_at = models.DateTimeField(auto_now=True)  # Added to track last update timestamp

    def save(self, *args, **kwargs):
        if not self.employeeId:
            self.employeeId = f"M{Profile.objects.count() + 1:03d}"
        
        super().save(*args, **kwargs)
        # Removed manual updates to Designation—counts are now computed dynamically in the API

    def __str__(self):
        return f"{self.user.username} - {self.employeeId}"