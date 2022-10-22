from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):
    title = models.CharField(max_length=200, blank=False, null=False)
    author = models.CharField(max_length=200, blank=False, null=False)
    tag = models.CharField(max_length=200, blank=True, null=False, default="")
    brief = models.CharField(max_length=200, blank=True, null=False, default="정보 없음")


# Create your models here.
