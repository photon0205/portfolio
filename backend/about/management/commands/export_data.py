from django.core.management.base import BaseCommand
from about.utils import export_portfolio_data


class Command(BaseCommand):
    help = 'Export portfolio data to JSON files for static serving'

    def handle(self, *args, **options):
        self.stdout.write('Starting portfolio data export...\n')
        success = export_portfolio_data()
        if success:
            self.stdout.write(self.style.SUCCESS('\nExport completed successfully!'))
        else:
            self.stdout.write(self.style.ERROR('\nExport failed!'))

