# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-08 09:58


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_myuser_has_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='myuser',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
