# Generated by Django 4.1.2 on 2022-11-04 08:17

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("book", "0006_remove_usertag_tag_remove_usertag_user"),
        ("user", "0002_subscribetag"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tag",
            name="users_subscribed",
            field=models.ManyToManyField(
                related_name="subscribed_tags",
                through="user.SubscribeTag",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.DeleteModel(
            name="UserTag",
        ),
    ]
