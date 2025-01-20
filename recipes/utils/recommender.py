from collections import Counter
from django.db.models import Count, Avg
from ..models import Recipe, UserInteraction, UserPreference

class RecipeRecommender:
    @staticmethod
    def get_personalized_recommendations(user, limit=10):
        """Get personalized recipe recommendations for a user"""
        # Get user's favorite categories
        try:
            preferences = UserPreference.objects.get(user=user)
            favorite_categories = preferences.favorite_categories.all()
        except UserPreference.DoesNotExist:
            favorite_categories = []

        # Get user's recent interactions
        recent_interactions = UserInteraction.objects.filter(
            user=user
        ).select_related('recipe').order_by('-created_at')[:20]

        # Get recipes from favorite categories
        category_recommendations = Recipe.objects.filter(
            category__in=favorite_categories
        ).exclude(
            userinteraction__user=user
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            interaction_count=Count('userinteraction')
        ).order_by('-avg_rating', '-interaction_count')[:limit]

        # Get collaborative recommendations
        collaborative_recommendations = RecipeRecommender._get_collaborative_recommendations(
            user, 
            [interaction.recipe for interaction in recent_interactions],
            limit
        )

        # Combine and deduplicate recommendations
        recommendations = list(category_recommendations) + list(collaborative_recommendations)
        seen_ids = set()
        unique_recommendations = []
        
        for recipe in recommendations:
            if recipe.id not in seen_ids:
                seen_ids.add(recipe.id)
                unique_recommendations.append(recipe)
                if len(unique_recommendations) >= limit:
                    break

        return unique_recommendations

    @staticmethod
    def _get_collaborative_recommendations(user, user_recipes, limit=5):
        """Get recommendations based on similar users' preferences"""
        # Find users who interacted with similar recipes
        similar_users = UserInteraction.objects.filter(
            recipe__in=user_recipes
        ).exclude(
            user=user
        ).values('user').annotate(
            common_interactions=Count('id')
        ).order_by('-common_interactions')[:10]

        # Get recipes that similar users interacted with
        similar_user_ids = [u['user'] for u in similar_users]
        return Recipe.objects.filter(
            userinteraction__user__in=similar_user_ids
        ).exclude(
            userinteraction__user=user
        ).annotate(
            interaction_count=Count('userinteraction')
        ).order_by('-interaction_count')[:limit]