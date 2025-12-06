from celery import shared_task
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Reservation, ReservationStatus


@shared_task
def update_reservations_status_task():
    now = timezone.now()

    # ------------------------------------
    # 1. COMPLETE RESERVATIONS
    # ------------------------------------
    completed = []

    for r in Reservation.objects.filter(
        status__in=[ReservationStatus.APPROVED, ReservationStatus.ONGOING]
    ):
        checkout_dt = timezone.make_aware(
            datetime.combine(r.end_date, r.checkout_time)
        )

        if now > checkout_dt:
            completed.append(r.id)

    Reservation.objects.filter(id__in=completed).update(
        status=ReservationStatus.COMPLETED
    )

    # ------------------------------------
    # 2. MARK ONGOING
    # ------------------------------------
    ongoing = []

    for r in Reservation.objects.filter(
        status=ReservationStatus.APPROVED
    ):
        checkin_dt = timezone.make_aware(
            datetime.combine(r.start_date, r.checkin_time)
        )
        checkout_dt = timezone.make_aware(
            datetime.combine(r.end_date, r.checkout_time)
        )

        if checkin_dt <= now <= checkout_dt:
            ongoing.append(r.id)

    Reservation.objects.filter(id__in=ongoing).update(
        status=ReservationStatus.ONGOING
    )

    # ------------------------------------
    # 3. EXPIRE PENDING > 24 HOURS
    # ------------------------------------
    expiration_time = now - timedelta(hours=24)

    expired_count = Reservation.objects.filter(
        status=ReservationStatus.PENDING,
        created_at__lt=expiration_time
    ).update(status=ReservationStatus.EXPIRED)

    return (
        f"Completed {len(completed)}, "
        f"Marked {len(ongoing)} Ongoing, "
        f"Expired {expired_count}"
    )
