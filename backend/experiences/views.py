from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import WorkExperience
from .serializers import WorkExperienceSerializer

class WorkExperienceAPIView(APIView):
    def get(self, request):
        work_experiences = WorkExperience.objects.all()
        serializer = WorkExperienceSerializer(work_experiences, many=True)
        return Response(serializer.data)