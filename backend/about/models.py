from django.db import models
from projects.models import Category


class SocialMediaLink(models.Model):
    about_me = models.ForeignKey(
        "AboutMe", related_name="social_links", on_delete=models.CASCADE
    )
    platform = models.CharField(max_length=100)
    url = models.URLField(max_length=200)

    def __str__(self):
        return f"{self.platform}: {self.url}"


from django.db import models
from ckeditor.fields import RichTextField


class SocialMediaLink(models.Model):
    about_me = models.ForeignKey(
        "AboutMe", related_name="social_links", on_delete=models.CASCADE
    )
    platform = models.CharField(max_length=100)
    url = models.URLField(max_length=200)

    def __str__(self):
        return f"{self.platform}: {self.url}"


class AboutMe(models.Model):
    name = models.CharField(max_length=100)
    summary = RichTextField()
    subtitle = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="about_me/profile_pictures/", blank=True
    )
    resume = models.FileField(upload_to="about_me/resumes/", blank=True)
    avatar = models.ImageField(upload_to="about_me/avatars/", blank=True)

    def __str__(self):
        return self.name

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
