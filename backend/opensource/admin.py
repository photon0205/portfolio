from django.contrib import admin
from .models import ContributionType, OpenSourceProject, OpenSourceContribution


class ContributionTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


class OpenSourceProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "repo_link")


class OpenSourceContributionAdmin(admin.ModelAdmin):
    list_display = (
        "open_source_project",
        "contribution_type",
        "pr_link",
    )


admin.site.register(ContributionType, ContributionTypeAdmin)
admin.site.register(OpenSourceProject, OpenSourceProjectAdmin)
admin.site.register(OpenSourceContribution, OpenSourceContributionAdmin)
