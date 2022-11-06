from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from book.models.book import Book, Tag, BookTag
from django.contrib.auth.models import User


class BookTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="a", password="a")
        cls.tag_0 = Tag.objects.create(name="tag0")
        cls.tag_1 = Tag.objects.create(name="tag1")
        cls.book_0 = Book.objects.create(title="book0", author="aa")
        cls.book_1 = Book.objects.create(title="book1", author="bb")
        BookTag.objects.create(tag=cls.tag_0, book=cls.book_0)
        BookTag.objects.create(tag=cls.tag_1, book=cls.book_1)

    def setUp(self) -> None:
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_list(self):
        # when
        res = self.client.get("/api/book/")
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 2

    def test_list_query_title_부분문자열(self):
        # when
        res = self.client.get("/api/book/?title=0")
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1
        assert data[0]["id"] == self.book_0.id

    def test_list_query_author_부분문자열(self):
        # when
        res = self.client.get("/api/book/?author=b")
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1
        assert data[0]["id"] == self.book_1.id

    def test_list_query_tag_부분문자열_실패(self):
        # when
        res = self.client.get("/api/book/?tag[]=0")
        data = res.data

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 0

    def test_list_query_tag_성공(self):
        # when
        res = self.client.get("/api/book/?tag[]=tag0")
        data = res.data

        #then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1
        assert data[0]["id"] == self.book_0.id