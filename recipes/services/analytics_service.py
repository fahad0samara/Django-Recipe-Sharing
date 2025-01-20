from ..utils.analytics_manager import AnalyticsManager
from ..utils.performance_monitor import PerformanceMonitor

class AnalyticsService:
    """Service for handling recipe analytics"""
    
    @staticmethod
    @PerformanceMonitor.track_query_performance
    def get_recipe_performance(recipe_id):
        """Get recipe performance metrics"""
        return AnalyticsManager.get_recipe_insights(recipe_id)
    
    @staticmethod
    def get_trending_categories():
        """Get trending recipe categories"""
        return Category.objects.annotate(
            view_count=Count('recipe__userinteraction',
                           filter=Q(recipe__userinteraction__interaction_type='view'))
        ).order_by('-view_count')[:5]
    
    @staticmethod
    def get_user_preferences(user):
        """Analyze user preferences"""
        interactions = UserInteraction.objects.filter(
            user=user
        ).select_related('recipe__category')
        
        categories = {}
        for interaction in interactions:
            category = interaction.recipe.category
            categories[category.name] = categories.get(category.name, 0) + 1
            
        return sorted(categories.items(), key=lambda x: x[1], reverse=True)