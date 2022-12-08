from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from book.models.book import Book
from book.models.lend_info import LendInfo
from chat.models import Room, Message
from django.contrib.auth.models import User
import tempfile


class RoomTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user_0 = User.objects.create_user(username="a", password="a")
        cls.user_1 = User.objects.create_user(username="b", password="b")
        cls.book_0 = Book.objects.create(title="book0", author="a")
        cls.book_1 = Book.objects.create(title="book1", author="b")
        cls.lend_0 = LendInfo.objects.create(
            book=cls.book_0, owner=cls.user_0, cost=100
        )
        cls.lend_1 = LendInfo.objects.create(
            book=cls.book_1, owner=cls.user_1, cost=200
        )
        cls.room_0 = Room.objects.create(
            lend_id=cls.lend_0, lender=cls.user_0, borrower=cls.user_1
        )

    def setUp(self) -> None:
        self.client = APIClient()
        self.client.force_authenticate(user=self.user_0)

    def test_room_list(self):
        # when
        res = self.client.get("/api/room/")

        data = res.data["results"]

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1

    def test_room_create(self):
        # when
        res = self.client.post(
            "/api/room/",
            data={
                "borrower": self.user_0.id,
                "lend_id": self.lend_1.id,
                "answers": [],
            },
            format="json",
        )
        data = res.data

        # then
        assert res.status_code == status.HTTP_201_CREATED
        assert data["borrower_username"] == self.user_0.username
