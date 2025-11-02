from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import WorkExperience
from about.utils import export_portfolio_data


@receiver(post_save, sender=WorkExperience)
@receiver(post_delete, sender=WorkExperience)
def export_data_on_experience_change(sender, instance, **kwargs):
    """Automatically export portfolio data when WorkExperience is updated or deleted"""
    export_portfolio_data()

