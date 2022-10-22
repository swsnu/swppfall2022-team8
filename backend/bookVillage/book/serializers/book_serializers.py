from rest_framework import serializers

from django.contrib.auth.models import User
from book.models.book import Book


class BookSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    author = serializers.CharField(required=True)
    tag = serializers.CharField(required=False)
    brief = serializers.CharField(required=False)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "tag",
            "brief",
        ]
