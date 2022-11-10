from django.contrib.auth import login, authenticate, logout
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from user.models import WatchLend
from user.serializers import UserSerializer


# Create your views here.


class UserViewSet(viewsets.GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated(),)

    def get_permissions(self):
        if self.action in ("create", "login"):
            return (AllowAny(),)
        return self.permission_classes

    # POST /api/user/
    def create(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, password=password)
        except IntegrityError:
            return Response(
                {"error": "User with that username already exists."},
                status=status.HTTP_409_CONFLICT,
            )

        login(request, user)
        data = self.get_serializer(user).data
        Token.objects.create(user=user)
        data["token"] = user.auth_token.key
        return Response(data, status=status.HTTP_201_CREATED)

    # POST /api/user/login/
    @action(detail=False, methods=["POST"])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            data = self.get_serializer(user).data
            token, created = Token.objects.get_or_create(user=user)
            data["token"] = token.key
            return Response(data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    # PUT /api/user/logout/
    @action(detail=False, methods=["PUT"])
    def logout(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # GET /api/user/watch/
    @action(detail=False)
    def watch(self, request):
        from book.serializers.lend_info_serializers import LendInfoSerializer

        data = LendInfoSerializer(request.user.watching_lends, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    # PUT /api/user/watch/
    @watch.mapping.put
    def put_watch(self, request):
        from book.models.lend_info import LendInfo
        from book.serializers.lend_info_serializers import LendInfoSerializer

        lend_id = request.data.get("lend_id")
        if not lend_id:
            return Response(
                {"error": "give lend_id"}, status=status.HTTP_400_BAD_REQUEST
            )

        lend_info = get_object_or_404(LendInfo, id=lend_id)
        watch_lend, created = WatchLend.objects.get_or_create(
            watching_lend=lend_info, watcher=request.user
        )

        lend_data = LendInfoSerializer(lend_info).data.copy()

        if created:
            return Response(
                {"created": True, "lend_info": lend_data},
                status=status.HTTP_201_CREATED,
            )
        else:
            watch_lend.delete()
            return Response(
                {"created": False, "lend_info": lend_data},
                status=status.HTTP_200_OK,
            )

    # GET /api/user/tag/
    @action(detail=False)
    def tag(self, request):
        data = []
        for tag in request.user.subscribed_tags.all():
            data.append(tag.name)

        return Response(data, status=status.HTTP_200_OK)

    # PUT /api/user/tag/
    @tag.mapping.put
    def put_tag(self, request):
        from book.models.book import Tag
        from user.models import SubscribeTag

        tag_name = request.data.get("tag")

        if not tag_name:
            return Response({"error": "give tag"}, status=status.HTTP_400_BAD_REQUEST)

        tag = get_object_or_404(Tag, name=tag_name)
        subscribe_tag, created = SubscribeTag.objects.get_or_create(
            user=request.user, tag=tag
        )

        if created:
            return Response(
                {"created": True, "tag": tag_name}, status=status.HTTP_201_CREATED
            )
        else:
            subscribe_tag.delete()
            return Response(
                {"created": False, "tag": tag_name}, status=status.HTTP_200_OK
            )

    # GET /api/user/recommend/
    @action(detail=False)
    def recommend(self, request):
        from book.models.book import Book

        subscribed_tags = [
            subscribed_tag.tag.name for subscribed_tag in request.user.usertag.all()
        ]

        recommend_ids_list = recommend_with_tags(subscribed_tags)

        books = Book.objects.filter(pk__in=recommend_ids_list)
        data = [{"id": book.id, "title": book.title} for book in books]

        return Response(data, status=status.HTTP_200_OK)


def recommend_with_tags(subscribed_tags):
    import pandas as pd
    from book.models.book import Book, Tag, BookTag
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel

    book_tags = pd.DataFrame(list(BookTag.objects.all().values()))
    tags = pd.DataFrame(list(Tag.objects.all().values()))
    books = pd.DataFrame(list(Book.objects.all().values()))

    book_tags_df = pd.merge(
        book_tags, tags, left_on="tag_id", right_on="id", how="inner"
    )[["book_id", "name"]]
    book_tags_df = book_tags_df.groupby("book_id")["name"].apply(" ".join).reset_index()
    books = books.loc[:, books.columns != "brief"]
    books = pd.merge(books, book_tags_df, left_on="id", right_on="book_id", how="inner")

    books = books.append(
        {"id": 0, "name": " ".join(subscribed_tags)}, ignore_index=True
    )

    tf = TfidfVectorizer(
        analyzer="word", ngram_range=(1, 2), min_df=0, stop_words="english"
    )
    tfidf_matrix = tf.fit_transform(books["name"])
    cosine_similarity = linear_kernel(tfidf_matrix, tfidf_matrix)

    idx = len(books.index) - 1
    scores = list(enumerate(cosine_similarity[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    scores = scores[0:10]  # return 10 books
    indices = [i[0] for i in scores]
    result = books.iloc[indices]["id"]

    return result.values.tolist()
