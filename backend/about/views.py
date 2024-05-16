from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AboutMe, ContactInquiry
from .serializers import AboutMeSerializer, ContactInquirySerializer

class AboutMeAPIView(APIView):
    def get(self, request):
        about_me = AboutMe.objects.first()
        serializer = AboutMeSerializer(about_me)
        return Response(serializer.data)

class ContactInquiryAPIView(APIView):
    def get(self, request):
        contact_inquiries = ContactInquiry.objects.all()
        serializer = ContactInquirySerializer(contact_inquiries, many=True)
        return Response(serializer.data)