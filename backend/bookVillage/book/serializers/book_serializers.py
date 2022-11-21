from rest_framework import serializers

from django.contrib.auth.models import User
from book.models.book import Book, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class BookSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    title = serializers.CharField(required=True)
    author = serializers.CharField(required=True)
    tags = serializers.SerializerMethodField()
    brief = serializers.CharField(required=False)

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

    def get_image(self, book):
        if hasattr(book, "bookimage"):
            return book.bookimage.image.url
        else:
            return None

    def get_tags(self, book):
        tags = book.tags.all()
        result = []
        for tag in tags:
            result.append(tag.name)
        return result
