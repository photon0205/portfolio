"""
Utility functions for portfolio data export.
This module can be imported by both management commands and signals.
"""
import json
import os
from django.conf import settings
from about.models import AboutMe
from about.serializers import AboutMeSerializer
from projects.models import Project, Category
from projects.serializers import ProjectSerializer, CategorySerializer
from experiences.models import WorkExperience
from experiences.serializers import WorkExperienceSerializer
from opensource.models import OpenSourceProject
from opensource.serializers import OpenSourceProjectSerializer


def export_portfolio_data():
    """
    Export all portfolio data to a single JSON file.
    Returns True if successful, False otherwise.
    
    This function is called automatically via Django signals when content is updated,
    or manually via the management command.
    """
    try:
        # Get export directory from settings
        export_dir = getattr(settings, 'EXPORT_DATA_DIR', None)
        if not export_dir:
            print("ERROR: EXPORT_DATA_DIR not configured in settings")
            return False
        
        # Create directory if it doesn't exist
        os.makedirs(export_dir, exist_ok=True)
        
        # Prepare portfolio data structure
        portfolio_data = {}
        
        # Export AboutMe
        about_me = AboutMe.objects.first()
        if about_me:
            serializer = AboutMeSerializer(about_me)
            portfolio_data['about'] = serializer.data
            print(f"✓ Added about data")
        else:
            portfolio_data['about'] = None
            print("⚠ No AboutMe data found")
        
        # Export Projects
        projects = Project.objects.all()
        project_serializer = ProjectSerializer(projects, many=True)
        portfolio_data['projects'] = project_serializer.data
        print(f"✓ Added projects data ({len(projects)} projects)")
        
        # Export Categories
        categories = Category.objects.all()
        category_serializer = CategorySerializer(categories, many=True)
        portfolio_data['categories'] = category_serializer.data
        print(f"✓ Added categories data ({len(categories)} categories)")
        
        # Export Work Experiences
        experiences = WorkExperience.objects.all()
        experience_serializer = WorkExperienceSerializer(experiences, many=True)
        portfolio_data['experiences'] = experience_serializer.data
        print(f"✓ Added experiences data ({len(experiences)} experiences)")
        
        # Export Open Source Projects
        open_source_projects = OpenSourceProject.objects.all()
        opensource_serializer = OpenSourceProjectSerializer(open_source_projects, many=True)
        portfolio_data['opensource'] = opensource_serializer.data
        print(f"✓ Added opensource data ({len(open_source_projects)} projects)")
        
        # Export everything to a single portfolio.json file
        portfolio_path = os.path.join(export_dir, 'portfolio.json')
        with open(portfolio_path, 'w', encoding='utf-8') as f:
            json.dump(portfolio_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ All data exported successfully to: {portfolio_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error exporting data: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

