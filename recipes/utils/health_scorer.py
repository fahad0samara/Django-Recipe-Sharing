class HealthScorer:
    """Scores recipes based on nutritional value and healthiness"""
    
    HEALTHY_INGREDIENTS = [
        'vegetables', 'fruits', 'lean', 'fish', 'nuts', 
        'seeds', 'whole grain', 'olive oil'
    ]
    
    UNHEALTHY_INDICATORS = [
        'fried', 'sugar', 'processed', 'cream', 'butter',
        'bacon', 'sausage'
    ]

    @staticmethod
    def calculate_health_score(recipe):
        """Calculate a health score from 0-100"""
        ingredients_lower = recipe.ingredients.lower()
        
        # Calculate healthy ingredients score
        healthy_count = sum(
            1 for item in HealthScorer.HEALTHY_INGREDIENTS
            if item in ingredients_lower
        )
        
        # Calculate unhealthy indicators score
        unhealthy_count = sum(
            1 for item in HealthScorer.UNHEALTHY_INDICATORS
            if item in ingredients_lower
        )
        
        # Base score (50 points)
        score = 50
        
        # Add points for healthy ingredients (up to 30 points)
        score += min(healthy_count * 10, 30)
        
        # Subtract points for unhealthy indicators (up to 30 points)
        score -= min(unhealthy_count * 10, 30)
        
        return max(0, min(score, 100))  # Ensure score is between 0-100