from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Project, Category
from about.utils import export_portfolio_data


@receiver(post_save, sender=Project)
@receiver(post_delete, sender=Project)
@receiver(post_save, sender=Category)
@receiver(post_delete, sender=Category)
def export_data_on_project_change(sender, instance, **kwargs):
    """Automatically export portfolio data when Project or Category is updated or deleted"""
    export_portfolio_data()

