from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(null=True, blank=True)  # <-- no default, no unique

    def __str__(self):
        return self.name
