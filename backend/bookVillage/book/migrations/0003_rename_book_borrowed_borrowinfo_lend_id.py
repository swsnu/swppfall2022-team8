# Generated by Django 4.1.2 on 2022-10-23 10:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0002_alter_lendinfo_questions'),
    ]

    operations = [
        migrations.RenameField(
            model_name='borrowinfo',
            old_name='book_borrowed',
            new_name='lend_id',
        ),
    ]