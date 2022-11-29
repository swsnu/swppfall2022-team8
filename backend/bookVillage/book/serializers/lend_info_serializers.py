from json import JSONDecodeError

from rest_framework import serializers
from rest_framework.fields import empty

from book.models.lend_info import LendInfo, LendImage
from django.conf import settings


class LendInfoSerializer(serializers.ModelSerializer):
    questions = serializers.JSONField(required=False, default=list)
    cost = serializers.IntegerField(required=True)
    additional = serializers.CharField(required=False, allow_blank=True, default="")
    book_info = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    owner_username = serializers.ReadOnlyField(source="owner.username")
    images = serializers.SerializerMethodField()
    user_id = 0

    class Meta:
        model = LendInfo
        fields = (
            "id",
            "book",
            "book_info",
            "owner",
            "owner_username",
            "questions",
            "cost",
            "additional",
            "status",
            "images",
        )

    def validate_questions(self, questions):
        if isinstance(questions, list):
            for question in questions:
                if not isinstance(question, str):
                    raise serializers.ValidationError(
                        "questions is list. But must be list string input"
                    )
            return questions
        else:
            raise serializers.ValidationError(
                "questions must be list string input or nothing"
            )

    def validate_new_images(self, new_images):
        return new_images

    def validate_delete_images(self, delete_images):
        return delete_images

    def get_book_info(self, lend_info):
        from book.serializers.book_serializers import BookSerializer

        book = lend_info.book
        serializer = BookSerializer(book)
        data = serializer.data.copy()
        data.pop("id")
        return data

    def set_sercurity(self, user_id):
        self.user_id = user_id

    def get_status(self, lend_info):
        from book.serializers.borrrow_info_serializers import BorrowInfoSerializer

        borrow_info = lend_info.current_borrow
        if borrow_info:
            if self.user_id not in (0, lend_info.owner.id, borrow_info.borrower.id):
                return "borrowed"
            serializer = BorrowInfoSerializer(borrow_info)
            data = serializer.data.copy()
            return data
        else:
            return None

    def get_images(self, lend_info):
        data = []
        for image in lend_info.images.all():
            data.append({"id": image.id, "image": image.image.url})

        return data
