from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/projects/", include("projects.urls")),
    path("api/experiences/", include("experiences.urls")),
    path("api/opensource/", include("opensource.urls")),
    path("api/testimonials/", include("testimonials.urls")),
    path("api/about/", include("about.urls")),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

