import tempfile

from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from book.models.book import Book, Tag, BookTag
from book.models.borrow_info import BorrowInfo
from book.models.lend_info import LendInfo
from django.contrib.auth.models import User


class BorrowTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user_0 = User.objects.create_user(username="a", password="a")
        cls.user_1 = User.objects.create_user(username="b", password="b")
        cls.tag_0 = Tag.objects.create(name="tag0")
        cls.tag_1 = Tag.objects.create(name="tag1")
        cls.image = tempfile.NamedTemporaryFile(suffix=".jpg").name
        cls.book_0 = Book.objects.create(title="book0", author="aa")
        cls.book_1 = Book.objects.create(title="book1", author="bb")
        BookTag.objects.create(tag=cls.tag_0, book=cls.book_0)
        BookTag.objects.create(tag=cls.tag_1, book=cls.book_1)

    def setUp(self) -> None:
        self.client_0 = APIClient()
        self.client_1 = APIClient()
        self.client_0.force_authenticate(user=self.user_0)
        self.client_1.force_authenticate(user=self.user_1)

    def test_create_성공(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)

        # when
        res = self.client_0.post(
            "/api/borrow/",
            data={"borrower": self.user_1.id, "lend_id": lend_0.id},
            format="json",
        )
        data = res.data

        # then
        assert res.status_code == status.HTTP_201_CREATED
        assert data["lend_id"] == lend_0.id
        assert data["borrower"] == self.user_1.id
        assert data["borrower_username"] == self.user_1.username
        assert data["active"] is True
        assert data["lend_start_time"]
        assert data["lend_end_time"] is None
        assert BorrowInfo.objects.count() == 1

    def test_create_자신의_lend_borrow_실패(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)

        # when
        res = self.client_0.post(
            "/api/borrow/",
            data={"borrower": self.user_0.id, "lend_id": lend_0.id},
            format="json",
        )

        # then
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert BorrowInfo.objects.count() == 0

    def test_create_owner_아니면_실패(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)

        # when
        res = self.client_1.post(
            "/api/borrow/",
            data={"borrower": self.user_1.id, "lend_id": lend_0.id},
            format="json",
        )
        data = res.data

        # then
        assert res.status_code == status.HTTP_403_FORBIDDEN
        assert BorrowInfo.objects.count() == 0

    def test_create_이미_borrowed(self):
        # given
        user_2 = User.objects.create_user(username="c", password="c")
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res = self.client_0.post(
            "/api/borrow/",
            data={"borrower": user_2.id, "lend_id": lend_0.id},
            format="json",
        )

        # then
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert BorrowInfo.objects.count() == 1

    def test_update_성공(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res = self.client_0.put(
            f"/api/borrow/{borrow_0.id}/",
        )
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert data["active"] is False
        assert data["lend_end_time"]
        assert BorrowInfo.objects.count() == 1
        assert BorrowInfo.objects.filter(active=True).count() == 0

    def test_update_body_보냄(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res = self.client_0.put(
            f"/api/borrow/{borrow_0.id}/", data={"active": False}, format="json"
        )

        # then
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_active_false_실패(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res1 = self.client_0.put(
            f"/api/borrow/{borrow_0.id}/",
        )
        res2 = self.client_0.put(
            f"/api/borrow/{borrow_0.id}/",
        )

        # then
        assert res2.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_주인_아닌데_시도(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res = self.client_1.put(
            f"/api/borrow/{borrow_0.id}/",
        )

        # then
        assert res.status_code == status.HTTP_403_FORBIDDEN

    def test_user(self):
        # given
        lend_0 = LendInfo.objects.create(book=self.book_0, owner=self.user_0, cost=400)
        lend_1 = LendInfo.objects.create(book=self.book_1, owner=self.user_0, cost=300)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)
        borrow_1 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_1)

        # when
        _ = self.client_0.put(
            f"/api/borrow/{borrow_0.id}/",
        )
        res = self.client_1.get(f"/api/borrow/user/")
        data = res.data

        # then
        assert len(data) == 2
        assert data[0]["active"] is False
        assert data[1]["active"] is True
