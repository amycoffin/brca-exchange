# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2018-02-16 17:31 and edited by zack fischmann


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0025_auto_20180116_1508'),
    ]

    operations = [
        # Reports may be added to the database even if they're identical
        # to existing reports, hence the need for the 'none' changetype
        migrations.RunSQL(
            """
            INSERT INTO data_changetype VALUES (7, 'none'); 
            """
        ),
        migrations.AddField(
            model_name='report',
            name='Change_Type',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.CASCADE, to='data.ChangeType'),
            preserve_default=False,
        ),
    ]
