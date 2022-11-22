from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from book.models.book import Book, Tag, BookTag
from book.models.borrow_info import BorrowInfo
from book.models.lend_info import LendInfo
from django.contrib.auth.models import User


class LendTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user_0 = User.objects.create_user(username="a", password="a")
        cls.user_1 = User.objects.create_user(username="b", password="b")
        cls.tag_0 = Tag.objects.create(name="tag0")
        cls.tag_1 = Tag.objects.create(name="tag1")
        cls.book_0 = Book.objects.create(title="book0", author="aa")
        cls.book_1 = Book.objects.create(title="book1", author="bb")
        BookTag.objects.create(tag=cls.tag_0, book=cls.book_0)
        BookTag.objects.create(tag=cls.tag_1, book=cls.book_1)

    def setUp(self) -> None:
        self.client_0 = APIClient()
        self.client_1 = APIClient()
        self.client_0.force_authenticate(user=self.user_0)
        self.client_1.force_authenticate(user=self.user_1)

    def test_list_쿼리_없음(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)
        lend_1 = LendInfo.objects.create(owner=self.user_1, book=self.book_1, cost=200)

        # when
        res = self.client_0.get("/api/lend/")
        data = res.data["results"]

        # then
        from book.serializers.book_serializers import BookSerializer

        assert len(data) == 2
        assert res.status_code == status.HTTP_200_OK
        book_data = data[0]["book_info"]
        assert book_data["title"] == "book0"
        assert book_data["author"] == "aa"
        assert data[0]["status"] is None
        assert data[1]["status"] is None

    def test_list_borrowed_출력(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)
        lend_1 = LendInfo.objects.create(owner=self.user_0, book=self.book_1, cost=200)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res = self.client_0.get("/api/lend/")
        data = res.data["results"]

        # then
        assert len(data) == 2
        assert res.status_code == status.HTTP_200_OK
        assert data[0]["status"]
        assert data[1]["status"] is None

    def test_list_제목_저자_쿼리(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)
        lend_1 = LendInfo.objects.create(owner=self.user_1, book=self.book_1, cost=200)

        # when
        res = self.client_0.get("/api/lend/?title=bo&author=a")
        data = res.data["results"]

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1
        assert data[0]["book_info"]["title"] == "book0"

    def test_list_태그_쿼리(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)
        lend_1 = LendInfo.objects.create(owner=self.user_1, book=self.book_1, cost=200)

        # when
        res = self.client_0.get("/api/lend/?tag[]=tag0")
        data = res.data["results"]

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1
        assert data[0]["book_info"]["title"] == "book0"

    def test_create_성공(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)

        # when
        res = self.client_0.post(
            "/api/lend/",
            data={"book": self.book_0.id, "owner": self.user_0.id, "cost": 200},
            format="json",
        )
        data = res.data

        assert res.status_code == status.HTTP_201_CREATED
        assert data["book_info"]["title"] == "book0"
        assert LendInfo.objects.count() == 2

    def test_create_question_실패(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)

        # when
        res = self.client_0.post(
            "/api/lend/",
            data={
                "book": self.book_0.id,
                "owner": self.user_0.id,
                "cost": 200,
                "questions": "I am troll string",
            },
            format="json",
        )
        data = res.data

        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert LendInfo.objects.count() == 1

    def test_retrieve_주인(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res = self.client_0.get(f"/api/lend/{lend_0.id}/")
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert data["status"]
        assert data["status"] != "borrowed"

    def test_retrieve_주인_빌린_사람_아님(self):
        # given
        user_2 = User.objects.create_user(username="c", password="c")
        client_2 = APIClient()
        client_2.force_authenticate(user=user_2)
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)
        borrow_0 = BorrowInfo.objects.create(borrower=self.user_1, lend_id=lend_0)

        # when
        res = client_2.get(f"/api/lend/{lend_0.id}/")
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert data["status"] == "borrowed"

    def test_update_주인_아님(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)

        # when
        res = self.client_1.put(f"/api/lend/{lend_0.id}/")

        # then
        assert res.status_code == status.HTTP_403_FORBIDDEN
        assert LendInfo.objects.count() == 1

    def test_update_주인(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)

        # when
        res = self.client_0.put(
            f"/api/lend/{lend_0.id}/", data={"cost": 400}, format="json"
        )
        data = res.data
        # then
        assert res.status_code == status.HTTP_200_OK
        lend_0 = LendInfo.objects.get(id=lend_0.id)
        assert lend_0.cost == 400

    def test_destroy_주인_아님(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)

        # when
        res = self.client_1.delete(f"/api/lend/{lend_0.id}/")

        # then
        assert res.status_code == status.HTTP_403_FORBIDDEN
        assert LendInfo.objects.count() == 1

    def test_destroy_주인(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)

        # when
        res = self.client_0.delete(f"/api/lend/{lend_0.id}/")

        # then
        assert res.status_code == status.HTTP_204_NO_CONTENT
        assert LendInfo.objects.count() == 0

    def test_user(self):
        # given
        lend_0 = LendInfo.objects.create(owner=self.user_0, book=self.book_0, cost=100)
        lend_1 = LendInfo.objects.create(owner=self.user_1, book=self.book_1, cost=200)

        # when
        res = self.client_0.get("/api/lend/user/")

        # then
        assert len(res.data["results"]) == 1
