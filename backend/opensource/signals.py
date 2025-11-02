from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import OpenSourceProject
from about.utils import export_portfolio_data


@receiver(post_save, sender=OpenSourceProject)
@receiver(post_delete, sender=OpenSourceProject)
def export_data_on_opensource_change(sender, instance, **kwargs):
    """Automatically export portfolio data when OpenSourceProject is updated or deleted"""
    export_portfolio_data()

