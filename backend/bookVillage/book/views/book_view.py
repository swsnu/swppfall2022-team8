from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from book.models.book import Book, Tag, BookTag
from book.serializers.book_serializers import BookSerializer


class BookViewSet(viewsets.GenericViewSet):
    queryset = Book.objects.all().prefetch_related("tags")
    serializer_class = BookSerializer
    permission_classes = (IsAuthenticated(),)

    def get_permissions(self):
        if self.action in ("all"):
            return (AllowAny(),)
        return self.permission_classes

    # GET /api/book/
    def list(self, request):
        title = request.GET.get("title", "")
        author = request.GET.get("author", "")
        tags = request.GET.getlist("tag[]", [])
        books = (
            self.get_queryset()
            .filter(
                title__icontains=title,
                author__icontains=author,
            )
            .distinct()
        )
        if tags:
            books = books.filter(tags__name__in=tags).distinct()
        books = books[:100]
        data = self.get_serializer(books, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    # POST /api/book/
    def create(self, request):
        data = request.data.copy()
        tag_data = data.pop("tags", [])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        book = serializer.save()
        book.save()
        for name in tag_data:
            tag, created = Tag.objects.get_or_create(name=name)
            BookTag.objects.create(book=book, tag=tag)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET /api/book/{book_id}
    def retrieve(self, request, pk=None):
        book = self.get_object()
        return Response(self.get_serializer(book).data, status=status.HTTP_200_OK)

    # PUT /api/book/{book_id}
    def update(self, request, pk=None):
        book = self.get_object()
        data = request.data.copy()
        tag_data = data.pop("tags", 0)
        serializer = self.get_serializer(book, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if isinstance(tag_data, list):
            BookTag.objects.filter(book=book).delete()
            for name in tag_data:
                tag, created = Tag.objects.get_or_create(name=name)
                BookTag.objects.create(book=book, tag=tag)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # DELETE /api/book/{book_id}
    def destroy(self, request, pk=None):
        book = self.get_object()
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # PUT /api/book/all
    @action(detail=False, methods=["PUT"])
    def all(self, request):
        internal_password = request.data.get("internal_password")

        if internal_password != "41q2c8578":
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = {
            "book_tags": list(BookTag.objects.all().values()),
            "tags": list(Tag.objects.all().values("id", "name")),
            "books": list(Book.objects.all().values("id")),
        }
        return Response(data, status=status.HTTP_200_OK)
