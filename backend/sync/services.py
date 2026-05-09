"""
Services for portfolio JSON sync functionality.
"""
from django.db import transaction
from about.models import AboutMe, SocialMediaLink
from about.utils import export_portfolio_data
from projects.models import Project, Category, CodingSkill, ProjectImage
from experiences.models import WorkExperience, DescriptionPoint
from opensource.models import OpenSourceProject, OpenSourceContribution, ContributionType
from datetime import datetime


def compute_diff(payload):
    """
    Compute diff between uploaded JSON and database.
    Returns diff structure with summary, entities, and stale items.
    """
    diff_result = {
        "summary": {},
        "entities": {},
        "stale": {},
        "skipped_fields_globally": [
            "AboutMe.profile_picture", "AboutMe.avatar", "AboutMe.resume",
            "WorkExperience.company_logo", "Project.images[]",
            "CodingSkill.logo", "OpenSourceProject.image"
        ]
    }
    
    # Process each entity type
    _diff_categories(payload, diff_result)
    _diff_coding_skills(payload, diff_result)
    _diff_contribution_types(payload, diff_result)
    _diff_about(payload, diff_result)
    _diff_projects(payload, diff_result)
    _diff_experiences(payload, diff_result)
    _diff_opensource(payload, diff_result)
    
    return diff_result


def _diff_categories(payload, diff_result):
    """Diff categories."""
    json_categories = payload.get('categories', [])
    db_categories = list(Category.objects.all())
    
    new_count = updated_count = unchanged_count = 0
    entities = []
    stale = []
    
    # Track which DB items are matched
    matched_db_ids = set()
    
    for json_cat in json_categories:
        match = _find_category_match(json_cat, db_categories)
        
        if match:
            matched_db_ids.add(match.id)
            changes = _compare_category_fields(match, json_cat)
            
            if changes:
                entities.append({
                    "status": "updated",
                    "matched_by": "id" if match.id == json_cat.get('id') else "slug",
                    "db_id": match.id,
                    "json_id": json_cat.get('id'),
                    "name": json_cat.get('name'),
                    "field_changes": changes
                })
                updated_count += 1
            else:
                entities.append({
                    "status": "unchanged",
                    "matched_by": "id" if match.id == json_cat.get('id') else "slug",
                    "db_id": match.id,
                    "json_id": json_cat.get('id'),
                    "name": json_cat.get('name')
                })
                unchanged_count += 1
        else:
            entities.append({
                "status": "new",
                "json_id": json_cat.get('id'),
                "name": json_cat.get('name'),
                "slug": json_cat.get('slug')
            })
            new_count += 1
    
    # Find stale items
    for db_cat in db_categories:
        if db_cat.id not in matched_db_ids:
            stale.append({
                "id": db_cat.id,
                "name": db_cat.name,
                "slug": db_cat.slug
            })
    
    diff_result["summary"]["categories"] = {
        "new": new_count,
        "updated": updated_count,
        "unchanged": unchanged_count,
        "stale": len(stale)
    }
    diff_result["entities"]["categories"] = entities
    diff_result["stale"]["categories"] = stale


def _find_category_match(json_cat, db_categories):
    """Find matching category in DB."""
    json_id = json_cat.get('id')
    json_slug = json_cat.get('slug')
    json_name = json_cat.get('name')
    
    # Try ID first
    if json_id:
        for cat in db_categories:
            if cat.id == json_id:
                return cat
    
    # Try slug
    if json_slug:
        for cat in db_categories:
            if cat.slug == json_slug:
                return cat
    
    # Try name
    if json_name:
        for cat in db_categories:
            if cat.name == json_name:
                return cat
    
    return None


def _compare_category_fields(db_cat, json_cat):
    """Compare category fields and return changes."""
    changes = {}
    
    if db_cat.name != json_cat.get('name'):
        changes['name'] = {"old": db_cat.name, "new": json_cat.get('name')}
    
    if db_cat.slug != json_cat.get('slug'):
        changes['slug'] = {"old": db_cat.slug, "new": json_cat.get('slug')}
    
    return changes


def _diff_coding_skills(payload, diff_result):
    """Diff coding skills."""
    # Extract all skills from different sections
    all_json_skills = []
    
    # From projects
    for project in payload.get('projects', []):
        for skill in project.get('skills_used', []):
            if skill not in all_json_skills:
                all_json_skills.append(skill)
    
    # From experiences
    for exp in payload.get('experiences', []):
        for skill in exp.get('skills_used', []):
            if skill not in all_json_skills:
                all_json_skills.append(skill)
    
    db_skills = list(CodingSkill.objects.all())
    
    new_count = updated_count = unchanged_count = 0
    entities = []
    stale = []
    
    matched_db_ids = set()
    
    for json_skill in all_json_skills:
        match = _find_skill_match(json_skill, db_skills)
        
        if match:
            matched_db_ids.add(match.id)
            changes = _compare_skill_fields(match, json_skill)
            
            if changes:
                entities.append({
                    "status": "updated",
                    "matched_by": "id" if match.id == json_skill.get('id') else "name",
                    "db_id": match.id,
                    "json_id": json_skill.get('id'),
                    "name": json_skill.get('name'),
                    "field_changes": changes,
                    "skipped_fields": ["logo"]
                })
                updated_count += 1
            else:
                entities.append({
                    "status": "unchanged",
                    "matched_by": "id" if match.id == json_skill.get('id') else "name",
                    "db_id": match.id,
                    "json_id": json_skill.get('id'),
                    "name": json_skill.get('name'),
                    "skipped_fields": ["logo"]
                })
                unchanged_count += 1
        else:
            entities.append({
                "status": "new",
                "json_id": json_skill.get('id'),
                "name": json_skill.get('name')
            })
            new_count += 1
    
    # Find stale items
    for db_skill in db_skills:
        if db_skill.id not in matched_db_ids:
            stale.append({
                "id": db_skill.id,
                "name": db_skill.name
            })
    
    diff_result["summary"]["coding_skills"] = {
        "new": new_count,
        "updated": updated_count,
        "unchanged": unchanged_count,
        "stale": len(stale)
    }
    diff_result["entities"]["coding_skills"] = entities
    diff_result["stale"]["coding_skills"] = stale


