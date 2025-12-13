from django.urls import path
from .views import RecommendationsListView

urlpatterns = [
    path('recommendations/', RecommendationsListView.as_view(), name='recommendations'),
]