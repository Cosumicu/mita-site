from django.urls import path

from .views import PropertyListView, PropertyDetailView, PropertyCreateView

urlpatterns = [
    path('', PropertyListView.as_view(), name='property_list'),
    path('<uuid:id>/', PropertyDetailView.as_view(), name='property-details'),
    path('create/', PropertyCreateView.as_view(), name='property-create'),
]