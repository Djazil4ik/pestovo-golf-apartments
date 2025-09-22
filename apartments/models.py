from django.db import models


class Apartment(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    preview_image = models.ImageField()

    def __str__(self):
        return self.name


class ApartmentImage(models.Model):
    apartment = models.ForeignKey(
        Apartment, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField()
