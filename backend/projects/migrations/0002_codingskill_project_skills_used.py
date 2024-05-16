# Generated by Django 5.0.6 on 2024-05-15 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="CodingSkill",
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
                (
                    "logo",
                    models.ImageField(blank=True, upload_to="coding_skill_logos/"),
                ),
            ],
        ),
        migrations.AddField(
            model_name="project",
            name="skills_used",
            field=models.ManyToManyField(blank=True, to="projects.codingskill"),
        ),
    ]
