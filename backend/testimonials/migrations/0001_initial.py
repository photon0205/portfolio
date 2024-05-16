# Generated by Django 5.0.6 on 2024-05-15 22:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("projects", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Testimonial",
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
                ("author", models.CharField(max_length=100)),
                ("author_image", models.ImageField(upload_to="testimonial_images/")),
                ("company", models.CharField(blank=True, max_length=100)),
                ("content", models.TextField()),
                ("date_created", models.DateTimeField(auto_now_add=True)),
                (
                    "service_provided",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="projects.category",
                    ),
                ),
            ],
        ),
    ]