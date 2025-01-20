class DifficultyEstimator:
    """Estimates recipe difficulty based on various factors"""
    
    COMPLEXITY_INDICATORS = [
        'marinate', 'knead', 'proof', 'temper', 'fold', 
        'whisk', 'blend', 'ferment', 'reduce'
    ]

    @staticmethod
    def estimate_difficulty(recipe):
        score = 0
        
        # Factor 1: Number of ingredients
        ingredients_count = len(recipe.ingredients.split('\n'))
        score += min(ingredients_count / 5, 3)  # Cap at 3 points
        
        # Factor 2: Cooking time
        score += min(recipe.cooking_time / 30, 2)  # Cap at 2 points
        
        # Factor 3: Complexity of instructions
        instructions = recipe.instructions.lower()
        complexity_count = sum(
            1 for indicator in DifficultyEstimator.COMPLEXITY_INDICATORS
            if indicator in instructions
        )
        score += min(complexity_count, 3)  # Cap at 3 points
        
        # Convert score to difficulty level
        if score < 3:
            return 'easy'
        elif score < 6:
            return 'medium'
        else:
            return 'hard'