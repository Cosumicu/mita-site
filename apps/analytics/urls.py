from django.urls import path

from .views import HostCalendarAPIView

urlpatterns = [
    path('host-calendar/', HostCalendarAPIView.as_view(), name='host-calendar'),
]