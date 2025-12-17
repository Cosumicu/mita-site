from rest_framework import serializers

from .models import Review

from apps.profiles.serializers import ProfileSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile", read_only=True)
    property = serializers.UUIDField(source="property.id", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "property",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
        ]