# Generated by Django 5.0.6 on 2024-05-29 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("about", "0005_aboutme_subtitle"),
    ]

    operations = [
        migrations.AddField(
            model_name="aboutme",
            name="email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
