from django.contrib import admin

from .models import Property, Reservation

class PropertyAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "location", "category", "price_per_night"]
    list_display_links = ["id", "title"]

admin.site.register(Property, PropertyAdmin)
admin.site.register(Reservation)