from rest_framework.pagination import PageNumberPagination


class BookPageNumberPagination(PageNumberPagination):
    page_size = 12


class LendPageNumberPagination(PageNumberPagination):
    page_size = 12


class BorrowPageNumberPagination(PageNumberPagination):
    page_size = 12