def _find_skill_match(json_skill, db_skills):
    """Find matching skill in DB."""
    json_id = json_skill.get('id')
    json_name = json_skill.get('name')
    
    # Try ID first
    if json_id:
        for skill in db_skills:
            if skill.id == json_id:
                return skill
    
    # Try name
    if json_name:
        for skill in db_skills:
            if skill.name == json_name:
                return skill
    
    return None


def _compare_skill_fields(db_skill, json_skill):
    """Compare skill fields and return changes."""
    changes = {}
    
    if db_skill.name != json_skill.get('name'):
        changes['name'] = {"old": db_skill.name, "new": json_skill.get('name')}
    
    # Skip logo field as per plan
    
    return changes


def _diff_contribution_types(payload, diff_result):
    """Diff contribution types from opensource data."""
    all_json_types = []
    
    # Extract contribution types from opensource projects
    for os_project in payload.get('opensource', []):
        for contribution in os_project.get('contributions', []):
            contrib_type = contribution.get('contribution_type')
            if contrib_type and contrib_type not in all_json_types:
                all_json_types.append(contrib_type)
    
    db_types = list(ContributionType.objects.all())
    
    new_count = updated_count = unchanged_count = 0
    entities = []
    stale = []
    
    matched_db_ids = set()
    
    for json_type in all_json_types:
        match = _find_contribution_type_match(json_type, db_types)
        
        if match:
            matched_db_ids.add(match.id)
            changes = _compare_contribution_type_fields(match, json_type)
            
            if changes:
                entities.append({
                    "status": "updated",
                    "matched_by": "id" if match.id == json_type.get('id') else "slug",
                    "db_id": match.id,
                    "json_id": json_type.get('id'),
                    "name": json_type.get('name'),
                    "field_changes": changes
                })
                updated_count += 1
            else:
                entities.append({
                    "status": "unchanged",
                    "matched_by": "id" if match.id == json_type.get('id') else "slug",
                    "db_id": match.id,
                    "json_id": json_type.get('id'),
                    "name": json_type.get('name')
                })
                unchanged_count += 1
        else:
            entities.append({
                "status": "new",
                "json_id": json_type.get('id'),
                "name": json_type.get('name'),
                "slug": json_type.get('slug')
            })
            new_count += 1
    
    # Find stale items
    for db_type in db_types:
        if db_type.id not in matched_db_ids:
            stale.append({
                "id": db_type.id,
                "name": db_type.name,
                "slug": db_type.slug
            })
    
    diff_result["summary"]["contribution_types"] = {
        "new": new_count,
        "updated": updated_count,
        "unchanged": unchanged_count,
        "stale": len(stale)
    }
    diff_result["entities"]["contribution_types"] = entities
    diff_result["stale"]["contribution_types"] = stale


def _find_contribution_type_match(json_type, db_types):
    """Find matching contribution type in DB."""
    json_id = json_type.get('id')
    json_slug = json_type.get('slug')
    
    # Try ID first
    if json_id:
        for ct in db_types:
            if ct.id == json_id:
                return ct
    
    # Try slug
    if json_slug:
        for ct in db_types:
            if ct.slug == json_slug:
                return ct
    
    return None


def _compare_contribution_type_fields(db_type, json_type):
    """Compare contribution type fields and return changes."""
    changes = {}
    
    if db_type.name != json_type.get('name'):
        changes['name'] = {"old": db_type.name, "new": json_type.get('name')}
    
    if db_type.slug != json_type.get('slug'):
        changes['slug'] = {"old": db_type.slug, "new": json_type.get('slug')}
    
    return changes


