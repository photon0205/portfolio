# Generated by Django 5.0.6 on 2024-05-15 22:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ContributionType",
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
                ("slug", models.SlugField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name="OpenSourceProject",
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
                ("repo_link", models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name="OpenSourceContribution",
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
                ("start_date", models.DateField()),
                ("end_date", models.DateField(blank=True, null=True)),
                ("description", models.TextField()),
                ("issue", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "contribution_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="opensource.contributiontype",
                    ),
                ),
                (
                    "open_source_project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="opensource.opensourceproject",
                    ),
                ),
            ],
        ),
    ]