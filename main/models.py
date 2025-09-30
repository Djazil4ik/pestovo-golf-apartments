from django.db import models

# Create your models here.
class Close(models.Model):
    is_closed = models.BooleanField(default=False)

    def __str__(self):
        return f"Site closed: {self.is_closed}"