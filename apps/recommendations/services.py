import pandas as pd
from surprise import Dataset, Reader, SVD
import pickle
from apps.properties.models import Reservation, PropertyLike, PropertyView, Property

MODEL_PATH = "cf_model.pkl"

def extract_interactions():
    data = []

    # BOOKINGS
    for r in Reservation.objects.all().values("user_id", "property_id"):
        data.append([r["user_id"], r["property_id"], 1.0])

    # LIKES
    for like in PropertyLike.objects.all().values("user_id", "property_id"):
        data.append([like["user_id"], like["property_id"], 0.7])

    # VIEWS (only logged-in users)
    for view in PropertyView.objects.filter(user__isnull=False).values("user_id", "property_id"):
        data.append([view["user_id"], view["property_id"], 0.2])

    df = pd.DataFrame(data, columns=["user_id", "property_id", "rating"])
    return df

def train_cf_model():
    df = extract_interactions()
    reader = Reader(rating_scale=(0, 1))
    dataset = Dataset.load_from_df(df, reader)
    trainset = dataset.build_full_trainset()
    
    model = SVD(n_factors=20, n_epochs=20, lr_all=0.005, reg_all=0.02)
    model.fit(trainset)

    # save model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

def recommend_properties(user_id, top_n=10):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    properties = Property.objects.filter(status="ACTIVE")
    predictions = []
    for prop in properties:
        pred = model.predict(user_id, prop.id).est
        predictions.append((prop.id, pred))

    predictions.sort(key=lambda x: x[1], reverse=True)
    recommended_ids = [p[0] for p in predictions[:top_n]]
    return recommended_ids
