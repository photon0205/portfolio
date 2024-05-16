from django.contrib import admin
from .models import AboutMe, ContactInquiry

@admin.register(AboutMe)
class AboutMeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "category", "date_sent")
    list_filter = ("category", "date_sent")
    search_fields = ("name", "email", "message")
