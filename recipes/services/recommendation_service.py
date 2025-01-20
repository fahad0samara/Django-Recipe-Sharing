from django.db.models import Q, Count, Avg
from ..models import UserPreference, Recipe
from ..utils.query_optimizer import QueryOptimizer

class RecommendationService:
    @staticmethod
    def get_personalized_recommendations(user, limit=10):
        """Get personalized recipe recommendations"""
        try:
            preferences = UserPreference.objects.get(user=user)
        except UserPreference.DoesNotExist:
            # Return default recommendations if no preferences exist
            return Recipe.objects.all().order_by('-created_at')[:limit]
        
        # Base query with optimization
        base_query = QueryOptimizer.get_user_feed(user)
        
        # Apply dietary restrictions
        if preferences.dietary_restrictions:
            base_query = base_query.exclude(
                tags__name__in=preferences.dietary_restrictions
            )
        
        # Consider cooking skill
        difficulty_map = {
            'beginner': ['easy'],
            'intermediate': ['easy', 'medium'],
            'advanced': ['easy', 'medium', 'hard']
        }
        base_query = base_query.filter(
            difficulty__in=difficulty_map[preferences.cooking_skill]
        )
        
        # Order by rating and creation date
        return base_query.annotate(
            avg_rating=Avg('reviews__rating')
        ).order_by('-avg_rating', '-created_at')[:limit]
    
    @staticmethod
    def get_similar_recipes(recipe_id, limit=5):
        """Get similar recipes based on tags and categories"""
        recipe = Recipe.objects.get(id=recipe_id)
        return Recipe.objects.filter(
            Q(category=recipe.category) | 
            Q(tags__in=recipe.tags.all())
        ).exclude(
            id=recipe_id
        ).annotate(
            common_tags=Count('tags')
        ).order_by('-common_tags')[:limit]