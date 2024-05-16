from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("projects/", include("projects.urls")),
    path("experiences/", include("experiences.urls")),
    path("opensource/", include("opensource.urls")),
    path("testimonials/", include("testimonials.urls")),
    path("about/", include("about.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