def _diff_about(payload, diff_result):
    """Diff about section."""
    json_about = payload.get('about')
    if not json_about:
        diff_result["summary"]["about"] = {"status": "no_data"}
        diff_result["entities"]["about"] = []
        return
    
    db_about = AboutMe.objects.first()
    
    if db_about:
        changes = _compare_about_fields(db_about, json_about)
        social_changes = _diff_social_links(db_about, json_about)
        
        if changes or social_changes:
            entity = {
                "status": "updated",
                "db_id": db_about.id,
                "field_changes": changes,
                "social_links": social_changes,
                "skipped_fields": ["profile_picture", "avatar", "resume"]
            }
            diff_result["summary"]["about"] = {"status": "updated"}
        else:
            entity = {
                "status": "unchanged",
                "db_id": db_about.id,
                "skipped_fields": ["profile_picture", "avatar", "resume"]
            }
            diff_result["summary"]["about"] = {"status": "unchanged"}
    else:
        entity = {
            "status": "new",
            "name": json_about.get('name')
        }
        diff_result["summary"]["about"] = {"status": "new"}
    
    diff_result["entities"]["about"] = [entity]


def _compare_about_fields(db_about, json_about):
    """Compare AboutMe fields and return changes."""
    changes = {}
    
    fields_to_compare = ['name', 'summary', 'current_role', 'subtitle', 'email']
    
    for field in fields_to_compare:
        db_value = getattr(db_about, field, None)
        json_value = json_about.get(field)
        
        if db_value != json_value:
            changes[field] = {"old": db_value, "new": json_value}
    
    return changes


def _diff_social_links(db_about, json_about):
    """Diff social media links."""
    json_links = json_about.get('social_links', [])
    db_links = list(db_about.social_links.all())
    
    changes = {"new": [], "updated": [], "stale": []}
    matched_db_ids = set()
    
    for json_link in json_links:
        match = _find_social_link_match(json_link, db_links)
        
        if match:
            matched_db_ids.add(match.id)
            link_changes = _compare_social_link_fields(match, json_link)
            
            if link_changes:
                changes["updated"].append({
                    "db_id": match.id,
                    "platform": json_link.get('platform'),
                    "field_changes": link_changes
                })
        else:
            changes["new"].append({
                "json_id": json_link.get('id'),
                "platform": json_link.get('platform'),
                "url": json_link.get('url')
            })
    
    # Find stale links
    for db_link in db_links:
        if db_link.id not in matched_db_ids:
            changes["stale"].append({
                "id": db_link.id,
                "platform": db_link.platform,
                "url": db_link.url
            })
    
    return changes


def _find_social_link_match(json_link, db_links):
    """Find matching social link in DB."""
    json_id = json_link.get('id')
    json_platform = json_link.get('platform')
    
    # Try ID first
    if json_id:
        for link in db_links:
            if link.id == json_id:
                return link
    
    # Try platform
    if json_platform:
        for link in db_links:
            if link.platform == json_platform:
                return link
    
    return None


def _compare_social_link_fields(db_link, json_link):
    """Compare social link fields and return changes."""
    changes = {}
    
    if db_link.platform != json_link.get('platform'):
        changes['platform'] = {"old": db_link.platform, "new": json_link.get('platform')}
    
    if db_link.url != json_link.get('url'):
        changes['url'] = {"old": db_link.url, "new": json_link.get('url')}
    
    return changes


def _diff_projects(payload, diff_result):
    """Diff projects."""
    json_projects = payload.get('projects', [])
    db_projects = list(Project.objects.all())
    
    new_count = updated_count = unchanged_count = 0
    entities = []
    stale = []
    
    matched_db_ids = set()
    
    for json_project in json_projects:
        match = _find_project_match(json_project, db_projects)
        
        if match:
            matched_db_ids.add(match.id)
            changes = _compare_project_fields(match, json_project)
            skills_changes = _diff_project_skills(match, json_project)
            
            if changes or skills_changes:
                entities.append({
                    "status": "updated",
                    "matched_by": "id" if match.id == json_project.get('id') else "title",
                    "db_id": match.id,
                    "json_id": json_project.get('id'),
                    "title": json_project.get('title'),
                    "field_changes": changes,
                    "skills_used": skills_changes,
                    "skipped_fields": ["images"]
                })
                updated_count += 1
            else:
                entities.append({
                    "status": "unchanged",
                    "matched_by": "id" if match.id == json_project.get('id') else "title",
                    "db_id": match.id,
                    "json_id": json_project.get('id'),
                    "title": json_project.get('title'),
                    "skipped_fields": ["images"]
                })
                unchanged_count += 1
        else:
            entities.append({
                "status": "new",
                "json_id": json_project.get('id'),
                "title": json_project.get('title'),
                "organisation": json_project.get('organisation')
            })
            new_count += 1
    
    # Find stale items
    for db_project in db_projects:
        if db_project.id not in matched_db_ids:
            stale.append({
                "id": db_project.id,
                "title": db_project.title,
                "organisation": db_project.organisation
            })
    
    diff_result["summary"]["projects"] = {
        "new": new_count,
        "updated": updated_count,
        "unchanged": unchanged_count,
        "stale": len(stale)
    }
    diff_result["entities"]["projects"] = entities
    diff_result["stale"]["projects"] = stale


def _find_project_match(json_project, db_projects):
    """Find matching project in DB."""
    json_id = json_project.get('id')
    json_title = json_project.get('title')
    
    # Try ID first
    if json_id:
        for project in db_projects:
            if project.id == json_id:
                return project
    
    # Try title
    if json_title:
        for project in db_projects:
            if project.title == json_title:
                return project
    
    return None


