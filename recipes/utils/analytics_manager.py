from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta

class AnalyticsManager:
    """Manages recipe analytics and insights"""
    
    @staticmethod
    def get_recipe_insights(recipe_id):
        """Get comprehensive insights for a recipe"""
        recipe = Recipe.objects.get(id=recipe_id)
        views = UserInteraction.objects.filter(
            recipe=recipe,
            interaction_type='view'
        ).count()
        
        return {
            'total_views': views,
            'avg_rating': recipe.reviews.aggregate(Avg('rating'))['rating__avg'],
            'save_rate': AnalyticsManager._calculate_save_rate(recipe),
            'completion_rate': AnalyticsManager._calculate_completion_rate(recipe)
        }
    
    @staticmethod
    def _calculate_save_rate(recipe):
        """Calculate recipe save rate"""
        views = UserInteraction.objects.filter(
            recipe=recipe,
            interaction_type='view'
        ).count()
        saves = UserInteraction.objects.filter(
            recipe=recipe,
            interaction_type='save'
        ).count()
        return (saves / views * 100) if views > 0 else 0