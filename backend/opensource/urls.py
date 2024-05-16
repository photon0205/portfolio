# opensource/urls.py
from django.urls import path
from .views import OpenSourceProjectAPIView, OpenSourceContributionAPIView

urlpatterns = [
    path('projects/', OpenSourceProjectAPIView.as_view(), name='open-source-projects'),
    path('contributions/', OpenSourceContributionAPIView.as_view(), name='open-source-contributions'),
]
