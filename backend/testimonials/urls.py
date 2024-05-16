from django.urls import path
from .views import TestimonialAPIView

urlpatterns = [
    path('', TestimonialAPIView.as_view(), name='testimonials'),
]
