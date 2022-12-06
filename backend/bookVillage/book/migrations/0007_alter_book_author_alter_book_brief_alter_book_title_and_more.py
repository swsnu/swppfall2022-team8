# Generated by Django 4.1.2 on 2022-12-06 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("book", "0006_booktagconcat_alter_book_author_alter_book_brief_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="book",
            name="author",
            field=models.CharField(max_length=800),
        ),
        migrations.AlterField(
            model_name="book",                                                                                   
            name="brief",                                                                                        
            field=models.CharField(blank=True, default="정보 없음", max_length=400),                             
        ),                                                                                                       
        migrations.AlterField(                                                                                   
            model_name="book",                                                                                   
            name="title",                                                                                        
            field=models.CharField(db_index=True, max_length=400),                                               
        ),                                                                                                       
        migrations.AlterField(                                                                                   
            model_name="tag",                                                                                    
            name="name",                                                                                         
            field=models.CharField(db_index=True, max_length=400),
        ),
    ]