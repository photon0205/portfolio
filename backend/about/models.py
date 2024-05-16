from django.db import models
from projects.models import Category

class AboutMe(models.Model):
    name = models.CharField(max_length=100)
    summary = models.TextField()
    profile_picture = models.ImageField(upload_to="about_me/profile_pictures/", blank=True)
    resume = models.FileField(upload_to="about_me/resumes/", blank=True)

    def __str__(self):
        return "About Me"

    class Meta:
        verbose_name = "About Me"
        verbose_name_plural = "About Me"


class ContactInquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    date_sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Contact Inquiry"
        verbose_name_plural = "Contact Inquiries"
