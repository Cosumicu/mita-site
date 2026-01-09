from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.utils.timezone import now

from decimal import Decimal, ROUND_HALF_UP

from apps.properties.models import (
    Property,
    Reservation,
    PropertyView,
    PropertyLike,
    ReservationStatus,
    PropertyStatus,
)
from .utils import get_date_range, get_previous_date_range, pct_change

INCOME_STATUSES = [
    ReservationStatus.APPROVED,
    ReservationStatus.ONGOING,
    ReservationStatus.COMPLETED,
]

def _income_stats(user, start, end):
    # Revenue = completed stays that ENDED in the range
    completed = Reservation.objects.filter(
        property__user=user,
        status=ReservationStatus.COMPLETED,
        end_date__range=(start, end),
    )

    total_income = completed.aggregate(total=Sum("host_pay"))["total"] or 0
    total_nights = completed.aggregate(nights=Sum("number_of_nights"))["nights"] or 0
    adr = (total_income / total_nights) if total_nights else 0

    return total_income, total_nights, adr, completed

def _occupancy_rate(user, start, end, active_properties):
    # occupancy nights from reservations that overlap the range, income-generating statuses
    # NOTE: this uses number_of_nights as stored. If you want exact overlap-night calc,
    # you’d compute overlap per reservation.
    reservations = Reservation.objects.filter(
        property__user=user,
        status__in=INCOME_STATUSES,
        start_date__lte=end,
        end_date__gte=start,
    )

    days_in_range = (end - start).days + 1
    occ_nights = reservations.aggregate(nights=Sum("number_of_nights"))["nights"] or 0

    if not active_properties or days_in_range <= 0:
        return 0.0, occ_nights

    rate = (
        occ_nights
        / Decimal(active_properties * days_in_range)
        * Decimal("100")
    )
    return rate, occ_nights

def get_host_dashboard(user, range: str):
    start, end = get_date_range(range)
    prev_start, prev_end = get_previous_date_range(start, end)

    properties = Property.objects.filter(user=user, status=PropertyStatus.ACTIVE)
    active_properties = properties.count()

    # --------- CURRENT PERIOD ----------
    total_income, total_nights, adr, completed_res = _income_stats(user, start, end)
    occupancy_rate, occupancy_nights = _occupancy_rate(user, start, end, active_properties)

    # RevPAR commonly = ADR * Occupancy% (as a fraction)
    revpar = adr * (Decimal(occupancy_rate) / Decimal("100")) if occupancy_rate else 0

    total_views = PropertyView.objects.filter(
        property__user=user,
        created_at__date__range=(start, end),
    ).count()

    total_likes = PropertyLike.objects.filter(
        property__user=user,
        created_at__date__range=(start, end),
    ).count()

    reservations_created = Reservation.objects.filter(
        property__user=user,
        created_at__date__range=(start, end),
    ).count()

    # --------- PREVIOUS PERIOD (for deltas) ----------
    prev_income, prev_nights, prev_adr, _ = _income_stats(user, prev_start, prev_end)
    prev_occ_rate, _ = _occupancy_rate(user, prev_start, prev_end, active_properties)
    prev_revpar = prev_adr * (prev_occ_rate / 100) if prev_occ_rate else 0

    # --------- TODAY CARDS ----------
    today = now().date()

    checkins = Reservation.objects.filter(
        property__user=user,
        start_date=today,
        status__in=[ReservationStatus.APPROVED, ReservationStatus.ONGOING],
    ).count()

    checkouts = Reservation.objects.filter(
        property__user=user,
        end_date=today,
        status__in=[ReservationStatus.ONGOING, ReservationStatus.COMPLETED],
    ).count()

    ongoing_stays = Reservation.objects.filter(
        property__user=user,
        start_date__lte=today,
        end_date__gte=today,
        status=ReservationStatus.ONGOING,
    ).count()

    # “occupancy today” (rough): ongoing nights today / active_properties
    occupancy_today = (ongoing_stays / active_properties) * 100 if active_properties else 0

    # --------- CHARTS ----------
    revenue_chart = (
        completed_res
        .annotate(date=TruncDate("end_date"))
        .values("date")
        .annotate(revenue=Sum("host_pay"))
        .order_by("date")
    )

    bookings_chart = (
        Reservation.objects.filter(
            property__user=user,
            created_at__date__range=(start, end),
        )
        .annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )

    return {
        "meta": {
            "range": range,
            "start": start,
            "end": end,
            "prev_start": prev_start,
            "prev_end": prev_end,
        },
        "today": {
            "checkins": checkins,
            "checkouts": checkouts,
            "ongoing_stays": ongoing_stays,
            "occupancy_rate_today": round(occupancy_today, 2),
        },
        "stats": {
            "total_income": total_income.quantize(Decimal("0.01")),
            "total_income_change_pct": pct_change(total_income, prev_income).quantize(Decimal("0.01")),

            "occupancy_rate": occupancy_rate.quantize(Decimal("0.01")),
            "occupancy_rate_change_pct": pct_change(occupancy_rate, prev_occ_rate).quantize(Decimal("0.01")),

            "adr": adr.quantize(Decimal("0.01")),
            "adr_change_pct": pct_change(adr, prev_adr).quantize(Decimal("0.01")),

            "revpar": revpar.quantize(Decimal("0.01")),
            "revpar_change_pct": pct_change(revpar, prev_revpar).quantize(Decimal("0.01")),
        },

        "charts": {
            "bookings": list(bookings_chart),
            "revenue": list(revenue_chart),
        },
    }
