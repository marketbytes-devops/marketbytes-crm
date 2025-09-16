from django.db import models
from django.conf import settings
from works.models import Work

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
