from django.db import models


class DescriptionPoint(models.Model):
    point = models.TextField()

    def __str__(self):
        return self.point[:50] + "..." if len(self.point) > 50 else self.point


class WorkExperience(models.Model):
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.ManyToManyField(
        "DescriptionPoint", related_name="work_experiences"
    )

    def __str__(self):
        return f"{self.title} at {self.company}"
