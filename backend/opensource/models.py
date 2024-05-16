from django.db import models

class ContributionType(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class OpenSourceProject(models.Model):
    name = models.CharField(max_length=100)
    repo_link = models.URLField()

    def __str__(self):
        return self.name


class OpenSourceContribution(models.Model):
    open_source_project = models.ForeignKey(OpenSourceProject, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField()
    contribution_type = models.ForeignKey(ContributionType, on_delete=models.CASCADE)
    issue = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.contribution_type} to {self.open_source_project.name}"