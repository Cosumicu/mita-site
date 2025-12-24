import pandas as pd
from django.db.models import Count, Avg
from sklearn.metrics.pairwise import cosine_similarity

from apps.properties.models import Reservation, PropertyLike, PropertyView
from apps.reviews.models import Review

# =========================
# Weights
# =========================
BOOKING_W = 5.0
LIKE_W = 3.0
VIEW_W = 1.0
RATING_W = 1.0


# =========================
# 1. Build interaction DF
# =========================
def extract_interactions():
    rows = []

    # BOOKINGS
    for r in (
        Reservation.objects
        .values("user_id", "property_id")
        .annotate(cnt=Count("id"))
    ):
        rows.append({
            "user_id": str(r["user_id"]),       # UUID-safe
            "property_id": r["property_id"],
            "score": r["cnt"] * BOOKING_W,
        })

    # LIKES
    for l in (
        PropertyLike.objects
        .values("user_id", "property_id")
        .annotate(cnt=Count("id"))
    ):
        rows.append({
            "user_id": str(l["user_id"]),
            "property_id": l["property_id"],
            "score": l["cnt"] * LIKE_W,
        })

    # VIEWS (logged-in only)
    for v in (
        PropertyView.objects
        .filter(user__isnull=False)
        .values("user_id", "property_id")
        .annotate(cnt=Count("id"))
    ):
        rows.append({
            "user_id": str(v["user_id"]),
            "property_id": v["property_id"],
            "score": v["cnt"] * VIEW_W,
        })

    # RATINGS
    for r in (
        Review.objects
        .values("user_id", "property_id")
        .annotate(avg_rating=Avg("rating"))
    ):
        rows.append({
            "user_id": str(r["user_id"]),
            "property_id": r["property_id"],
            "score": r["avg_rating"] * RATING_W,
        })

    if not rows:
        return pd.DataFrame(columns=["user_id", "property_id", "score"])

    df = pd.DataFrame(rows)

    # Aggregate multiple signals
    df = (
        df.groupby(["user_id", "property_id"], as_index=False)
        .agg({"score": "sum"})
    )

    return df


# =========================
# 2. Item similarity
# =========================
def compute_item_similarity(df):
    if df.empty:
        return None

    user_item = df.pivot_table(
        index="user_id",
        columns="property_id",
        values="score",
        fill_value=0,
    )

    if user_item.shape[1] < 2:
        return None

    sim = cosine_similarity(user_item.T)

    return pd.DataFrame(
        sim,
        index=user_item.columns,
        columns=user_item.columns,
    )


# =========================
# 3. Recommend (NO fallback)
# =========================
def recommend_properties(user_id, df, similarity_matrix, top_n=10):
    user_id = str(user_id)

    if df.empty:
        return [], "no_data"

    user_item = df.pivot_table(
        index="user_id",
        columns="property_id",
        values="score",
        fill_value=0,
    )

    if user_id not in user_item.index:
        return [], "cold_start_user"

    user_scores = user_item.loc[user_id]
    interacted = user_scores[user_scores > 0].index.tolist()

    if not interacted:
        return [], "no_interactions"

    if similarity_matrix is None:
        return [], "no_similarity_matrix"

    candidate_scores = {}

    for prop in interacted:
        if prop not in similarity_matrix.columns:
            continue

        for other_prop, sim in similarity_matrix[prop].items():
            if other_prop in interacted:
                continue
            if sim <= 0:
                continue

            candidate_scores.setdefault(other_prop, 0)
            candidate_scores[other_prop] += sim * user_scores[prop]

    if not candidate_scores:
        return [], "no_cf_signal"

    ranked = sorted(
        candidate_scores.items(),
        key=lambda x: x[1],
        reverse=True,
    )

    return [pid for pid, _ in ranked[:top_n]], "cf"
