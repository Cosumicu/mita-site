from django.contrib import admin

from .models import Property, Reservation, PropertyTag

class PropertyAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "location", "category", "price_per_night"]
    list_display_links = ["id", "title"]

class PropertyTagAdmin(admin.ModelAdmin):
    list_display = ["pkid", "name", "description", "created_at"]
    list_display_links = ["pkid", "name"]

admin.site.register(Property, PropertyAdmin)
admin.site.register(Reservation)
admin.site.register(PropertyTag, PropertyTagAdmin)