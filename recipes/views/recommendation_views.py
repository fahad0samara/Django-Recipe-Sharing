from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from ..models import Recipe, UserInteraction
from ..services.recommendation_service import RecommendationService

@login_required
def recommended_recipes(request):
    """View personalized recipe recommendations"""
    recommendations = RecommendationService.get_personalized_recommendations(
        request.user
    )
    return render(request, 'recipes/recommendations.html', {
        'recipes': recommendations
    })

@login_required
def similar_recipes(request, recipe_id):
    """View similar recipes"""
    similar = RecommendationService.get_similar_recipes(recipe_id)
    return render(request, 'recipes/similar_recipes.html', {
        'recipes': similar
    })

@login_required
def track_interaction(request, recipe_id):
    """Track user interaction with a recipe"""
    recipe = get_object_or_404(Recipe, id=recipe_id)
    interaction_type = request.POST.get('type', 'view')
    
    UserInteraction.objects.create(
        user=request.user,
        recipe=recipe,
        interaction_type=interaction_type
    )
    
    return JsonResponse({'status': 'success'})