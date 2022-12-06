from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    name = models.CharField(max_length=400, db_index=True)
    users_subscribed = models.ManyToManyField(
        User, through="user.SubscribeTag", related_name="subscribed_tags"
    )


def book_image_upload_to(instance, filename):
    return f"{instance.id}/book_{filename}"


class Book(models.Model):
    title = models.CharField(max_length=400, blank=False, null=False, db_index=True)
    author = models.CharField(max_length=800, blank=False, null=False)
    tags = models.ManyToManyField(Tag, through="BookTag", related_name="books")
    brief = models.CharField(max_length=400, blank=True, null=False, default="정보 없음")
    image = models.ImageField(upload_to=book_image_upload_to, blank=True, null=True)

    def create_tag_concat(self, tag_names):
        if hasattr(self, "tagconcat"):
            self.tagconcat.delete()
        concat = " ".join(tag_names)
        tag_concat = BookTagConcat.objects.create(book=self, tag_concat=concat)
        return tag_concat


class BookTag(models.Model):
    book = models.ForeignKey(Book, related_name="booktag", on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, related_name="booktag", on_delete=models.CASCADE)


class BookTagConcat(models.Model):
    book = models.OneToOneField(
        Book, on_delete=models.CASCADE, related_name="tagconcat", primary_key=True
    )
    tag_concat = models.TextField(blank=False, null=False, default=" ")