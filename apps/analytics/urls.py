from django.urls import path

from .views import HostCalendarAPIView, HostDashboardAPIView

urlpatterns = [
    path('host-calendar/', HostCalendarAPIView.as_view(), name='host-calendar'),
    path("host-dashboard/", HostDashboardAPIView.as_view()),
]