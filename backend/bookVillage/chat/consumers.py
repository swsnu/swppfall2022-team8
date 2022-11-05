import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Room, Message
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


class ChatConsumer(WebsocketConsumer):
    @staticmethod
    def message_to_json(message):
        return {
            "id": message.id,
            "author": message.author.username,
            "content": message.content,
            "timestamp": str(message.created_at),
        }

    @staticmethod
    def messages_to_json(messages):
        return [*map(ChatConsumer.message_to_json, messages)]

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    def fetch_messages(self, data):
        room_id = self.room_id
        messages = Message.last_10_messages(room_id)
        content = {
            "command": "fetch_messages",
            "messages": ChatConsumer.messages_to_json(messages),
        }
        self.send_message(content)

    def new_message(self, data):
        user_id = data["user_id"]
        room_id = self.room_id
        user_join = get_object_or_404(User, id=user_id)
        room_join = get_object_or_404(Room, id=room_id)
        message = Message.objects.create(
            author=user_join, room=room_join, content=data["message"]
        )
        content = {
            "command": "new_message",
            "message": ChatConsumer.message_to_json(message),
        }
        self.send_chat_message(content)

    commands = {
        "fetch_messages": fetch_messages,
        "new_message": new_message,
    }

    # Join room group
    def connect(self):
        self.room_id = int(self.scope["url_route"]["kwargs"]["room_id"])
        self.room_group_name = f"chat_{self.room_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    # Leave room group
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data["command"]](self, data)

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        self.send_message({"message": message})
