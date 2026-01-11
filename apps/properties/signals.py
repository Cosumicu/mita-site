from decimal import Decimal
from django.db.models.signals import post_save, post_delete
from django.db.models import Avg
from django.dispatch import receiver

from .models import Property

from apps.reviews.models import Review
from apps.profiles.models import HostStatus

from django.db.models.signals import post_save
from django.dispatch import receiver


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

@receiver(post_save, sender=Property)
def set_host_onboarding_after_listing_created(sender, instance: Property, created: bool, **kwargs):
    """
    When a user creates their first listing, set their host_status to ONBOARDING.
    Does NOT downgrade ACTIVE/SUSPENDED.
    """
    if not created:
        return

    user = instance.user
    if not user:
        return

    # If your project guarantees Profile exists, this is safe:
    profile = getattr(user, "profile", None)
    if not profile:
        return

    # Don't downgrade
    if profile.host_status in [HostStatus.ACTIVE, HostStatus.SUSPENDED]:
        return

    # Mark onboarding (only if not already onboarding)
    if profile.host_status != HostStatus.ONBOARDING:
        profile.host_status = HostStatus.ONBOARDING
        profile.save(update_fields=["host_status"])
