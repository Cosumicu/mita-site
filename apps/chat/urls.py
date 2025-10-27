from django.urls import path

from .views import ConversationListView, MessageListCreateView

urlpatterns = [
    path('', ConversationListView.as_view(), name='conversation-list'),
    path('<uuid:id>/', MessageListCreateView.as_view(), name='message-list-create'),
]