from django.db import models


class Apartment(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    price_for_sale = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()
    preview_image = models.ImageField()
    floor = models.IntegerField()
    area = models.DecimalField(max_digits=7, decimal_places=2)  # in square meters
    number_of_rooms = models.IntegerField()
    number_of_bathrooms = models.IntegerField()
    has_balcony = models.BooleanField(default=False)
    for_sale = models.BooleanField(default=False)
    for_rent = models.BooleanField(default=False)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.name.lower().replace(' ', '-')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ApartmentImage(models.Model):
    apartment = models.ForeignKey(
        Apartment, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField()
