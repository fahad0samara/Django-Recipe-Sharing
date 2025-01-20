from django.db.models import Q
from textblob import TextBlob

class SimilarityCalculator:
    @staticmethod
    def calculate_ingredient_similarity(recipe1, recipe2):
        """Calculate similarity score based on common ingredients"""
        ingredients1 = set(TextBlob(recipe1.ingredients).noun_phrases)
        ingredients2 = set(TextBlob(recipe2.ingredients).noun_phrases)
        common = len(ingredients1.intersection(ingredients2))
        total = len(ingredients1.union(ingredients2))
        return common / total if total > 0 else 0

    @staticmethod
    def get_similar_by_ingredients(recipe, limit=5):
        """Find recipes with similar ingredients"""
        all_recipes = Recipe.objects.exclude(id=recipe.id)
        scored_recipes = [
            (r, SimilarityCalculator.calculate_ingredient_similarity(recipe, r))
            for r in all_recipes
        ]
        return sorted(scored_recipes, key=lambda x: x[1], reverse=True)[:limit]