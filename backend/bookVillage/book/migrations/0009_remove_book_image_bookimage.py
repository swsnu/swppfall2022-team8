# Generated by Django 4.1.2 on 2022-11-18 12:14

import book.models.book
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("book", "0008_book_image"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="book",
            name="image",
        ),
        migrations.CreateModel(
            name="BookImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to=book.models.book.upload_to)),
                (
                    "book",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="bookimage",
                        to="book.book",
                    ),
                ),
            ],
        ),
    ]