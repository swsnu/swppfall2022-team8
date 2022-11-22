from django.contrib.auth import login, authenticate, logout
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from user.models import WatchLend, UserRecommend
from user.serializers import UserSerializer
from user.tasks import recommend_with_tags


# Create your views here.


class UserPageNumberPagination(PageNumberPagination):
    page_size = 12


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
        UserRecommend.objects.create(user=user)
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
            if not hasattr(user, "recommend"):
                UserRecommend.objects.create(user=user)
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
        user = request.user

        if not tag_name:
            return Response({"error": "give tag"}, status=status.HTTP_400_BAD_REQUEST)

        tag = get_object_or_404(Tag, name=tag_name)
        subscribe_tag, created = SubscribeTag.objects.get_or_create(user=user, tag=tag)

        user.recommend.target_update()

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
        recommend = request.user.recommend
        enqueued = False
        if recommend.is_queueable:
            self._recommend(request.user)
            recommend.enqueue()
            enqueued = True

        return Response(
            {
                "is_queued": recommend.is_queued,
                "is_outdated": recommend.is_outdated,
                "enqueued": enqueued,
                "recommend_list": self._parse_recommend_list(recommend.list),
            },
            status=status.HTTP_200_OK,
        )

    # POST /api/user/recommend/
    @recommend.mapping.post
    def post_recommend(self, request):
        self._recommend(request.user)
        request.user.recommend.enqueue()
        return Response({"enqueued": True}, status=status.HTTP_200_OK)

    @recommend.mapping.put
    def put_recommend(self, request):
        recommend = request.user.recommend
        enqueued = False
        if recommend.is_queueable:
            self._recommend(request.user)
            recommend.enqueue()
            enqueued = True
        return Response({"enqueued": enqueued}, status=status.HTTP_200_OK)

    @staticmethod
    def _recommend(user):
        subscribed_tags = [
            subscribed_tag.tag.name for subscribed_tag in user.usertag.all()
        ]
        recommend_with_tags.delay(subscribed_tags, user.id)

    @staticmethod
    def _parse_recommend_list(recommend_list):
        from book.models.book import Book
        from book.serializers.book_serializers import BookSerializer

        book_lists = [get_object_or_404(Book, id=book_id) for book_id in recommend_list]
        return BookSerializer(book_lists, many=True).data
