from rest_framework import serializers

from .models import Property, Reservation

from apps.profiles.serializers import ProfileSerializer

class PropertyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'location',
            'price_per_night',
            'image_url',
            'favorited',
            'views',
            'created_at',
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None

class PropertyDetailSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile")

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
            'favorited',
            'image_url',
            'views',
        ]

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
            'favorited',
            'image',
        ]
    # Use field 'image' for creating instance of property
        
class ReservationSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile", read_only=True)
    property = PropertyDetailSerializer(read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'property',
            'start_date',
            'end_date',
            'guests',
            'number_of_nights',
            'total_amount',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'property', 'created_at', 'number_of_nights', 'total_amount']
    
    def get_total_amount(self, obj):
        return obj.total_amount()