def _compare_project_fields(db_project, json_project):
    """Compare project fields and return changes."""
    changes = {}
    
    fields_to_compare = [
        'title', 'caption', 'description', 'organisation', 
        'github_link', 'live_demo_link', 'display_order'
    ]
    
    for field in fields_to_compare:
        db_value = getattr(db_project, field, None)
        json_value = json_project.get(field)
        
        if db_value != json_value:
            changes[field] = {"old": db_value, "new": json_value}
    
    # Handle dates
    for date_field in ['start_date', 'end_date']:
        db_value = getattr(db_project, date_field)
        json_value = json_project.get(date_field)
        
        if json_value:
            # Convert string to date for comparison
            try:
                json_date = datetime.strptime(json_value, '%Y-%m-%d').date()
            except (ValueError, TypeError):
                json_date = None
        else:
            json_date = None
        
        if db_value != json_date:
            changes[date_field] = {
                "old": str(db_value) if db_value else None, 
                "new": json_value
            }
    
    # Handle category
    json_category = json_project.get('category')
    if json_category:
        json_cat_name = json_category.get('name')
        db_cat_name = db_project.category.name if db_project.category else None
        
        if db_cat_name != json_cat_name:
            changes['category'] = {"old": db_cat_name, "new": json_cat_name}
    
    return changes


def _diff_project_skills(db_project, json_project):
    """Diff project skills."""
    json_skills = [skill.get('name') for skill in json_project.get('skills_used', [])]
    db_skills = [skill.name for skill in db_project.skills_used.all()]
    
    added = [skill for skill in json_skills if skill not in db_skills]
    removed = [skill for skill in db_skills if skill not in json_skills]
    
    return {"added": added, "removed": removed}


def _diff_experiences(payload, diff_result):
    """Diff work experiences."""
    json_experiences = payload.get('experiences', [])
    db_experiences = list(WorkExperience.objects.all())
    
    new_count = updated_count = unchanged_count = 0
    entities = []
    stale = []
    
    matched_db_ids = set()
    
    for json_exp in json_experiences:
        match = _find_experience_match(json_exp, db_experiences)
        
        if match:
            matched_db_ids.add(match.id)
            changes = _compare_experience_fields(match, json_exp)
            desc_changes = _diff_description_points(match, json_exp)
            skills_changes = _diff_experience_skills(match, json_exp)
            
            if changes or desc_changes or skills_changes:
                entities.append({
                    "status": "updated",
                    "matched_by": "id" if match.id == json_exp.get('id') else "company+title",
                    "db_id": match.id,
                    "json_id": json_exp.get('id'),
                    "title": json_exp.get('title'),
                    "company": json_exp.get('company'),
                    "field_changes": changes,
                    "description_points": desc_changes,
                    "skills_used": skills_changes,
                    "skipped_fields": ["company_logo"]
                })
                updated_count += 1
            else:
                entities.append({
                    "status": "unchanged",
                    "matched_by": "id" if match.id == json_exp.get('id') else "company+title",
                    "db_id": match.id,
                    "json_id": json_exp.get('id'),
                    "title": json_exp.get('title'),
                    "company": json_exp.get('company'),
                    "skipped_fields": ["company_logo"]
                })
                unchanged_count += 1
        else:
            entities.append({
                "status": "new",
                "json_id": json_exp.get('id'),
                "title": json_exp.get('title'),
                "company": json_exp.get('company')
            })
            new_count += 1
    
    # Find stale items
    for db_exp in db_experiences:
        if db_exp.id not in matched_db_ids:
            stale.append({
                "id": db_exp.id,
                "title": db_exp.title,
                "company": db_exp.company
            })
    
    diff_result["summary"]["experiences"] = {
        "new": new_count,
        "updated": updated_count,
        "unchanged": unchanged_count,
        "stale": len(stale)
    }
    diff_result["entities"]["experiences"] = entities
    diff_result["stale"]["experiences"] = stale


def _find_experience_match(json_exp, db_experiences):
    """Find matching experience in DB."""
    json_id = json_exp.get('id')
    json_company = json_exp.get('company')
    json_title = json_exp.get('title')
    
    # Try ID first
    if json_id:
        for exp in db_experiences:
            if exp.id == json_id:
                return exp
    
    # Try company + title
    if json_company and json_title:
        for exp in db_experiences:
            if exp.company == json_company and exp.title == json_title:
                return exp
    
    return None


def _compare_experience_fields(db_exp, json_exp):
    """Compare experience fields and return changes."""
    changes = {}
    
    fields_to_compare = ['title', 'company', 'location', 'website']
    
    for field in fields_to_compare:
        db_value = getattr(db_exp, field, None)
        json_value = json_exp.get(field)
        
        if db_value != json_value:
            changes[field] = {"old": db_value, "new": json_value}
    
    # Handle dates
    for date_field in ['start_date', 'end_date']:
        db_value = getattr(db_exp, date_field)
        json_value = json_exp.get(date_field)
        
        if json_value:
            try:
                json_date = datetime.strptime(json_value, '%Y-%m-%d').date()
            except (ValueError, TypeError):
                json_date = None
        else:
            json_date = None
        
        if db_value != json_date:
            changes[date_field] = {
                "old": str(db_value) if db_value else None, 
                "new": json_value
            }
    
    return changes


