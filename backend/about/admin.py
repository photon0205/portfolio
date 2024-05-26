from django.contrib import admin
from .models import AboutMe, SocialMediaLink, ContactInquiry
from ckeditor.widgets import CKEditorWidget
from django import forms

class AboutMeAdminForm(forms.ModelForm):
    summary = forms.CharField(widget=CKEditorWidget())

    class Meta:
        model = AboutMe
        fields = '__all__'

class AboutMeAdmin(admin.ModelAdmin):
    form = AboutMeAdminForm

admin.site.register(AboutMe, AboutMeAdmin)
admin.site.register(SocialMediaLink)


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "category", "date_sent")
    list_filter = ("category", "date_sent")
    search_fields = ("name", "email", "message")
