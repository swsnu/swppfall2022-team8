# Generated by Django 4.1.2 on 2022-10-23 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lendinfo',
            name='questions',
            field=models.JSONField(blank=True, default='[]'),
        ),
    ]