def _diff_description_points(db_exp, json_exp):
    """Diff description points for an experience."""
    json_points = [point.get('point') for point in json_exp.get('description', [])]
    db_points = list(db_exp.description.all())
    
    changes = {"new": [], "updated": [], "stale": []}
    matched_db_ids = set()
    
    for json_point_text in json_points:
        match = None
        # Try to find by exact text match
        for db_point in db_points:
            if db_point.point == json_point_text:
                match = db_point
                break
        
        if match:
            matched_db_ids.add(match.id)
            # Since we matched by text, there are no changes
        else:
            # New description point
            changes["new"].append({
                "point": json_point_text
            })
    
    # Find stale points
    for db_point in db_points:
        if db_point.id not in matched_db_ids:
            changes["stale"].append({
                "db_id": db_point.id,
                "point": db_point.point
            })
    
    return changes


def _diff_experience_skills(db_exp, json_exp):
    """Diff experience skills."""
    json_skills = [skill.get('name') for skill in json_exp.get('skills_used', [])]
    db_skills = [skill.name for skill in db_exp.skills_used.all()]
    
    added = [skill for skill in json_skills if skill not in db_skills]
    removed = [skill for skill in db_skills if skill not in json_skills]
    
    return {"added": added, "removed": removed}


def _diff_opensource(payload, diff_result):
    """Diff opensource projects."""
    json_opensource = payload.get('opensource', [])
    db_opensource = list(OpenSourceProject.objects.all())
    
    new_count = updated_count = unchanged_count = 0
    entities = []
    stale = []
    
    matched_db_ids = set()
    
    for json_os in json_opensource:
        match = _find_opensource_match(json_os, db_opensource)
        
        if match:
            matched_db_ids.add(match.id)
            changes = _compare_opensource_fields(match, json_os)
            contrib_changes = _diff_contributions(match, json_os)
            
            if changes or contrib_changes:
                entities.append({
                    "status": "updated",
                    "matched_by": "id" if match.id == json_os.get('id') else "repo_link",
                    "db_id": match.id,
                    "json_id": json_os.get('id'),
                    "name": json_os.get('name'),
                    "field_changes": changes,
                    "contributions": contrib_changes,
                    "skipped_fields": ["image"]
                })
                updated_count += 1
            else:
                entities.append({
                    "status": "unchanged",
                    "matched_by": "id" if match.id == json_os.get('id') else "repo_link",
                    "db_id": match.id,
                    "json_id": json_os.get('id'),
                    "name": json_os.get('name'),
                    "skipped_fields": ["image"]
                })
                unchanged_count += 1
        else:
            entities.append({
                "status": "new",
                "json_id": json_os.get('id'),
                "name": json_os.get('name'),
                "repo_link": json_os.get('repo_link')
            })
            new_count += 1
    
    # Find stale items
    for db_os in db_opensource:
        if db_os.id not in matched_db_ids:
            stale.append({
                "id": db_os.id,
                "name": db_os.name,
                "repo_link": db_os.repo_link
            })
    
    diff_result["summary"]["opensource"] = {
        "new": new_count,
        "updated": updated_count,
        "unchanged": unchanged_count,
        "stale": len(stale)
    }
    diff_result["entities"]["opensource"] = entities
    diff_result["stale"]["opensource"] = stale


def _find_opensource_match(json_os, db_opensource):
    """Find matching opensource project in DB."""
    json_id = json_os.get('id')
    json_repo_link = json_os.get('repo_link')
    json_name = json_os.get('name')
    
    # Try ID first
    if json_id:
        for os in db_opensource:
            if os.id == json_id:
                return os
    
    # Try repo_link
    if json_repo_link:
        for os in db_opensource:
            if os.repo_link == json_repo_link:
                return os
    
    # Try name
    if json_name:
        for os in db_opensource:
            if os.name == json_name:
                return os
    
    return None


def _compare_opensource_fields(db_os, json_os):
    """Compare opensource project fields and return changes."""
    changes = {}
    
    fields_to_compare = ['name', 'caption', 'repo_link']
    
    for field in fields_to_compare:
        db_value = getattr(db_os, field, None)
        json_value = json_os.get(field)
        
        if db_value != json_value:
            changes[field] = {"old": db_value, "new": json_value}
    
    return changes


def _diff_contributions(db_os, json_os):
    """Diff contributions for an opensource project."""
    json_contributions = json_os.get('contributions', [])
    db_contributions = list(db_os.contributions.all())
    
    changes = {"new": [], "updated": [], "stale": []}
    matched_db_ids = set()
    
    for json_contrib in json_contributions:
        match = _find_contribution_match(json_contrib, db_contributions)
        
        if match:
            matched_db_ids.add(match.id)
            contrib_changes = _compare_contribution_fields(match, json_contrib)
            
            if contrib_changes:
                changes["updated"].append({
                    "db_id": match.id,
                    "description": json_contrib.get('description', ''),
                    "field_changes": contrib_changes
                })
        else:
            changes["new"].append({
                "json_id": json_contrib.get('id'),
                "description": json_contrib.get('description', ''),
                "contribution_type": json_contrib.get('contribution_type', {}),
                "pr_link": json_contrib.get('pr_link', '')
            })
    
    # Find stale contributions
    for db_contrib in db_contributions:
        if db_contrib.id not in matched_db_ids:
            changes["stale"].append({
                "id": db_contrib.id,
                "description": db_contrib.description,
                "contribution_type": db_contrib.contribution_type.name if db_contrib.contribution_type else '',
                "pr_link": db_contrib.pr_link
            })
    
    return changes


