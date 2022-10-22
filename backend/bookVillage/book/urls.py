from django.urls import include, path
from rest_framework.routers import SimpleRouter
from book.views.book_view import BookViewSet

book_app_name = "book"
router = SimpleRouter()
router.register(book_app_name, BookViewSet, basename=book_app_name)

urlpatterns = [path("", include(router.urls))]
