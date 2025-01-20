from datetime import datetime, timedelta
from ..models.meal_plan import MealPlan
from ..utils.query_optimizer import QueryOptimizer

class MealPlanService:
    @staticmethod
    def get_weekly_plan(user, start_date=None):
        """Get meal plan for a week"""
        if not start_date:
            start_date = datetime.now().date()
        
        end_date = start_date + timedelta(days=7)
        return MealPlan.objects.filter(
            user=user,
            date__range=[start_date, end_date]
        ).select_related('recipe')
    
    @staticmethod
    def generate_shopping_list(user, start_date, end_date):
        """Generate shopping list for meal plan period"""
        meal_plans = MealPlan.objects.filter(
            user=user,
            date__range=[start_date, end_date]
        ).select_related('recipe')
        
        ingredients = {}
        for plan in meal_plans:
            recipe_ingredients = plan.recipe.parse_ingredients()
            for ingredient in recipe_ingredients:
                if ingredient['item'] in ingredients:
                    ingredients[ingredient['item']]['amount'] += (
                        ingredient['amount'] * plan.servings
                    )
                else:
                    ingredients[ingredient['item']] = {
                        'amount': ingredient['amount'] * plan.servings,
                        'unit': ingredient['unit']
                    }
        
        return ingredients