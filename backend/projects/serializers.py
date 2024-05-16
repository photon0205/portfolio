# serializers.py
from rest_framework import serializers
from .models import Project, Category, CodingSkill, ProjectImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CodingSkillSerializer(serializers.ModelSerializer):    
    class Meta:
        model = CodingSkill
        fields = '__all__'

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    skills_used = CodingSkillSerializer(many=True)
    images = ProjectImageSerializer(many=True)

    class Meta:
        model = Project
        fields = '__all__'