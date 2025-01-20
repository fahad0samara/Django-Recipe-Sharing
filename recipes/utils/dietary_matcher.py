class DietaryMatcher:
    DIETARY_PATTERNS = {
        'vegetarian': ['meat', 'fish', 'chicken', 'beef'],
        'vegan': ['meat', 'fish', 'egg', 'milk', 'cheese', 'honey'],
        'gluten_free': ['wheat', 'barley', 'rye', 'flour'],
        'dairy_free': ['milk', 'cheese', 'cream', 'yogurt']
    }

    @staticmethod
    def filter_recipes_by_diet(recipes, dietary_restrictions):
        """Filter recipes based on dietary restrictions"""
        filtered_recipes = []
        
        for recipe in recipes:
            ingredients_lower = recipe.ingredients.lower()
            matches_diet = True
            
            for restriction in dietary_restrictions:
                if restriction in DietaryMatcher.DIETARY_PATTERNS:
                    excluded_ingredients = DietaryMatcher.DIETARY_PATTERNS[restriction]
                    if any(ingredient in ingredients_lower 
                          for ingredient in excluded_ingredients):
                        matches_diet = False
                        break
            
            if matches_diet:
                filtered_recipes.append(recipe)
                
        return filtered_recipes