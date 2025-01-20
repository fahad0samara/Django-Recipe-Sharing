from django.db.models import Prefetch

class QueryOptimizer:
    """Optimizes database queries for recipes"""
    
    @staticmethod
    def get_recipe_with_related(recipe_id):
        """Get recipe with optimized related data loading"""
        return Recipe.objects.select_related(
            'author', 
            'category'
        ).prefetch_related(
            Prefetch('reviews', queryset=Review.objects.select_related('user')),
            'tags'
        ).get(id=recipe_id)
    
    @staticmethod
    def get_user_feed(user, limit=10):
        """Get optimized user feed"""
        return Recipe.objects.select_related(
            'author', 
            'category'
        ).prefetch_related(
            'tags'
        ).filter(
            is_published=True
        ).order_by('-created_at')[:limit]