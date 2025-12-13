from rest_framework import generics
from rest_framework.response import Response
from apps.properties.models import Property
from apps.properties.serializers import PropertyListSerializer
from .services import recommend_properties

class RecommendationsListView(generics.GenericAPIView):
    serializer_class = PropertyListSerializer

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            queryset = Property.objects.filter(status="ACTIVE").order_by("-views_count")[:10]
        else:
            recommended_ids = recommend_properties(request.user.id)
            queryset = Property.objects.filter(id__in=recommended_ids)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

