from django.db import models
from django.contrib.auth.models import User
from book.models.lend_info import LendInfo


class Room(models.Model):
    lend_id = models.ForeignKey(
        LendInfo, on_delete=models.CASCADE, related_name="rooms"
    )
    lender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="rooms_lend"
    )
    borrower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="rooms_borrow"
    )
    answers = models.JSONField(blank=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    content = models.TextField()
    author = models.ForeignKey(
        User, related_name="author_messages", on_delete=models.CASCADE
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages")
    rank = models.CharField(max_length=8, default="chat")
    created_at = models.DateTimeField(auto_now_add=True)
