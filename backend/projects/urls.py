from django.urls import path
from .views import ProjectAPIView, CategoryAPIView, CodingSkillAPIView

urlpatterns = [
    path('', ProjectAPIView.as_view(), name='projects'),
    path('categories/', CategoryAPIView.as_view(), name='categories'),
    path('skills/', CodingSkillAPIView.as_view(), name='coding-skills'),
]
