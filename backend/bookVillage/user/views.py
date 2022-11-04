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
            return Response(data)
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

        lend_id = request.data.get("lend_id")
        if not lend_id:
            return Response(
                {"error": "give lend_id"}, status=status.HTTP_400_BAD_REQUEST
            )

        lend_info = get_object_or_404(LendInfo, id=lend_id)
        watch_lend, created = WatchLend.objects.get_or_create(
            watching_lend=lend_info, watcher=request.user
        )

        if created:
            return Response({"created": True}, status=status.HTTP_201_CREATED)
        else:
            watch_lend.delete()
            return Response({"created": False}, status=status.HTTP_204_NO_CONTENT)

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
                {"created": False, "tag": tag_name}, status=status.HTTP_204_NO_CONTENT
            )
