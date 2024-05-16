from django.contrib import admin
from .models import DescriptionPoint, WorkExperience


class DescriptionPointAdmin(admin.ModelAdmin):
    list_display = ("point",)


class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "location", "start_date", "end_date")


admin.site.register(DescriptionPoint, DescriptionPointAdmin)
admin.site.register(WorkExperience, WorkExperienceAdmin)
