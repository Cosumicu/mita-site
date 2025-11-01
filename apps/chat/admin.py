from django.contrib import admin
from .models import Conversation, Message

# Register your models here.
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'reservation__id']
    list_display_links = ['id']

class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'text', 'created_at', 'sender']
    list_display_links = ['id']

admin.site.register(Conversation, ConversationAdmin)
admin.site.register(Message, MessageAdmin)