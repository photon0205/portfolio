from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Category, CodingSkill
from .serializers import ProjectSerializer, CategorySerializer, CodingSkillSerializer

class ProjectAPIView(APIView):
    def get(self, request):
        projects = Project.objects.all().order_by('display_order', '-start_date', 'title')
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
class CategoryAPIView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
class CodingSkillAPIView(APIView):
    def get(self, request):
        coding_skills = CodingSkill.objects.all()
        serializer = CodingSkillSerializer(coding_skills, many=True)
        return Response(serializer.data)