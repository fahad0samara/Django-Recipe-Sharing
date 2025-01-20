from django.utils import timezone
from datetime import datetime

class TimeBasedRecommender:
    """Recommends recipes based on time of day and meal types"""
    
    MEAL_TIMES = {
        'breakfast': (5, 10),    # 5 AM - 10 AM
        'lunch': (11, 14),       # 11 AM - 2 PM
        'dinner': (17, 21),      # 5 PM - 9 PM
        'snack': (0, 23)         # Any time
    }

    @staticmethod
    def get_current_meal_type():
        current_hour = datetime.now().hour
        return next(
            (meal for meal, (start, end) in TimeBasedRecommender.MEAL_TIMES.items()
             if start <= current_hour <= end),
            'snack'
        )

    @staticmethod
    def get_recommendations(limit=5):
        """Get recipes appropriate for current time of day"""
        meal_type = TimeBasedRecommender.get_current_meal_type()
        return Recipe.objects.filter(
            category__name__icontains=meal_type
        ).order_by('-rating_avg')[:limit]