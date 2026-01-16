from rest_framework.serializers import Serializer
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from apps.profiles.models import Profile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name"]

class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ["id", "email", "first_name", "last_name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

class LoginUserSerializer(Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials!")
