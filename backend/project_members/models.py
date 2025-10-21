from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from works.models import Work
from departments.models import Department
from designation.models import Designation


class ProjectMember(models.Model):
    project = models.ForeignKey(
        Work,
        on_delete=models.CASCADE,
        related_name="project_members",
        null=True,
        blank=True,
    )
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="member_projects",
        null=True,
        blank=True,
    )
    allocated_hours = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True
    )

    def __str__(self):
        return f"{self.member.username} - {self.project.workName}"


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        null=True,
        blank=True,
    )
    employeeId = models.CharField(max_length=50, unique=True, null=True, blank=True)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True
    )
    designation = models.ForeignKey(
        Designation, on_delete=models.SET_NULL, null=True, blank=True
    )
    dateOfBirth = models.DateField(null=True, blank=True)
    joiningDate = models.DateField(null=True, blank=True)
    probationPeriod = models.DateField(null=True, blank=True)
    slackUsername = models.CharField(max_length=100, null=True, blank=True)
    exitDate = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[("male", "Male"), ("female", "Female"), ("other", "Other")],
        default="male",
        null=True,
        blank=True,
    )
    address = models.TextField(null=True, blank=True)
    skills = models.TextField(null=True, blank=True)
    mobile = models.CharField(max_length=20, null=True, blank=True)
    hourlyRate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True,
    )
    logIn = models.CharField(
        max_length=20,
        choices=[("Enable", "Enable"), ("Disable", "Disable")],
        default="Enable",
        null=True,
        blank=True,
    )
    emailNotifications = models.CharField(
        max_length=20,
        choices=[("Enable", "Enable"), ("Disable", "Disable")],
        default="Enable",
        null=True,
        blank=True,
    )
    profilePicture = models.ImageField(upload_to="profile_pics/", null=True, blank=True)
    reportTo = models.CharField(max_length=100, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.employeeId:
            self.employeeId = f"M{Profile.objects.count() + 1:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.employeeId}"
