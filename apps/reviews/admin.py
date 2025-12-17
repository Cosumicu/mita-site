from django.contrib import admin
from .models import Review

class ReviewAdmin(admin.ModelAdmin):
    list_display = ["id", "user__username", "property__id", "rating", "comment"]
    list_display_links = ["id"]

admin.site.register(Review, ReviewAdmin)