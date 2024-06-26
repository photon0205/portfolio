from django.db import models

class ContributionType(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class OpenSourceProject(models.Model):
    name = models.CharField(max_length=100)
    caption = models.CharField(max_length=150, default="Open Source Project")
    image = models.ImageField(upload_to="open_source_project_images/", blank=True)
    repo_link = models.URLField()

    def __str__(self):
        return self.name

class OpenSourceContribution(models.Model):
    open_source_project = models.ForeignKey(OpenSourceProject, related_name='contributions', on_delete=models.CASCADE)
    description = models.TextField()
    contribution_type = models.ForeignKey(ContributionType, on_delete=models.CASCADE)
    pr_link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.contribution_type} to {self.open_source_project.name}"