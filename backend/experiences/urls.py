# experiences/urls.py
from django.urls import path
from .views import WorkExperienceAPIView

urlpatterns = [
    path('', WorkExperienceAPIView.as_view(), name='work-experiences'),
]
