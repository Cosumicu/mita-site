from django.urls import path

from .views import ProfileListView, ProfileDetailView, MyProfileView, ProfileHostStatusUpdateView

urlpatterns = [
    path('', ProfileListView.as_view(), name='profile-list'),
    path('<uuid:user_id>/', ProfileDetailView.as_view(), name='get-profile'),
    path('me/', MyProfileView.as_view(), name='my-profile'),
    path("hosts/status/", ProfileHostStatusUpdateView.as_view(), name="host-status-update"),
    ]