from django.db import models
from django.contrib.auth.models import User
import json

class Tag(models.Model):
    name = models.CharField(max_length=100)
    users_subscribed = models.ManyToManyField(User, through="user.SubscribeTag", related_name="subscribed_tags")


class Book(models.Model):
    title = models.CharField(max_length=200, blank=False, null=False)
    author = models.CharField(max_length=200, blank=False, null=False)
    tags = models.ManyToManyField(Tag, through="BookTag", related_name="books")
    brief = models.CharField(max_length=200, blank=True, null=False, default="정보 없음")


class BookTag(models.Model):
    book = models.ForeignKey(Book, related_name="booktag", on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, related_name="booktag", on_delete=models.CASCADE)
