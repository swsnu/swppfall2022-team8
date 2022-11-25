from rest_framework.pagination import PageNumberPagination


class LendPageNumberPagination(PageNumberPagination):
    page_size = 12


class BorrowPageNumberPagination(PageNumberPagination):
    page_size = 12
