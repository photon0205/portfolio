# serializers.py
from rest_framework import serializers
from .models import (
    OpenSourceContribution,
    OpenSourceProject,
    ContributionType,
)

class ContributionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContributionType
        fields = "__all__"

class OpenSourceContributionSerializer(serializers.ModelSerializer):
    contribution_type = ContributionTypeSerializer()

    class Meta:
        model = OpenSourceContribution
        fields = "__all__"

class OpenSourceProjectSerializer(serializers.ModelSerializer):
    contributions = OpenSourceContributionSerializer(many=True)
    class Meta:
        model = OpenSourceProject
        fields = "__all__"