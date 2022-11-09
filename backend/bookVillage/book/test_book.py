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

        # then
        assert res.status_code == status.HTTP_200_OK
        assert len(data) == 1
        assert data[0]["id"] == self.book_0.id

    def test_서버에_존재_하는_태그만_가진_책_생성(self):
        # given
        body = {"title": "c", "author": "c", "tags": ["tag0"], "brief": "c"}
        # when
        res = self.client.post("/api/book/", data=body, format="json")

        # then
        assert res.status_code == status.HTTP_201_CREATED
        assert Book.objects.all().count() == 3
        assert Tag.objects.all().count() == 2
        assert res.data["tags"] == ["tag0"]

    def test_서버에_존재_하지_않는_태그를_가진_책_생성(self):
        # given
        body = {"title": "c", "author": "c", "tags": ["tag0", "tag2"], "brief": "c"}

        # when
        res = self.client.post("/api/book/", data=body, format="json")

        # then
        assert res.status_code == status.HTTP_201_CREATED
        assert Book.objects.all().count() == 3
        assert Tag.objects.all().count() == 3
        assert res.data["tags"] == ["tag0", "tag2"]

    def test_tags_typo(self):
        # given
        body = {"title": "c", "author": "c", "tags": "tag0", "brief": "c"}

        # when
        res = self.client.post("/api/book/", data=body, format="json")

        # then
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_retrieve_성공(self):
        # when
        res = self.client.get(f"/api/book/{self.book_0.id}/")

        # then
        assert res.status_code == status.HTTP_200_OK
        assert res.data["title"] == "book0"

    def test_retrieve_실패(self):
        # when
        res = self.client.get("/api/book/0/")

        # then
        assert res.status_code == status.HTTP_404_NOT_FOUND

    def test_put_pk_실패(self):
        # given
        body = {"title": "c"}
        # when
        res = self.client.put("/api/book/0/", data=body, format="json")

        # then
        assert res.status_code == status.HTTP_404_NOT_FOUND

    def test_put_성공(self):
        # given
        body = {"title": "c", "tags": ["tag0", "tag1"]}

        # when
        res = self.client.put(f"/api/book/{self.book_0.id}/", data=body, format="json")

        # then
        assert res.status_code == status.HTTP_200_OK
        assert Book.objects.all().count() == 2
        assert BookTag.objects.all().count() == 3
        assert Book.objects.get(id=self.book_0.id).title == "c"

    def test_put_성공_태그_없음(self):
        # given
        body = {"title": "c"}

        # when
        res = self.client.put(f"/api/book/{self.book_0.id}/", data=body, format="json")

        # then
        assert res.status_code == status.HTTP_200_OK
        assert Book.objects.all().count() == 2
        assert Book.objects.get(id=self.book_0.id).title == "c"

    def test_put_태그_초기화(self):
        # given
        body = {"title": "c", "tags": []}

        # when
        res = self.client.put(f"/api/book/{self.book_0.id}/", data=body, format="json")
        book = Book.objects.get(id=self.book_0.id)

        # then
        assert res.status_code == status.HTTP_200_OK
        assert Book.objects.all().count() == 2
        assert BookTag.objects.all().count() == 1
        assert book.title == "c"
        assert book.tags.count() == 0

    def test_delete_성공(self):
        # when
        res = self.client.delete(f"/api/book/{self.book_0.id}/")

        # then
        assert res.status_code == status.HTTP_204_NO_CONTENT
        assert Book.objects.all().count() == 1
        assert BookTag.objects.all().count() == 1
        assert Tag.objects.all().count() == 2

    def test_delete_pk_이상(self):
        # when
        res = self.client.delete(f"/api/book/0/")

        # then
        assert res.status_code == status.HTTP_404_NOT_FOUND
        assert Book.objects.all().count() == 2