def _find_contribution_match(json_contrib, db_contributions):
    """Find matching contribution in DB."""
    json_id = json_contrib.get('id')
    json_pr_link = json_contrib.get('pr_link')
    json_contrib_type = json_contrib.get('contribution_type', {}).get('slug')
    
    # Try ID first
    if json_id:
        for contrib in db_contributions:
            if contrib.id == json_id:
                return contrib
    
    # Try combination of contribution_type and pr_link
    if json_contrib_type and json_pr_link:
        for contrib in db_contributions:
            if (contrib.contribution_type and 
                contrib.contribution_type.slug == json_contrib_type and 
                contrib.pr_link == json_pr_link):
                return contrib
    
    return None


def _compare_contribution_fields(db_contrib, json_contrib):
    """Compare contribution fields and return changes."""
    changes = {}
    
    if db_contrib.description != json_contrib.get('description'):
        changes['description'] = {
            "old": db_contrib.description, 
            "new": json_contrib.get('description')
        }
    
    if db_contrib.pr_link != json_contrib.get('pr_link'):
        changes['pr_link'] = {
            "old": db_contrib.pr_link, 
            "new": json_contrib.get('pr_link')
        }
    
    # Check contribution type
    json_type = json_contrib.get('contribution_type', {})
    json_type_slug = json_type.get('slug')
    db_type_slug = db_contrib.contribution_type.slug if db_contrib.contribution_type else None
    
    if db_type_slug != json_type_slug:
        changes['contribution_type'] = {
            "old": db_type_slug,
            "new": json_type_slug
        }
    
    return changes


def apply_diff(payload, deletions, user):
    """
    Apply diff changes to database atomically.
    """
    with transaction.atomic():
        # Re-compute diff for safety
        current_diff = compute_diff(payload)
        
        # Validate deletions are still stale
        _validate_deletions(current_diff, deletions)
        
        # Apply changes in FK-safe order
        category_mapping = _apply_categories(payload)
        skill_mapping = _apply_coding_skills(payload)
        contrib_type_mapping = _apply_contribution_types(payload)
        
        _apply_about(payload)
        _apply_projects(payload, category_mapping, skill_mapping)
        _apply_experiences(payload, skill_mapping)
        _apply_opensource(payload, contrib_type_mapping)
        
        # Apply deletions in reverse FK order
        _apply_deletions(deletions)
        
        # Refresh portfolio.json
        export_success = export_portfolio_data()
        
        if not export_success:
            raise Exception("Failed to export portfolio data after sync")
        
        return {
            "success": True,
            "message": "Portfolio synchronized successfully",
            "summary": current_diff["summary"]
        }


def _validate_deletions(current_diff, deletions):
    """Validate that deletion targets are still stale."""
    for entity_type, delete_ids in deletions.items():
        stale_ids = [item["id"] for item in current_diff["stale"].get(entity_type, [])]
        for delete_id in delete_ids:
            if delete_id not in stale_ids:
                raise ValueError(f"Cannot delete {entity_type} id {delete_id}: not in stale list")


def _apply_categories(payload):
    """Apply category changes and return ID mapping."""
    json_categories = payload.get('categories', [])
    db_categories = list(Category.objects.all())
    
    id_mapping = {}  # json_id -> db_id
    
    for json_cat in json_categories:
        match = _find_category_match(json_cat, db_categories)
        
        if match:
            # Update existing
            match.name = json_cat.get('name', match.name)
            match.slug = json_cat.get('slug', match.slug)
            match.save()
            id_mapping[json_cat.get('id')] = match.id
        else:
            # Create new
            new_cat = Category.objects.create(
                name=json_cat.get('name', ''),
                slug=json_cat.get('slug', '')
            )
            id_mapping[json_cat.get('id')] = new_cat.id
    
    return id_mapping


def _apply_coding_skills(payload):
    """Apply coding skill changes and return ID mapping."""
    # Extract all skills from projects and experiences
    all_json_skills = []
    
    for project in payload.get('projects', []):
        for skill in project.get('skills_used', []):
            if skill not in all_json_skills:
                all_json_skills.append(skill)
    
    for exp in payload.get('experiences', []):
        for skill in exp.get('skills_used', []):
            if skill not in all_json_skills:
                all_json_skills.append(skill)
    
    db_skills = list(CodingSkill.objects.all())
    
    id_mapping = {}  # json_id -> db_id
    name_mapping = {}  # name -> db_id
    
    for json_skill in all_json_skills:
        match = _find_skill_match(json_skill, db_skills)
        
        if match:
            # Update existing (name only, skip logo)
            match.name = json_skill.get('name', match.name)
            match.save()
            id_mapping[json_skill.get('id')] = match.id
            name_mapping[match.name] = match.id
        else:
            # Create new
            new_skill = CodingSkill.objects.create(
                name=json_skill.get('name', '')
            )
            id_mapping[json_skill.get('id')] = new_skill.id
            name_mapping[new_skill.name] = new_skill.id
    
    return {"id_mapping": id_mapping, "name_mapping": name_mapping}


