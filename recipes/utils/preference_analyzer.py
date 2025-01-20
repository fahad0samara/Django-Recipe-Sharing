from collections import Counter
from django.db.models import Count

class PreferenceAnalyzer:
    @staticmethod
    def analyze_user_history(user):
        """Analyze user's recipe history to determine preferences"""
        interactions = UserInteraction.objects.filter(
            user=user
        ).select_related('recipe')
        
        # Analyze categories
        categories = Counter(
            interaction.recipe.category.name 
            for interaction in interactions
        )
        
        # Analyze cooking times
        cooking_times = [
            interaction.recipe.cooking_time 
            for interaction in interactions
        ]
        avg_time = sum(cooking_times) / len(cooking_times) if cooking_times else 0
        
        return {
            'preferred_categories': categories.most_common(3),
            'avg_cooking_time': avg_time,
            'interaction_count': len(interactions)
        }