from django.db import models
from django.contrib.auth.models import User
from book.models.lend_info import LendInfo


class BorrowInfo(models.Model):
    borrower = models.ForeignKey(
        User, related_name="borrow_history", on_delete=models.CASCADE
    )
    lend_id = models.ForeignKey(
        LendInfo, related_name="history", on_delete=models.CASCADE
    )
    active = models.BooleanField(default=True)
    lend_start_time = models.DateTimeField(auto_now_add=True)
    lend_end_time = models.DateTimeField(default=None, null=True)

    def is_accesible(self, user):
        return self.borrower == user or self.lend_id.owner == user