def _apply_contribution_types(payload):
    """Apply contribution type changes and return ID mapping."""
    all_json_types = []
    
    for os_project in payload.get('opensource', []):
        for contribution in os_project.get('contributions', []):
            contrib_type = contribution.get('contribution_type')
            if contrib_type and contrib_type not in all_json_types:
                all_json_types.append(contrib_type)
    
    db_types = list(ContributionType.objects.all())
    
    id_mapping = {}  # json_id -> db_id
    slug_mapping = {}  # slug -> db_id
    
    for json_type in all_json_types:
        match = _find_contribution_type_match(json_type, db_types)
        
        if match:
            # Update existing
            match.name = json_type.get('name', match.name)
            match.slug = json_type.get('slug', match.slug)
            match.save()
            id_mapping[json_type.get('id')] = match.id
            slug_mapping[match.slug] = match.id
        else:
            # Create new
            new_type = ContributionType.objects.create(
                name=json_type.get('name', ''),
                slug=json_type.get('slug', '')
            )
            id_mapping[json_type.get('id')] = new_type.id
            slug_mapping[new_type.slug] = new_type.id
    
    return {"id_mapping": id_mapping, "slug_mapping": slug_mapping}


def _apply_about(payload):
    """Apply about section changes."""
    json_about = payload.get('about')
    if not json_about:
        return
    
    about, created = AboutMe.objects.get_or_create(
        id=1,
        defaults={
            'name': json_about.get('name', ''),
            'summary': json_about.get('summary', ''),
            'current_role': json_about.get('current_role', 'Software Developer'),
            'subtitle': json_about.get('subtitle', ''),
            'email': json_about.get('email', '')
        }
    )
    
    if not created:
        # Update existing (skip image fields)
        about.name = json_about.get('name', about.name)
        about.summary = json_about.get('summary', about.summary)
        about.current_role = json_about.get('current_role', about.current_role)
        about.subtitle = json_about.get('subtitle', about.subtitle)
        about.email = json_about.get('email', about.email)
        about.save()
    
    # Handle social links
    json_links = json_about.get('social_links', [])
    existing_links = list(about.social_links.all())
    
    # Clear existing and recreate (simpler than complex matching)
    about.social_links.all().delete()
    
    for json_link in json_links:
        SocialMediaLink.objects.create(
            about_me=about,
            platform=json_link.get('platform', ''),
            url=json_link.get('url', '')
        )


def _apply_projects(payload, category_mapping, skill_mapping):
    """Apply project changes."""
    json_projects = payload.get('projects', [])
    db_projects = list(Project.objects.all())
    
    for json_project in json_projects:
        match = _find_project_match(json_project, db_projects)
        
        # Resolve category
        json_category = json_project.get('category', {})
        category_id = category_mapping.get(json_category.get('id'))
        if not category_id:
            # Try to find by name
            try:
                category = Category.objects.get(name=json_category.get('name'))
                category_id = category.id
            except Category.DoesNotExist:
                category_id = None
        
        category = Category.objects.get(id=category_id) if category_id else None
        
        # Parse dates
        start_date = None
        end_date = None
        
        if json_project.get('start_date'):
            try:
                start_date = datetime.strptime(json_project['start_date'], '%Y-%m-%d').date()
            except (ValueError, TypeError):
                pass
        
        if json_project.get('end_date'):
            try:
                end_date = datetime.strptime(json_project['end_date'], '%Y-%m-%d').date()
            except (ValueError, TypeError):
                pass
        
        if match:
            # Update existing (skip images)
            match.title = json_project.get('title', match.title)
            match.caption = json_project.get('caption', match.caption)
            match.description = json_project.get('description', match.description)
            match.organisation = json_project.get('organisation', match.organisation)
            match.github_link = json_project.get('github_link', match.github_link)
            match.live_demo_link = json_project.get('live_demo_link', match.live_demo_link)
            match.display_order = json_project.get('display_order', match.display_order)
            
            if category:
                match.category = category
            if start_date:
                match.start_date = start_date
            if end_date:
                match.end_date = end_date
            
            match.save()
            project = match
        else:
            # Create new
            project = Project.objects.create(
                title=json_project.get('title', ''),
                caption=json_project.get('caption', ''),
                description=json_project.get('description', ''),
                category=category,
                organisation=json_project.get('organisation', ''),
                github_link=json_project.get('github_link', ''),
                live_demo_link=json_project.get('live_demo_link', ''),
                start_date=start_date or datetime.now().date(),
                end_date=end_date,
                display_order=json_project.get('display_order', 0)
            )
        
        # Handle skills M2M
        skill_ids = []
        for json_skill in json_project.get('skills_used', []):
            # Try ID mapping first, then name mapping
            skill_id = skill_mapping["id_mapping"].get(json_skill.get('id'))
            if not skill_id:
                skill_id = skill_mapping["name_mapping"].get(json_skill.get('name'))
            
            if skill_id:
                skill_ids.append(skill_id)
        
        project.skills_used.set(skill_ids)


