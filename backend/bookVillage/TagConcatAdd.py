import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bookVillage.settings")
application = get_wsgi_application()

from book.models.book import Book

books = Book.objects.all().prefetch_related("tags")
count = Book.objects.all().count()
i = 1

for book in books:
    tags = book.tags
    tag_names = []
    for tag in tags.all():
        tag_names.append(tag.name)
    book.create_tag_concat(tag_names)
    print(f"{i}/{count}")
    i = i + 1
