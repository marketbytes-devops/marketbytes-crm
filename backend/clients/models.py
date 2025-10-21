from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Client(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'), # DB value = 'Active', label shown = 'Active'
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    office_phone = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=2, default='US')  # Using country code (e.g., 'US', 'UK')
    date_of_birth = models.DateField(blank=True, null=True)
    password = models.CharField(max_length=128, blank=True, null=True)  # Store hashed password
    skype = models.CharField(max_length=100, blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.CharField(max_length=100, blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    gst_number = models.CharField(max_length=50, blank=True, null=True)
    log_in = models.CharField(max_length=100, blank=True, null=True)  
    shipping_address = models.TextField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    # New fields
    status = models.CharField(
        max_length=10,
        choices=[('Active', 'Active'), ('Inactive', 'Inactive')],
        default='Active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'email'], name='unique_name_email')
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
        if self.password and not self.password.startswith('pbkdf2_sha256$'):
            self.set_password(self.password)
        super().save(*args, **kwargs)
