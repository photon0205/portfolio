# Generated by Django 5.0.6 on 2024-05-28 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("experiences", "0002_alter_workexperience_location"),
        ("projects", "0003_alter_category_options"),
    ]

    operations = [
        migrations.AddField(
            model_name="workexperience",
            name="skills_used",
            field=models.ManyToManyField(blank=True, to="projects.codingskill"),
        ),
    ]
