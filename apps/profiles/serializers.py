from django_countries.serializer_fields import CountryField
from rest_framework import fields, serializers
from phonenumber_field.serializerfields import PhoneNumberField
from django.utils import timezone

from .models import Profile, Gender, HostStatus

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    full_name = serializers.SerializerMethodField(read_only=True)
    profile_picture_url = serializers.SerializerMethodField(read_only=True)

    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "profile_picture_url",
            "about_me",
            "gender",
            "country",
            "city",
            "rating",
            "num_reviews",
            "host_status",
            "host_since",
            "valid_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user_id",
            "username",
            "email",
            "full_name",
            "profile_picture_url",
            "rating",
            "num_reviews",
            "host_status",
            "host_since",
            "created_at",
            "updated_at",
        ]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    def get_profile_picture_url(self, obj):
        # uses your model method if you want:
        try:
            return obj.profile_picture_url()
        except Exception:
            return None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(required=False)

    class Meta:
        model = Profile
        fields = [
            "profile_picture",
            "about_me",
            "phone_number",
            "gender",
            "city",
            "valid_id",
        ]

    def validate_gender(self, value):
        if value not in dict(Gender.choices):
            raise serializers.ValidationError("Invalid gender.")
        return value

class ProfileHostStatusUpdateSerializer(serializers.ModelSerializer):
    host_status = serializers.ChoiceField(choices=HostStatus.choices)

    class Meta:
        model = Profile
        fields = ["host_status"]

    def update(self, instance, validated_data):
        new_status = validated_data.get("host_status", instance.host_status)

        if instance.host_status != HostStatus.ACTIVE and new_status == HostStatus.ACTIVE:
            instance.host_since = timezone.now()

        instance.host_status = new_status
        instance.save(update_fields=["host_status", "host_since"])
        return instance
