from json import JSONDecodeError

from rest_framework import serializers

from book.models.lend_info import LendInfo


class LendInfoSerializer(serializers.ModelSerializer):
    questions = serializers.JSONField(required=False, default=list)
    cost = serializers.IntegerField(required=True)
    additional = serializers.CharField(required=False, allow_blank=True, default="")
    book_info = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = LendInfo
        fields = (
            "id",
            "book",
            "book_info",
            "owner",
            "questions",
            "cost",
            "additional",
            "status",
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

    def get_book_info(self, lend_info):
        from book.serializers.book_serializers import BookSerializer

        book = lend_info.book
        serializer = BookSerializer(book)
        data = serializer.data.copy()
        data.pop("id")
        return data

    def get_status(self, lend_info):
        from book.serializers.borrrow_info_serializers import BorrowInfoSerializer

        borrow_info = lend_info.current_borrow
        if borrow_info:
            serializer = BorrowInfoSerializer(borrow_info)
            data = serializer.data.copy()
            return data
        else:
            return None
