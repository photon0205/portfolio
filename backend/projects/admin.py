from django.contrib import admin
from .models import CodingSkill, Category, Project, ProjectImage

class CodingSkillAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}

class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ("project", "image", "category")

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "caption", "category", "organisation")
    list_filter = ("category", "organisation", "skills_used")
    search_fields = ("title", "caption", "description", "organisation", "skills_used")

admin.site.register(CodingSkill, CodingSkillAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(ProjectImage, ProjectImageAdmin)
