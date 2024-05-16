from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Testimonial
from .serializers import TestimonialSerializer

class TestimonialAPIView(APIView):
    def get(self, request):
        testimonials = Testimonial.objects.all()
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data)

