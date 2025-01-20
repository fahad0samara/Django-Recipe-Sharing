from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe

class MealPlan(models.Model):
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans')
    date = models.DateField()
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    notes = models.TextField(blank=True)
    servings = models.PositiveIntegerField(default=1)
    
    class Meta:
        ordering = ['date', 'meal_type']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]