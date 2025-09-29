from django.contrib import admin

from .models import Apartment, ApartmentImage

class ApartmentImageInline(admin.TabularInline):
    model = ApartmentImage
    extra = 1

@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'price_per_night', 'price_for_sale', 'floor', 'area', 'number_of_rooms', 'number_of_bathrooms', 'has_balcony')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'address')
    list_filter = ('floor', 'number_of_rooms', 'has_balcony')
    ordering = ('name',)
    inlines = [ApartmentImageInline]

# Register your models here.
