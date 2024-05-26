from rest_framework import serializers
from .models import AboutMe, ContactInquiry, SocialMediaLink

class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ['platform', 'url']

class AboutMeSerializer(serializers.ModelSerializer):
    social_links = SocialMediaLinkSerializer(many=True, read_only=True)

    class Meta:
        model = AboutMe
        fields = ['name', 'subtitle', 'summary', 'profile_picture', 'resume', 'avatar', 'social_links']

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = '__all__'