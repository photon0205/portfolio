from django.db import models
from projects.models import Category

class Testimonial(models.Model):
    author = models.CharField(max_length=100)
    author_image = models.ImageField(upload_to="testimonial_images/")
    company = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    service_provided = models.ForeignKey(Category, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author
