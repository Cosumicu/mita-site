from rest_framework.views import APIView
from rest_framework.response import Response
from .services import extract_interactions, compute_item_similarity, recommend_properties
from apps.properties.models import Property
from apps.properties.serializers import PropertyListSerializer

# Optional: cache similarity matrix in memory
SIMILARITY_MATRIX = None
INTERACTIONS_DF = None

class RecommendationView(APIView):
    def get(self, request, format=None):
        global SIMILARITY_MATRIX, INTERACTIONS_DF

        user = request.user
        if not user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=401)

        # Load/calc df and similarity
        if INTERACTIONS_DF is None:
            INTERACTIONS_DF = extract_interactions()
        if SIMILARITY_MATRIX is None:
            SIMILARITY_MATRIX = compute_item_similarity(INTERACTIONS_DF)

        recommended_ids = recommend_properties(user.id, INTERACTIONS_DF, SIMILARITY_MATRIX, top_n=10)

        # Fetch property details
        properties = Property.objects.filter(id__in=recommended_ids)
        serializer = PropertyListSerializer(
                    properties,
                    many=True,
                    context={"request": request}
                    )
        return Response(serializer.data)