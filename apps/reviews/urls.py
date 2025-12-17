from django.urls import path

from .views import ReviewListCreateView

urlpatterns = [
    path("<uuid:property_id>/", ReviewListCreateView.as_view(), name="review-list-create")
]