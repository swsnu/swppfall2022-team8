from django.db import models
from django.contrib.auth.models import User
from book.models.book import Book


class LendInfo(models.Model):
    book = models.ForeignKey(Book, related_name="lend_info", on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name="lend_info", on_delete=models.CASCADE)
    questions = models.CharField(max_length=600, blank=True, default="")
    cost = models.PositiveIntegerField(blank=False, null=False)
    additional = models.CharField(max_length=600, blank=True, default="")
