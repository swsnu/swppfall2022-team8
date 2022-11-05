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
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    content = models.TextField()
    author = models.ForeignKey(
        User, related_name="author_messages", on_delete=models.CASCADE
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.username

    def last_10_messages(self, room_id):
        return Message.objects.filter(room_id=room_id).order_by("-created_at")[:10]
