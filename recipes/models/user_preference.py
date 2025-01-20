from django.db import models
from django.contrib.auth.models import User

class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dietary_restrictions = models.JSONField(default=dict)
    cuisine_preferences = models.JSONField(default=list)
    cooking_skill = models.CharField(
        max_length=20,
        choices=[('beginner', 'Beginner'), 
                ('intermediate', 'Intermediate'),
                ('advanced', 'Advanced')],
        default='beginner'
    )
    
    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]