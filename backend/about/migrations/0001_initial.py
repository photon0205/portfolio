# Generated by Django 5.0.6 on 2024-05-15 23:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("projects", "0002_codingskill_project_skills_used"),
    ]

    operations = [
        migrations.CreateModel(
            name="AboutMe",
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
                ("name", models.CharField(max_length=100)),
                ("summary", models.TextField()),
                (
                    "profile_picture",
                    models.ImageField(
                        blank=True, upload_to="about_me/profile_pictures/"
                    ),
                ),
                ("resume", models.FileField(blank=True, upload_to="about_me/resumes/")),
            ],
        ),
        migrations.CreateModel(
            name="ContactInquiry",
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
                ("name", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=254)),
                ("message", models.TextField()),
                ("date_sent", models.DateTimeField(auto_now_add=True)),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="projects.category",
                    ),
                ),
            ],
        ),
    ]
