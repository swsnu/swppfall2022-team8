from django.urls import include, path
from rest_framework.routers import SimpleRouter
from book.views.book_view import BookViewSet
from book.views.lend_info_view import LendInfoViewSet, LendImageViewSet
from book.views.borrow_info_view import BorrowInfoViewSet

book_app_name = "book"
lend_info_app_name = "lend"
lend_image_app_name = "lend_image"
borrow_info_app_name = "borrow"

router = SimpleRouter()
router.register(book_app_name, BookViewSet, basename="book")
router.register(lend_info_app_name, LendInfoViewSet, basename="lend")
router.register(lend_image_app_name, LendImageViewSet, basename="lend_image")
router.register(borrow_info_app_name, BorrowInfoViewSet, basename="borrow")

urlpatterns = [path("", include(router.urls))]
