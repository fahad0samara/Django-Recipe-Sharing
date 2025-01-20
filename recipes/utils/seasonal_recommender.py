from datetime import datetime

class SeasonalRecommender:
    SEASONS = {
        'winter': [12, 1, 2],
        'spring': [3, 4, 5],
        'summer': [6, 7, 8],
        'fall': [9, 10, 11]
    }

    @staticmethod
    def get_current_season():
        current_month = datetime.now().month
        return next(
            season for season, months in SeasonalRecommender.SEASONS.items()
            if current_month in months
        )

    @staticmethod
    def get_seasonal_recommendations(limit=5):
        """Get recipes appropriate for current season"""
        season = SeasonalRecommender.get_current_season()
        return Recipe.objects.filter(
            Q(title__icontains=season) |
            Q(description__icontains=season)
        ).order_by('-rating_avg')[:limit]