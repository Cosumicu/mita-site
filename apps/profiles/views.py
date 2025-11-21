from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import Profile
from apps.users.models import User
from .serializers import ProfileSerializer, ProfileUpdateSerializer

class ProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]

class CurrentUserProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)
    
class ProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = "id"

    def get_object(self):
        user_id = self.kwargs.get(self.lookup_url_kwarg)
        user = get_object_or_404(User, id=user_id)
        return user.profile
    
class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)