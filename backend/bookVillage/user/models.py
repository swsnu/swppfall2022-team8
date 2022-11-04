from django.db import models
from django.contrib.auth.models import User
from book.models.lend_info import LendInfo
from book.models.book import Tag


class WatchLend(models.Model):
    watching_lend = models.ForeignKey(
        LendInfo, on_delete=models.CASCADE, related_name="watches_watch_lend"
    )
    watcher = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="watching_watch_lend"
    )


class SubscribeTag(models.Model):
    user = models.ForeignKey(User, related_name="usertag", on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, related_name="usertag", on_delete=models.CASCADE)
