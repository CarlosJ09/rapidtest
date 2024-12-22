from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from rapidtest.models import Category


class Command(BaseCommand):
    help = "Create default groups and categories"

    def handle(self, *args, **kwargs):
        groups = ["Instructor", "Student", "Admin"]
        for group_name in groups:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Group '{group_name}' created."))
            else:
                self.stdout.write(
                    self.style.WARNING(f"Group '{group_name}' already exists.")
                )

        default_categories = ["Math", "Science", "History", "Literature", "Programming"]
        for category_name in default_categories:
            category, created = Category.objects.get_or_create(name=category_name)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Category '{category_name}' created.")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"Category '{category_name}' already exists.")
                )

        self.stdout.write(self.style.SUCCESS("Default data setup complete."))
