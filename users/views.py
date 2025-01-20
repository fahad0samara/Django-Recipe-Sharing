from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Count
from .forms import UserRegisterForm, UserUpdateForm
from recipes.models import Recipe, Review, UserInteraction

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}! You can now log in.')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})

@login_required
def profile(request):
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, request.FILES, instance=request.user)
        if u_form.is_valid():
            u_form.save()
            messages.success(request, f'Your account has been updated!')
            return redirect('profile')
    else:
        u_form = UserUpdateForm(instance=request.user)

    # Get user's recipes
    user_recipes = Recipe.objects.filter(created_by=request.user).order_by('-created_at')

    # Get favorite recipes using UserInteraction
    favorite_recipes = Recipe.objects.filter(
        userinteraction__user=request.user,
        userinteraction__interaction_type='save'
    ).order_by('-userinteraction__created_at')[:5]

    # Calculate user stats
    total_reviews = Review.objects.filter(recipe__created_by=request.user).count()
    total_likes = UserInteraction.objects.filter(
        recipe__created_by=request.user,
        interaction_type='save'
    ).count()
    avg_rating = Review.objects.filter(recipe__created_by=request.user).aggregate(
        avg_rating=Avg('rating')
    )['avg_rating']

    # Get recent activities
    recent_activities = []
    
    # Add recipe creations
    recent_recipes = user_recipes[:5]
    for recipe in recent_recipes:
        recent_activities.append({
            'description': f'Created recipe "{recipe.title}"',
            'created_at': recipe.created_at
        })
    
    # Add reviews given
    recent_reviews = Review.objects.filter(user=request.user).order_by('-created_at')[:5]
    for review in recent_reviews:
        recent_activities.append({
            'description': f'Reviewed "{review.recipe.title}"',
            'created_at': review.created_at
        })
    
    # Add recipe interactions
    recent_interactions = UserInteraction.objects.filter(user=request.user).order_by('-created_at')[:5]
    for interaction in recent_interactions:
        action = interaction.interaction_type.title()
        recent_activities.append({
            'description': f'{action} recipe "{interaction.recipe.title}"',
            'created_at': interaction.created_at
        })
    
    # Sort activities by date
    recent_activities.sort(key=lambda x: x['created_at'], reverse=True)
    recent_activities = recent_activities[:10]  # Keep only the 10 most recent activities

    context = {
        'u_form': u_form,
        'user_recipes': user_recipes,
        'favorite_recipes': favorite_recipes,
        'total_reviews': total_reviews,
        'total_likes': total_likes,
        'avg_rating': round(avg_rating, 1) if avg_rating else 0.0,
        'recent_activities': recent_activities
    }
    return render(request, 'users/profile.html', context)
