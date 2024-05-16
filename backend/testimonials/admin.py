from django.contrib import admin
from .models import Testimonial


class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("author", "company", "service_provided", "date_created")


admin.site.register(Testimonial, TestimonialAdmin)
