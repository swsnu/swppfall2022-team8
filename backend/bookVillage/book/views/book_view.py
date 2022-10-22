from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import datetime
from book.models.book import Book
from django.shortcuts import get_object_or_404
from book.serializers.book_serializers import BookSerializer


class BookViewSet(viewsets.GenericViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # GET /api/book/
    def list(self, request):
        title = request.GET.get("title", "")
        author = request.GET.get("author", "")
        tag = request.GET.get("tag", "")
        books = self.get_queryset().filter(
            title__icontains=title, author__icontains=author, tag__icontains=tag
        )
        data = self.get_serializer(books, many=True).data
        print(data)
        return Response(data, status=status.HTTP_200_OK)

    # POST /api/book/
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book = serializer.save()
        book.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET /api/book/{book_id}
    def retrieve(self, request, pk=None):
        book = self.get_object()
        return Response(self.get_serializer(book).data, status=status.HTTP_200_OK)

    # PUT /api/book/{book_id}
    def update(self, request, pk=None):
        book = self.get_object()
        serializer = self.get_serializer(book, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    # DELETE /api/book/{book_id}
    def destroy(self, request, pk=None):
        book = self.get_object()
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
