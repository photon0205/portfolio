from django.urls import path
from .views import csrf_view, PreviewView, ApplyView

urlpatterns = [
    path('csrf/', csrf_view, name='sync-csrf'),
    path('preview/', PreviewView.as_view(), name='sync-preview'),
    path('apply/', ApplyView.as_view(), name='sync-apply'),
]