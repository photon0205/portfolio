# Generated by Django 5.0.6 on 2024-05-30 03:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("about", "0007_alter_contactinquiry_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="aboutme",
            name="current_role",
            field=models.CharField(default="Software Developer", max_length=100),
        ),
    ]
