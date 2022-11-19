from rest_framework import serializers
from chat.models import Room, Message


class RoomSerializer(serializers.ModelSerializer):
    questions = serializers.ReadOnlyField(source="lend_id.questions")
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
            "questions",
            "answers",
        )

    def validate_answers(self, answers):
        if isinstance(answers, list):
            for question in answers:
                if not isinstance(question, str):
                    raise serializers.ValidationError(
                        "answers is list. But must be list string input"
                    )
            return answers
        else:
            raise serializers.ValidationError(
                "answers must be list string input or nothing"
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
            "rank",
            "timestamp",
        )
