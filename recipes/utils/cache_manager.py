from django.core.cache import cache
from django.conf import settings

class CacheManager:
    """Handles caching for frequently accessed recipe data"""
    
    CACHE_TIMEOUT = 3600  # 1 hour
    
    @staticmethod
    def get_trending_recipes(force_refresh=False):
        cache_key = 'trending_recipes'
        if not force_refresh:
            cached = cache.get(cache_key)
            if cached:
                return cached
                
        recipes = TrendingAnalyzer.get_trending_recipes()
        cache.set(cache_key, recipes, CacheManager.CACHE_TIMEOUT)
        return recipes
        
    @staticmethod
    def invalidate_recipe_cache(recipe_id):
        """Invalidate cache when recipe is updated"""
        cache_keys = [
            f'recipe_{recipe_id}',
            'trending_recipes',
            'featured_recipes'
        ]
        cache.delete_many(cache_keys)