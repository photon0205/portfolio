from rest_framework import serializers
from .models import DescriptionPoint, WorkExperience

class DescriptionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DescriptionPoint
        fields = '__all__'

class WorkExperienceSerializer(serializers.ModelSerializer):
    points = DescriptionPointSerializer(many=True)

    class Meta:
        model = WorkExperience
        fields = '__all__'