def _apply_experiences(payload, skill_mapping):
    """Apply experience changes."""
    json_experiences = payload.get('experiences', [])
    db_experiences = list(WorkExperience.objects.all())
    
    for json_exp in json_experiences:
        match = _find_experience_match(json_exp, db_experiences)
        
        # Parse dates
        start_date = None
        end_date = None
        
        if json_exp.get('start_date'):
            try:
                start_date = datetime.strptime(json_exp['start_date'], '%Y-%m-%d').date()
            except (ValueError, TypeError):
                pass
        
        if json_exp.get('end_date'):
            try:
                end_date = datetime.strptime(json_exp['end_date'], '%Y-%m-%d').date()
            except (ValueError, TypeError):
                pass
        
        if match:
            # Update existing (skip company_logo)
            match.title = json_exp.get('title', match.title)
            match.company = json_exp.get('company', match.company)
            match.location = json_exp.get('location', match.location)
            match.website = json_exp.get('website', match.website)
            
            if start_date:
                match.start_date = start_date
            if end_date:
                match.end_date = end_date
            
            match.save()
            experience = match
        else:
            # Create new
            experience = WorkExperience.objects.create(
                title=json_exp.get('title', ''),
                company=json_exp.get('company', ''),
                location=json_exp.get('location', ''),
                website=json_exp.get('website', ''),
                start_date=start_date or datetime.now().date(),
                end_date=end_date
            )
        
        # Handle description points
        # Clear existing and recreate
        experience.description.clear()
        
        description_points = []
        for json_desc in json_exp.get('description', []):
            point_text = json_desc.get('point', '')
            if point_text:
                desc_point, created = DescriptionPoint.objects.get_or_create(
                    point=point_text
                )
                description_points.append(desc_point)
        
        experience.description.set(description_points)
        
        # Handle skills M2M
        skill_ids = []
        for json_skill in json_exp.get('skills_used', []):
            skill_id = skill_mapping["id_mapping"].get(json_skill.get('id'))
            if not skill_id:
                skill_id = skill_mapping["name_mapping"].get(json_skill.get('name'))
            
            if skill_id:
                skill_ids.append(skill_id)
        
        experience.skills_used.set(skill_ids)


def _apply_opensource(payload, contrib_type_mapping):
    """Apply opensource project changes."""
    json_opensource = payload.get('opensource', [])
    db_opensource = list(OpenSourceProject.objects.all())
    
    for json_os in json_opensource:
        match = _find_opensource_match(json_os, db_opensource)
        
        if match:
            # Update existing (skip image)
            match.name = json_os.get('name', match.name)
            match.caption = json_os.get('caption', match.caption)
            match.repo_link = json_os.get('repo_link', match.repo_link)
            match.save()
            os_project = match
        else:
            # Create new
            os_project = OpenSourceProject.objects.create(
                name=json_os.get('name', ''),
                caption=json_os.get('caption', 'Open Source Project'),
                repo_link=json_os.get('repo_link', '')
            )
        
        # Handle contributions
        # Clear existing and recreate
        os_project.contributions.all().delete()
        
        for json_contrib in json_os.get('contributions', []):
            # Resolve contribution type
            json_contrib_type = json_contrib.get('contribution_type', {})
            contrib_type_id = contrib_type_mapping["id_mapping"].get(json_contrib_type.get('id'))
            if not contrib_type_id:
                contrib_type_id = contrib_type_mapping["slug_mapping"].get(json_contrib_type.get('slug'))
            
            contrib_type = None
            if contrib_type_id:
                try:
                    contrib_type = ContributionType.objects.get(id=contrib_type_id)
                except ContributionType.DoesNotExist:
                    pass
            
            if contrib_type:
                OpenSourceContribution.objects.create(
                    open_source_project=os_project,
                    description=json_contrib.get('description', ''),
                    contribution_type=contrib_type,
                    pr_link=json_contrib.get('pr_link', '')
                )


def _apply_deletions(deletions):
    """Apply opt-in deletions in reverse FK order."""
    # Delete in reverse FK order to avoid constraint issues
    
    # Description points (no FKs pointing to them)
    if 'description_points' in deletions:
        DescriptionPoint.objects.filter(id__in=deletions['description_points']).delete()
    
    # Contributions
    if 'opensource_contributions' in deletions:
        OpenSourceContribution.objects.filter(id__in=deletions['opensource_contributions']).delete()
    
    # Main entities
    for entity_type in ['projects', 'experiences', 'opensource', 'categories', 'coding_skills', 'contribution_types']:
        if entity_type in deletions and deletions[entity_type]:
            model_map = {
                'projects': Project,
                'experiences': WorkExperience,
                'opensource': OpenSourceProject,
                'categories': Category,
                'coding_skills': CodingSkill,
                'contribution_types': ContributionType
            }
            
            model = model_map.get(entity_type)
            if model:
                model.objects.filter(id__in=deletions[entity_type]).delete()