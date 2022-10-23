from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class UserSerializer(serializers.ModelSerializer):

    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "password",
        )
