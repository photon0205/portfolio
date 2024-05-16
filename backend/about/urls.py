# about/urls.py
from django.urls import path
from .views import AboutMeAPIView, ContactInquiryAPIView

urlpatterns = [
    path('', AboutMeAPIView.as_view(), name='about-me'),
    path('inquiries/', ContactInquiryAPIView.as_view(), name='contact-inquiries'),
]
