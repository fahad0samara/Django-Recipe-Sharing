from django.urls import path
from . import views

urlpatterns = [
    # Landing page and recipe views
    path('', views.home, name='home'),  # Landing page for non-logged in users
    path('recipes/', views.recipe_list, name='recipe_list'),  # Recipe list for logged in users
    path('recipe/<slug:slug>/', views.recipe_detail, name='recipe_detail'),
    path('recipe/<slug:slug>/toggle-favorite/', views.toggle_favorite, name='toggle_favorite'),
    path('submit-recipe/', views.SubmitRecipeView.as_view(), name='submit_recipe'),
    path('recipe/<slug:slug>/review/', views.add_review, name='add_review'),
    
    # Recommendation views
    path('recommendations/', views.recommended_recipes, name='recommended_recipes'),
    path('similar-recipes/<int:recipe_id>/', views.similar_recipes, name='similar_recipes'),
    path('track-interaction/<int:recipe_id>/', views.track_interaction, name='track_interaction'),
]