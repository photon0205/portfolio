from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OpenSourceContribution, OpenSourceProject, ContributionType
from .serializers import ContributionTypeSerializer, OpenSourceProjectSerializer, OpenSourceContributionSerializer

class ContributionTypeAPIView(APIView):
    def get(self, request):
        contribution_types = ContributionType.objects.all()
        serializer = ContributionTypeSerializer(contribution_types, many=True)
        return Response(serializer.data)
    
class OpenSourceProjectAPIView(APIView):
    def get(self, request):
        open_source_projects = OpenSourceProject.objects.all()
        serializer = OpenSourceProjectSerializer(open_source_projects, many=True)
        return Response(serializer.data)
    
class OpenSourceContributionAPIView(APIView):
    def get(self, request):
        open_source_contributions = OpenSourceContribution.objects.all()
        serializer = OpenSourceContributionSerializer(open_source_contributions, many=True)
        return Response(serializer.data)
