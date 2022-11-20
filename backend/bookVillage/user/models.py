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


class UserRecommend(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="recommend", primary_key=True
    )
    list = models.JSONField(default=list, blank=True)
    current_version = models.IntegerField(default=0)
    target_version = models.IntegerField(default=0)
    queued_version = models.IntegerField(default=0)

    def target_update(self):
        self.target_version = self.target_version + 1
        self.save()

    def enqueue(self):
        self.queued_version = self.target_version
        self.save()

    def dequeue(self):
        self.queued_version = 0
        self.save()

    def update(self, book_ids):
        if self.is_queued:
            self.current_version = self.queued_version
            self.queued_version = 0
            self.list = book_ids
            self.save()

    @property
    def is_outdated(self):
        return self.current_version != self.target_version

    @property
    def is_queued(self):
        return self.queued_version > 0

    @property
    def is_queueable(self):
        return self.is_outdated and not self.is_queued
