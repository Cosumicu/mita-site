from django.shortcuts import render, get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError

from .models import Review
from .serializers import ReviewSerializer
from .pagination import ReviewPagination

from apps.properties.models import Property

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ReviewPagination

    def get_queryset(self):
        property_id = self.kwargs.get("property_id")
        return Review.objects.filter(property__id=property_id)

    def perform_create(self, serializer):
        user = self.request.user
        property_id = self.kwargs.get("property_id")
        property = get_object_or_404(Property, id=property_id)

        if user == property.user:
            raise ValidationError({"You can't review your own property."})

        serializer.save(
            user=user,
            property=property
        )