# Generated by Django 4.1.2 on 2022-12-06 10:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("book", "0005_alter_book_author"),
    ]

    operations = [
        migrations.CreateModel(
            name="BookTagConcat",
            fields=[
                (
                    "book",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="tagconcat",
                        serialize=False,                                                                                         
                        to="book.book",                                                                                          
                    ),                                                                                                           
                ),                                                                                                               
                ("tag_concat", models.TextField(default=" ")),
            ],
        ),
        migrations.AlterField(
            model_name="book",
            name="author",
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name="book",
            name="brief",
            field=models.CharField(blank=True, default="정보 없음", max_length=200),
        ),
        migrations.AlterField(
            model_name="book",
            name="title",
            field=models.CharField(db_index=True, max_length=200),
        ),
        migrations.AlterField(
            model_name="tag",
            name="name",
            field=models.CharField(db_index=True, max_length=100),
        ),                                                                                                                       
    ]                                     