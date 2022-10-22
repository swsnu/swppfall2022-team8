from rest_framework import serializers

from book.models.lend_info import LendInfo
from book.serializers.book_serializers import BookSerializer


class LendInfoSerializer(serializers.ModelSerializer):
    questions = serializers.CharField(required=False)
    cost = serializers.IntegerField(required=True)
    additional = serializers.CharField(required=False)
    book_info = serializers.SerializerMethodField()

    class Meta:
        model = LendInfo
        fields = ("id", "book", "book_info", "owner", "questions", "cost", "additional")

    def get_book_info(self, lend_info):
        book = lend_info.book
        serializer = BookSerializer(book)
        data = serializer.data.copy()
        data.pop("id")
        return data
