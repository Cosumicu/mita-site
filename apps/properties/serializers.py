from rest_framework import serializers

from .models import Property, Reservation, PropertyLike, PropertyTag, PropertyStatus

from apps.profiles.serializers import ProfileSerializer
from apps.reviews.serializers import ReviewSerializer

class PropertyTagSerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(source="pkid")
    label = serializers.CharField(source="name")

    class Meta:
        model = PropertyTag
        fields = ["value", "label"]

class PropertyListSerializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'category',
            'location',
            'guests',
            'image_url',
            'liked',
            'status',
            'views_count',
            'likes_count',
            'reservations_count',
            'price_per_night',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ["__all__"]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None
    
    def get_liked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

class PropertyDetailSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile")
    tags = PropertyTagSerializer(many=True)
    liked = serializers.SerializerMethodField()
    reviewed = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id',
            'user',
            'title',
            'description',
            'price_per_night',
            'bedrooms',
            'beds',
            'bathrooms',
            'guests',
            'location',
            'category',
            'checkin_time',
            'checkout_time',
            'is_instant_booking',
            'image_url',
            'status',
            'tags',
            'average_rating',
            'liked',
            'reviewed',
            'views_count',
            'likes_count',
            'reservations_count',
            'weekly_discount_rate',
            'monthly_discount_rate',
            'cleaning_fee',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ["__all__"]

    def get_liked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def get_reviewed(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.reviews.filter(user=user).exists()
        return False

class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'title',
            'description',
            'price_per_night',
            'bedrooms',
            'beds',
            'bathrooms',
            'guests',
            'location',
            'category',
            'image',
            'tags',
            'is_instant_booking',
            'weekly_discount_rate',
            'monthly_discount_rate',
            'cleaning_fee',
        ]
    # Use field 'image' for creating instance of property
        
class ReservationSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile", read_only=True)
    property = PropertyDetailSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'property',
            'start_date',
            'end_date',
            'checkin_time',
            'checkout_time',
            'is_instant_booking',
            'guests',
            'number_of_nights',
            'status',
            'confirmation_code',
            'long_stay_discount',
            'price_per_night',
            'cleaning_fee',
            'guest_service_fee_rate',
            'host_service_fee_rate',
            'tax_rate',
            'total_amount',
            'host_pay',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'number_of_nights',
            'long_stay_discount',
            'cleaning_fee',
            'guest_service_fee_rate',
            'host_service_fee_rate',
            'tax_rate',
            'total_amount',
            'status',
            'confirmation_code',
            'created_at',
            'updated_at',
        ]

class PropertyLikeSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = PropertyLike
        fields = ["id", "property", "user", "created", "modified"]

    def get_id(self, obj):
        return str(obj.id)

class PropertyStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=PropertyStatus.choices)

    class Meta:
        model = Property
        fields = ["status"]