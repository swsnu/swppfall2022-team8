import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Room, Message
from .serializers import MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):

    #
    # WebSocket API
    #
    async def connect(self):
        self.room_id = int(self.scope["url_route"]["kwargs"]["room_id"])
        self.room_group_name = f"chat_{self.room_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data["command"] not in self.commands:
            return
        await self.commands[data["command"]](self, data)

    #
    # Commands about Message
    #
    async def list_messages(self, data):
        room_id = self.room_id
        data = await database_sync_to_async(ChatConsumer.get_list_data)(room_id=room_id)
        content = {
            "command": "list",
            "messages": data,
        }
        await self.send_message_to_client(content)

    @staticmethod
    def get_list_data(room_id):
        messages = Message.last_10_messages(room_id=room_id)
        return MessageSerializer(messages, many=True).data

    async def create_message(self, data):
        user_id = data["user_id"]
        room_id = self.room_id
        data = await database_sync_to_async(ChatConsumer.get_create_data)(
            room_id=room_id, user_id=user_id, content=data["message"]
        )
        content = {
            "command": "create",
            "message": data,
        }
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send_event_message_to_client",
                "command": "create",
                "message": content,
            },
        )

    @staticmethod
    def get_create_data(room_id, user_id, content):
        room_join = get_object_or_404(Room, id=room_id)
        user_join = get_object_or_404(User, id=user_id)
        message = Message.objects.create(
            room=room_join,
            author=user_join,
            content=content,
        )
        return MessageSerializer(message).data

    commands = {
        "list": list_messages,
        "create": create_message,
    }

    #
    # miscellaneous functions
    #
    async def send_message_to_client(self, message):
        await self.send(text_data=json.dumps(message))

    async def send_event_message_to_client(self, event):
        await self.send_message_to_client(event["message"])
