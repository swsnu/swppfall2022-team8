from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from book.models.book import Book


class LendInfo(models.Model):
    book = models.ForeignKey(Book, related_name="lend_infos", on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name="lend_infos", on_delete=models.CASCADE)
    questions = models.JSONField(blank=True, default=list)
    cost = models.PositiveIntegerField(blank=False, null=False)
    additional = models.CharField(max_length=600, blank=True, default="")
    watchers = models.ManyToManyField(
        User, through="user.WatchLend", related_name="watching_lends"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def current_borrow(self):
        history = self.history.all()
        for borrow_info in history:
            if borrow_info.active:
                return borrow_info
        return None
