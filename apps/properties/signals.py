from decimal import Decimal
from django.db.models.signals import post_save, post_delete
from django.db.models import Avg
from django.dispatch import receiver

from .models import Property

from apps.reviews.models import Review

def update_property_average_rating(property_instance):
    avg = Review.objects.filter(property=property_instance).aggregate(
        avg_rating=Avg('rating')
    )['avg_rating'] or 0
    property_instance.average_rating = Decimal(avg).quantize(Decimal('0.01'))
    property_instance.save(update_fields=['average_rating'])

@receiver(post_save, sender=Review)
def update_average_on_save(sender, instance, **kwargs):
    update_property_average_rating(instance.property)

@receiver(post_delete, sender=Review)
def update_average_on_delete(sender, instance, **kwargs):
    update_property_average_rating(instance.property)
