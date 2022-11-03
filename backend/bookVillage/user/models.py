from django.db import models
from django.contrib.auth.models import User
from book.models.lend_info import LendInfo


class WatchLend(models.Model):
    watching_lend = models.ForeignKey(
        LendInfo, on_delete=models.CASCADE, related_name="watches_watch_lend"
    )
    watcher = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="watching_watch_lend"
    )
