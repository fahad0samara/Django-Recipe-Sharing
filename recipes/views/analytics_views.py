from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from ..services.analytics_service import AnalyticsService

@login_required
def recipe_analytics(request, recipe_id):
    """View recipe analytics"""
    analytics = AnalyticsService.get_recipe_performance(recipe_id)
    return render(request, 'recipes/analytics/recipe_analytics.html', {
        'analytics': analytics
    })

@login_required
def user_insights(request):
    """View user preferences and insights"""
    preferences = AnalyticsService.get_user_preferences(request.user)
    trending = AnalyticsService.get_trending_categories()
    return render(request, 'recipes/analytics/user_insights.html', {
        'preferences': preferences,
        'trending_categories': trending
    })