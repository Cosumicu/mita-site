from django.db import models
from django.contrib.auth import get_user_model

from apps.common.models import TimeStampedUUIDModel
from apps.profiles.models import Profile
from apps.properties.models import Property

User = get_user_model()

class RatingRange(models.IntegerChoices):
    RATING_1 = 1,
    RATING_2 = 2,
    RATING_3 = 3,
    RATING_4 = 4,
    RATING_5 = 5,

class Review(TimeStampedUUIDModel):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField(choices=RatingRange, default=5)
    comment = models.CharField(max_length=256, blank=True)

    class Meta:
        unique_together = ("user", "property")