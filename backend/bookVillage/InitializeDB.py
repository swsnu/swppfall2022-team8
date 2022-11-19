import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bookVillage.settings")
application = get_wsgi_application()

import numpy as np
import pandas as pd

# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import linear_kernel

books = pd.read_csv("./bookDatas/books.csv", encoding="ISO-8859-1")
book_tags = pd.read_csv("./bookDatas/book_tags.csv", encoding="ISO-8859-1")
tags = pd.read_csv("./bookDatas/tags.csv")

from book.models.book import BookImage, Tag, Book, BookTag
from django.contrib.auth.models import User
from book.models.lend_info import LendInfo

# Please flush DB first by command
# python manage.py flush

# Tag.objects.all().delete()
# BookTag.objects.all().delete()
# User.objects.all().delete()
# Book.objects.all().delete()
# LendInfo.objects.all().delete()

for i in range(len(tags)):
    tag = Tag(id=tags["tag_id"][i], name=tags["tag_name"][i])
    tag.save()
    print(tag.name)

user = User.objects.create_user(username="MockUser", password="password")
user.save()

from io import BytesIO
import requests
from django.core.files import File
from urllib.parse import urlparse


def download(url):
    response = requests.get(url)
    binary_data = response.content
    temp_file = BytesIO()
    temp_file.write(binary_data)
    temp_file.seek(0)
    return temp_file


for i in range(len(books)):
    book = Book(
        id=books["book_id"][i],
        title=books["title"][i],
        author=books["authors"][i],
        brief=books["original_title"][i],
    )
    book.save()

    current_tags_list = book_tags[book_tags["goodreads_book_id"] == books["book_id"][i]]
    for tag_id in current_tags_list["tag_id"]:
        tag, created = Tag.objects.get_or_create(id=tag_id)
        BookTag.objects.create(book=book, tag=tag)

    image_url = books["image_url"][i]
    temp_file = download(image_url)
    bookimage = BookImage.objects.create(book=book)
    file_name = "{urlparse}.{ext}".format(
        urlparse=urlparse(image_url).path.split("/")[-1].split(".")[0],
        ext=urlparse(image_url).path.split("/")[-1].split(".")[1],
    )
    bookimage.image.save(file_name, File(temp_file))

    lend = LendInfo(
        book=book, owner=user, cost=1000, additional="DEFAULT", questions=["Default"]
    )
    lend.save()
    print(str(lend.id) + "/10000")

# Book info : title, author, tag, brief
