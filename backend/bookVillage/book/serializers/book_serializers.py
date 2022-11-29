from rest_framework import serializers

from book.models.book import Book, Tag
from django.conf import settings


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class BookSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    author = serializers.CharField(required=True)
    tags = serializers.SerializerMethodField()
    brief = serializers.CharField(required=False)
    image = serializers.ImageField(allow_empty_file=True, required=False)

    class Meta:
        model = Book
        fields = (
            "id",
            "image",
            "title",
            "author",
            "tags",
            "brief",
        )

    def get_tags(self, book):
        tags = book.tags.all()
        result = []
        for tag in tags:
            result.append(tag.name)
        return result
