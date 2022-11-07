from rest_framework import serializers
from django.contrib.auth.models import User
from chat.models import Room, Message


class RoomSerializer(serializers.ModelSerializer):
    lender_username = serializers.ReadOnlyField(source="lender.username")
    borrower_username = serializers.ReadOnlyField(source="borrower.username")

    class Meta:
        model = Room
        fields = (
            "id",
            "lend_id",
            "lender",
            "lender_username",
            "borrower",
            "borrower_username",
        )


class MessageSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    timestamp = serializers.DateTimeField(source="created_at")

    class Meta:
        model = Message
        fields = (
            "id",
            "author",
            "author_username",
            "content",
            "timestamp",
        )
