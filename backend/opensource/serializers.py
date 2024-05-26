from rest_framework import serializers
from .models import OpenSourceContribution, OpenSourceProject, ContributionType

class ContributionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContributionType
        fields = '__all__'

class OpenSourceProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenSourceProject
        fields = '__all__'

class OpenSourceContributionSerializer(serializers.ModelSerializer):
    open_source_project = OpenSourceProjectSerializer()
    contribution_type = ContributionTypeSerializer()
    class Meta:
        model = OpenSourceContribution
        fields = '__all__'