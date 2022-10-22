from django.urls import include, path
from rest_framework.routers import SimpleRouter
from book.views.book_view import BookViewSet
from book.views.lend_info_view import LendInfoViewSet
from book.views.borrow_info_view import BorrowInfoViewSet

book_app_name = "book"
lend_info_app_name = "lend"
borrow_info_app_name = "borrow"
router = SimpleRouter()
router.register(book_app_name, BookViewSet, basename=book_app_name)
router.register(lend_info_app_name, LendInfoViewSet, basename=lend_info_app_name)
router.register(borrow_info_app_name, BorrowInfoViewSet, basename=borrow_info_app_name)

urlpatterns = [path("", include(router.urls))]
