from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from book.models.book import Book, Tag, BookTag
from book.models.borrow_info import BorrowInfo
from book.models.lend_info import LendInfo
from django.contrib.auth.models import User
from user.models import WatchLend, UserRecommend
from unittest.mock import patch, MagicMock


class UserTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user_0 = User.objects.create_user(username="a", password="a")
        cls.user_1 = User.objects.create_user(username="b", password="b")

    def setUp(self) -> None:
        self.client = APIClient()

    def test_signup_password_없음(self):
        # when
        res = self.client.post("/api/user/", data={"username": "c"}, format="json")

        # then
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_signup_username_겹침(self):
        # when
        res = self.client.post(
            "/api/user/", data={"username": "a", "password": "c"}, format="json"
        )

        # then
        assert res.status_code == status.HTTP_409_CONFLICT

    def test_signup_성공(self):
        # when
        res = self.client.post(
            "/api/user/", data={"username": "c", "password": "c"}, format="json"
        )
        data = res.data

        # then
        assert res.status_code == status.HTTP_201_CREATED
        assert data["token"]

    def test_login_실패(self):
        # when
        res = self.client.post(
            "/api/user/login/", data={"username": "c", "password": "c"}, format="json"
        )

        # then
        assert res.status_code == status.HTTP_403_FORBIDDEN

    def test_login_성공(self):
        # when
        res = self.client.post(
            "/api/user/login/", data={"username": "b", "password": "b"}, format="json"
        )
        data = res.data
        # then
        assert res.status_code == status.HTTP_200_OK
        assert data["token"]

    def test_logout(self):
        # given
        res1 = self.client.post(
            "/api/user/login/", data={"username": "b", "password": "b"}, format="json"
        )
        token = f"Token {res1.data['token']}"
        # when
        res2 = self.client.put("/api/user/logout/", HTTP_AUTHORIZATION=token)

        # then
        assert res2.status_code == status.HTTP_204_NO_CONTENT


class UserRelatedTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user_0 = User.objects.create_user(username="a", password="a")
        cls.user_1 = User.objects.create_user(username="b", password="b")
        cls.tag_0 = Tag.objects.create(name="tag0")
        cls.tag_1 = Tag.objects.create(name="tag1")
        cls.book_0 = Book.objects.create(title="book0", author="aa")
        cls.book_1 = Book.objects.create(title="book1", author="bb")
        cls.lend_0 = LendInfo.objects.create(
            book=cls.book_0, owner=cls.user_0, cost=200
        )
        cls.lend_1 = LendInfo.objects.create(
            book=cls.book_1, owner=cls.user_0, cost=300
        )
        BookTag.objects.create(tag=cls.tag_0, book=cls.book_0)
        BookTag.objects.create(tag=cls.tag_1, book=cls.book_1)
        UserRecommend.objects.create(user=cls.user_0)
        UserRecommend.objects.create(user=cls.user_1)

    def setUp(self) -> None:
        self.client_0 = APIClient()
        self.client_1 = APIClient()
        self.client_0.force_authenticate(user=self.user_0)
        self.client_1.force_authenticate(user=self.user_1)

    def test_put_watch_lend_id_없음(self):
        # when
        res = self.client_1.put("/api/user/watch/")

        # then
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_put_watch_lend_id_틀림(self):
        # when
        impossible_lend_id = self.lend_0.id + self.lend_1.id + 1
        res = self.client_1.put(
            "/api/user/watch/",
            data={"lend_id": impossible_lend_id},
            format="json",
        )

        # then
        assert res.status_code == status.HTTP_404_NOT_FOUND

    def test_put_watch_created(self):
        # when
        res = self.client_1.put(
            "/api/user/watch/",
            data={"lend_id": self.lend_0.id},
            format="json",
        )
        data = res.data

        # then
        assert res.status_code == status.HTTP_201_CREATED
        assert data["created"] is True
        assert WatchLend.objects.count() == 1

    def test_put_watch_deleted(self):
        # when
        _ = self.client_1.put(
            "/api/user/watch/",
            data={"lend_id": self.lend_0.id},
            format="json",
        )
        res = self.client_1.put(
            "/api/user/watch/",
            data={"lend_id": self.lend_0.id},
            format="json",
        )

        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert data["created"] is False
        assert WatchLend.objects.count() == 0

    def test_get_watch(self):
        # given
        watch_0 = WatchLend.objects.create(
            watching_lend=self.lend_0, watcher=self.user_1
        )
        watch_1 = WatchLend.objects.create(
            watching_lend=self.lend_1, watcher=self.user_1
        )

        # when
        res0 = self.client_0.get("/api/user/watch/")
        res1 = self.client_1.get("/api/user/watch/")

        assert res0.status_code == status.HTTP_200_OK
        assert res1.status_code == status.HTTP_200_OK
        assert len(res0.data["results"]) == 0
        assert len(res1.data["results"]) == 2

    def test_put_tag_body_에_tag_없음(self):
        # when
        res = self.client_0.put("/api/user/tag/")

        # then
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_put_tag_tag_name_없음(self):
        # when
        res = self.client_0.put(
            "/api/user/tag/", data={"tag": "noneTag"}, format="json"
        )

        # then
        assert res.status_code == status.HTTP_404_NOT_FOUND

    def test_put_tag_created_true(self):
        # when
        res = self.client_0.put("/api/user/tag/", data={"tag": "tag0"}, format="json")
        data = res.data

        # then
        assert res.status_code == status.HTTP_201_CREATED
        assert data["created"] is True
        assert data["tag"] == "tag0"

    def test_put_created_false(self):
        # when
        _ = self.client_0.put("/api/user/tag/", data={"tag": "tag0"}, format="json")
        res = self.client_0.put("/api/user/tag/", data={"tag": "tag0"}, format="json")

        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert data["created"] is False
        assert data["tag"] == "tag0"

    def test_get_tag(self):
        # given
        _ = self.client_0.put("/api/user/tag/", data={"tag": "tag0"}, format="json")

        # when
        res = self.client_0.get("/api/user/tag/")
        data = res.data["results"]

        # then

        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1

    @patch("celery.app.task.Task.delay")
    def test_recommend(self, celery_task):
        # given
        _ = self.client_0.put("/api/user/tag/", data={"tag": "tag0"}, format="json")
        _ = self.client_0.put("/api/user/tag/", data={"tag": "tag1"}, format="json")

        # when
        res = self.client_0.get("/api/user/recommend/")
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        celery_task.assert_called_once()
