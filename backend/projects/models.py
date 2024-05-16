from django.db import models

class CodingSkill(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to="coding_skill_logos/", blank=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

class Project(models.Model):
    title = models.CharField(max_length=100)
    caption = models.CharField(max_length=150)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    organisation = models.CharField(max_length=100, blank=True)
    skills_used = models.ManyToManyField(CodingSkill, blank=True)
    github_link = models.URLField(blank=True)
    live_demo_link = models.URLField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title

class ProjectImage(models.Model):
    CATEGORY_CHOICES = [
        ("Overview", "Overview"),
        ("Description", "Description"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="project_images/")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f"{self.project.title} Image ({self.category})"
