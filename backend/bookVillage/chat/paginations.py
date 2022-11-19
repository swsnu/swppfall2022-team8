from rest_framework.pagination import CursorPagination


class BasePagination(CursorPagination):
    ordering = "-created_at"

    def get_next_link(self):
        link = super().get_next_link()
        return link.split("cursor=")[1] if link else link

    def get_previous_link(self):
        link = super().get_previous_link()
        return link.split("cursor=")[1] if link else link


class RoomSetPagination(BasePagination):
    page_size = 10


class MessageSetPagination(BasePagination):
    page_size = 20
