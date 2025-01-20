from django.core.management.base import BaseCommand
from recipes.models import Category

class Command(BaseCommand):
    help = 'Creates default recipe categories'

    def handle(self, *args, **kwargs):
        default_categories = [
            'Breakfast',
            'Lunch',
            'Dinner',
            'Appetizers',
            'Soups',
            'Salads',
            'Main Dishes',
            'Side Dishes',
            'Desserts',
            'Baking',
            'Beverages',
            'Snacks',
            'Healthy',
            'Vegetarian',
            'Vegan',
            'Gluten-Free',
        ]

        for category_name in default_categories:
            Category.objects.get_or_create(name=category_name)
            self.stdout.write(self.style.SUCCESS(f'Created category: {category_name}'))
