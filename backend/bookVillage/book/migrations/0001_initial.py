# Generated by Django 4.1.2 on 2022-11-22 08:42

import book.models.book
import book.models.lend_info
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Book",
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
                ("title", models.CharField(max_length=200)),
                ("author", models.CharField(max_length=200)),
                (
                    "brief",
                    models.CharField(blank=True, default="정보 없음", max_length=200),
                ),
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        null=True,
                        upload_to=book.models.book.book_image_upload_to,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="BookTag",
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
            ],
        ),
        migrations.CreateModel(
            name="BorrowInfo",
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
                ("active", models.BooleanField(default=True)),
                ("lend_start_time", models.DateTimeField(auto_now_add=True)),
                ("lend_end_time", models.DateTimeField(default=None, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="LendImage",
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
                (
                    "image",
                    models.ImageField(
                        upload_to=book.models.lend_info.lend_image_upload_to
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="LendInfo",
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
                ("questions", models.JSONField(blank=True, default=list)),
                ("cost", models.PositiveIntegerField()),
                (
                    "additional",
                    models.CharField(blank=True, default="", max_length=600),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Tag",
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
                ("name", models.CharField(max_length=100)),
            ],
        ),
    ]
