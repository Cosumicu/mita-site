from celery import shared_task
from django.utils import timezone
from .models import Reservation, ReservationStatus

@shared_task
def update_reservations_status_task():
    today = timezone.now().date()

    # Complete reservations that have ended
    completed_reservations = Reservation.objects.filter(
        status__in=[ReservationStatus.APPROVED, ReservationStatus.ONGOING, ReservationStatus.APPROVED],
        end_date__lt=today
    )
    completed_count = completed_reservations.update(status=ReservationStatus.COMPLETED)

    # Update ongoing reservations
    ongoing_reservations = Reservation.objects.filter(
        status__in=[ReservationStatus.APPROVED, ReservationStatus.APPROVED],
        start_date__lte=today,
        end_date__gte=today
    )
    ongoing_count = ongoing_reservations.update(status=ReservationStatus.ONGOING)

    return f"Completed {completed_count} reservations, marked {ongoing_count} as ongoing"
