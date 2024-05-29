# Generated by Django 5.0.6 on 2024-05-28 22:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("opensource", "0002_remove_opensourcecontribution_end_date_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="OpenSourceProjectImage",
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
                ("image", models.ImageField(upload_to="project_images/")),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="opensource.opensourceproject",
                    ),
                ),
            ],
        ),
    ]
