from django.contrib.auth import login, authenticate
from django.shortcuts import render
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

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
