from django.urls import path

from .views import PropertyListView, PropertyDetailView, PropertyCreateView, ReservationListCreateView, ToggleFavoriteView

urlpatterns = [
    path('', PropertyListView.as_view(), name='property_list'),
    path('<uuid:id>/', PropertyDetailView.as_view(), name='property-details'),
    path('create/', PropertyCreateView.as_view(), name='property-create'),
    path('reservation/', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('<uuid:id>/toggle-favorite/', ToggleFavoriteView.as_view(), name='toggle-favorite'),
]