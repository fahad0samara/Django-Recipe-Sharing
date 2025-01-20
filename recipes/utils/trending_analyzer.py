from django.utils import timezone
from django.db.models import Count

class TrendingAnalyzer:
    @staticmethod
    def get_trending_recipes(days=7, limit=5):
        """Get recipes trending in the last few days"""
        recent_cutoff = timezone.now() - timezone.timedelta(days=days)
        
        return Recipe.objects.filter(
            userinteraction__created_at__gte=recent_cutoff
        ).annotate(
            interaction_count=Count('userinteraction')
        ).order_by('-interaction_count')[:limit]

    @staticmethod
    def get_trending_categories(days=7, limit=3):
        """Get trending recipe categories"""
        recent_cutoff = timezone.now() - timezone.timedelta(days=days)
        
        return Category.objects.filter(
            recipe__userinteraction__created_at__gte=recent_cutoff
        ).annotate(
            recipe_count=Count('recipe')
        ).order_by('-recipe_count')[:limit]