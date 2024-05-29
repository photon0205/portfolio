# Generated by Django 5.0.6 on 2024-05-28 23:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("opensource", "0004_alter_opensourceprojectimage_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="opensourceproject",
            name="image",
            field=models.ImageField(
                blank=True, upload_to="open_source_project_images/"
            ),
        ),
        migrations.DeleteModel(name="OpenSourceProjectImage",),
    ]
