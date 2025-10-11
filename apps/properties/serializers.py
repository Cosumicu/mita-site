from rest_framework import serializers

from .models import Property, Reservation

from apps.profiles.serializers import ProfileSerializer

class PropertyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'price_per_night',
            'image_url',
            'favorited',
            'views',
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

    # use image for creating 
        
class ReservationsListSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True, many=False)
    
    class Meta:
        model = Reservation
        fields = [
            'id',
            'start_date',
            'end_date',
            'number_of_nights',
            'total_price',
            'property',
        ]