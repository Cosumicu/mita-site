from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from autoslug import AutoSlugField
from django_countries.fields import CountryField
from decimal import Decimal
from datetime import datetime
import string
import random

from apps.common.models import TimeStampedUUIDModel

User = get_user_model()

def generate_confirmation_code(length=8):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=length))

class PropertyStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"
    PENDING = "PENDING", "Pending"
    SUSPENDED = "SUSPENDED", "Suspended"

class ReservationStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    DECLINED = "DECLINED", "Declined"
    EXPIRED = "EXPIRED", "Expired"
    ONGOING = "ONGOING", "Ongoing"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"

class PropertyTag(TimeStampedUUIDModel):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)

class Property(TimeStampedUUIDModel):
    user = models.ForeignKey(User, related_name='properties', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from="title", unique=True, always_update=True)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    bedrooms = models.IntegerField()
    beds = models.IntegerField()
    bathrooms = models.IntegerField()
    guests = models.IntegerField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=PropertyStatus.choices,
        default=PropertyStatus.ACTIVE
    )
    tags = models.ManyToManyField(PropertyTag, related_name="properties", blank=True)
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)
    reservations_count = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='uploads/properties', default='/uploads/properties/default_property.png')

    # I want to sleep...zzz
    is_instant_booking = models.BooleanField(default=False)
    checkin_time = models.TimeField(default="15:00")
    checkout_time = models.TimeField(default="11:00")

    weekly_discount_rate = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.10'))
    monthly_discount_rate = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.20'))
    cleaning_fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))


    def image_url(self):
        return f'{settings.WEBSITE_URL}{self.image.url}'
    
    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"

class Reservation(TimeStampedUUIDModel):
    user = models.ForeignKey(User, related_name='reservations', on_delete=models.CASCADE)
    property = models.ForeignKey(Property, related_name='reservations', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    checkin_time = models.TimeField(default="15:00")
    checkout_time = models.TimeField(default="11:00")
    number_of_nights = models.IntegerField()
    guests = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20,
        choices=ReservationStatus.choices,
        default=ReservationStatus.PENDING
    )
    is_instant_booking = models.BooleanField(default=False)
    
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    long_stay_discount = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.00'))
    cleaning_fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    guest_service_fee_rate = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.10'))
    host_service_fee_rate = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.02'))
    tax_rate = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.03'))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    host_pay = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    
    confirmation_code = models.CharField(
        max_length=16,
        unique=True,
        blank=True,
        editable=False
    )

    def save(self, *args, **kwargs):
        if not self.confirmation_code:
            code = generate_confirmation_code()

            while Reservation.objects.filter(confirmation_code=code).exists():
                code = generate_confirmation_code()

            self.confirmation_code = code

        super().save(*args, **kwargs)

class PropertyView(TimeStampedUUIDModel):
    user = models.ForeignKey(
        User,
        related_name="views",
        null=True, blank=True,
        on_delete=models.SET_NULL
    )
    property = models.ForeignKey(
        Property,
        related_name="views",
        on_delete=models.CASCADE
    )
    ip_address = models.GenericIPAddressField()

    class Meta:
        indexes = [
            models.Index(fields=["user", "property"]),
            models.Index(fields=["ip_address", "property"]),
        ]

class PropertyLike(TimeStampedUUIDModel):
    user = models.ForeignKey(User, related_name="likes", on_delete=models.CASCADE)
    property = models.ForeignKey(Property, related_name="likes", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("property", "user")
