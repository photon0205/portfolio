from projects.serializers import CodingSkillSerializer
from rest_framework import serializers
from .models import DescriptionPoint, WorkExperience

class DescriptionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DescriptionPoint
        fields = '__all__'

class WorkExperienceSerializer(serializers.ModelSerializer):
    description = DescriptionPointSerializer(many=True, read_only=True)
    skills_used = CodingSkillSerializer(many=True, read_only=True)
    company_logo = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = WorkExperience
        fields = '__all__'