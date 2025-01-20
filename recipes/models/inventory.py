from django.db import models
from django.contrib.auth.models import User

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50)
    shelf_life_days = models.PositiveIntegerField(null=True, blank=True)

class InventoryItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=20)
    expiry_date = models.DateField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'ingredient']),
        ]