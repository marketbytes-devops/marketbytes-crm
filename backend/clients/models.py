from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Client(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    mobile = models.CharField(max_length=20, null=True, blank=True)
    office_phone = models.CharField(max_length=20, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=2, default="US", null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    skype = models.CharField(max_length=100, null=True, blank=True)
    linkedin = models.URLField(null=True, blank=True)
    twitter = models.CharField(max_length=100, null=True, blank=True)
    facebook = models.URLField(null=True, blank=True)
    gst_number = models.CharField(max_length=50, null=True, blank=True)
    log_in = models.CharField(max_length=100, null=True, blank=True)
    shipping_address = models.TextField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=[("Active", "Active"), ("Inactive", "Inactive")],
        default="Active",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "email"], name="unique_name_email")
        ]

    def __str__(self):
        return self.name

    def set_password(self, raw_password):
        """Hash the password before saving."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Check if the provided password matches the hashed password."""
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        """Override save to ensure password is hashed if provided."""
        if self.password and not self.password.startswith("pbkdf2_sha256$"):
            self.set_password(self.password)
        super().save(*args, **kwargs)
