from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.http import JsonResponse, HttpResponseBadRequest
from django.template.defaultfilters import slugify
from django.core.paginator import Paginator
from django.db.models import Q, Avg, Count
from datetime import timedelta
from .models import Recipe, Category, Review, UserInteraction, Like, Comment
from .forms import RecipeForm, ReviewForm, CommentForm, RecipeSearchForm
from django.contrib import messages
from django.db import IntegrityError

def home(request):
    """Landing page view that redirects logged-in users to recipes page."""
    if request.user.is_authenticated:
        return redirect('recipe_list')
        
    # Get 6 featured recipes for non-logged in users
    featured_recipes = Recipe.objects.filter(is_featured=True)[:6]
    
    return render(request, 'recipes/home.html', {
        'featured_recipes': featured_recipes,
    })

def recipe_list(request):
    form = RecipeSearchForm(request.GET)
    recipes = Recipe.objects.all()

    if form.is_valid():
        # Text search
        if query := form.cleaned_data.get('query'):
            recipes = recipes.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(ingredients__icontains=query)
            )

        # Category filter
        if category := form.cleaned_data.get('category'):
            recipes = recipes.filter(category=category)

        # Difficulty filter
        if difficulty := form.cleaned_data.get('difficulty'):
            recipes = recipes.filter(difficulty=difficulty)

        # Dietary preferences filter
        if dietary := form.cleaned_data.get('dietary'):
            recipes = recipes.filter(dietary_preferences=dietary)

        # Cooking time filter
        if max_time := form.cleaned_data.get('max_cooking_time'):
            recipes = recipes.filter(total_time__lte=int(max_time))

        # Image filter
        if form.cleaned_data.get('has_image'):
            recipes = recipes.exclude(image='')

        # Rating filter
        if min_rating := form.cleaned_data.get('min_rating'):
            recipes = recipes.annotate(
                avg_rating=Avg('reviews__rating')
            ).filter(avg_rating__gte=float(min_rating))

        # Sorting
        sort_by = form.cleaned_data.get('sort_by', 'newest')
        if sort_by == 'newest':
            recipes = recipes.order_by('-created_at')
        elif sort_by == 'oldest':
            recipes = recipes.order_by('created_at')
        elif sort_by == 'popular':
            recipes = recipes.annotate(
                view_count=Count('userinteraction', filter=Q(userinteraction__interaction_type='view'))
            ).order_by('-view_count')
        elif sort_by == 'rating':
            recipes = recipes.annotate(
                avg_rating=Avg('reviews__rating')
            ).order_by('-avg_rating')
        elif sort_by == 'cooking_time':
            recipes = recipes.order_by('cooking_time')

    # Annotate with average rating for display
    recipes = recipes.annotate(
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews')
    )

    featured_recipes = Recipe.objects.filter(is_featured=True)[:3]
    categories = Category.objects.all()

    context = {
        'recipes': recipes,
        'featured_recipes': featured_recipes,
        'categories': categories,
        'form': form
    }
    return render(request, 'recipes/recipe_list.html', context)

@login_required
def submit_recipe(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                recipe = form.save(commit=False)
                recipe.created_by = request.user
                
                # Calculate total time
                recipe.total_time = recipe.cooking_time + recipe.prep_time
                
                # Generate unique slug
                base_slug = slugify(recipe.title)
                unique_slug = base_slug
                counter = 1
                while Recipe.objects.filter(slug=unique_slug).exists():
                    unique_slug = f"{base_slug}-{counter}"
                    counter += 1
                recipe.slug = unique_slug
                
                recipe.save()
                messages.success(request, 'Your recipe has been submitted successfully!')
                return redirect('recipe_detail', slug=recipe.slug)
            except Exception as e:
                messages.error(request, 'An error occurred while saving your recipe. Please try again.')
                print(f"Error saving recipe: {str(e)}")  # For debugging
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field.title()}: {error}")
    else:
        form = RecipeForm()

    categories = Category.objects.all()
    return render(request, 'recipes/submit_recipe.html', {
        'form': form,
        'categories': categories,
    })

@login_required
def add_review(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.recipe = recipe
            review.user = request.user
            review.save()
            messages.success(request, 'Your review has been added successfully!')
        else:
            messages.error(request, 'There was an error with your review. Please try again.')
    
    return redirect('recipe_detail', slug=slug)

@login_required
def toggle_favorite(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug)
    interaction, created = UserInteraction.objects.get_or_create(
        user=request.user,
        recipe=recipe,
        defaults={'interaction_type': 'favorite'}
    )
    
    if not created:
        interaction.delete()
        is_favorite = False
    else:
        is_favorite = True
    
    return JsonResponse({'is_favorite': is_favorite})

@login_required
def recommended_recipes(request):
    """View for showing personalized recipe recommendations."""
    # Get user's favorite recipes to understand their preferences
    favorite_recipes = Recipe.objects.filter(
        userinteraction__user=request.user,
        userinteraction__interaction_type='save'
    )
    
    # Get categories from user's favorites
    favorite_categories = favorite_recipes.values_list('category', flat=True).distinct()
    
    # Find similar recipes based on categories
    recommended = Recipe.objects.filter(category__in=favorite_categories)\
        .exclude(userinteraction__user=request.user, userinteraction__interaction_type='save')\
        .exclude(created_by=request.user)\
        .annotate(avg_rating=Avg('review__rating'))\
        .order_by('-avg_rating', '-created_at')[:12]
    
    # If user has no favorites yet, show highest rated recipes
    if not recommended:
        recommended = Recipe.objects.annotate(
            avg_rating=Avg('review__rating')
        ).order_by('-avg_rating', '-created_at')[:12]
    
    context = {
        'recipes': recommended,
        'title': 'Recommended Recipes'
    }
    return render(request, 'recipes/recipe_list.html', context)

def similar_recipes(request, recipe_id):
    """View for showing similar recipes based on a given recipe."""
    # Get the source recipe
    source_recipe = get_object_or_404(Recipe, id=recipe_id)
    
    # Find similar recipes based on category and cooking time
    similar = Recipe.objects.filter(
        Q(category=source_recipe.category) |
        Q(cooking_time__range=(
            source_recipe.cooking_time - timedelta(minutes=15),
            source_recipe.cooking_time + timedelta(minutes=15)
        ))
    ).exclude(
        id=recipe_id
    ).annotate(
        avg_rating=Avg('review__rating')
    ).order_by('-avg_rating', '-created_at')[:6]
    
    context = {
        'recipes': similar,
        'source_recipe': source_recipe,
        'title': f'Similar Recipes to {source_recipe.title}'
    }
    return render(request, 'recipes/recipe_list.html', context)

@login_required
def recipe_detail(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug)
    reviews = Review.objects.filter(recipe=recipe)
    comments = Comment.objects.filter(recipe=recipe, parent=None)
    
    # Check if the recipe is favorited by the current user
    is_favorite = False
    if request.user.is_authenticated:
        is_favorite = UserInteraction.objects.filter(
            user=request.user,
            recipe=recipe,
            interaction_type='favorite'
        ).exists()
    
    context = {
        'recipe': recipe,
        'reviews': reviews,
        'comments': comments,
        'is_favorite': is_favorite,
    }
    
    # Track view interaction
    if request.user.is_authenticated:
        UserInteraction.objects.get_or_create(
            user=request.user,
            recipe=recipe,
            interaction_type='view'
        )
    
    return render(request, 'recipes/recipe_detail.html', context)

@login_required
def track_interaction(request, recipe_id):
    """Track user interactions with recipes (view, save, share)."""
    if request.method == 'POST':
        interaction_type = request.POST.get('interaction_type')
        if interaction_type in ['view', 'save', 'share']:
            recipe = get_object_or_404(Recipe, id=recipe_id)
            
            # Create or update the interaction
            UserInteraction.objects.get_or_create(
                user=request.user,
                recipe=recipe,
                interaction_type=interaction_type
            )
            
            if interaction_type == 'save':
                messages.success(request, f'Recipe "{recipe.title}" has been saved!')
            elif interaction_type == 'share':
                messages.success(request, f'Recipe "{recipe.title}" has been shared!')
            
            # Return JSON response for AJAX calls
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'success'})
            
            # Redirect back to recipe detail page for normal requests
            return redirect('recipe_detail', slug=recipe.slug)
    
    return HttpResponseBadRequest('Invalid request')

@login_required
def toggle_recipe_like(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    like, created = Like.objects.get_or_create(user=request.user, recipe=recipe)
    
    if not created:
        like.delete()
        messages.success(request, 'Recipe removed from favorites!')
    else:
        messages.success(request, 'Recipe added to favorites!')
    
    return redirect('recipe_detail', slug=recipe.slug)

class SubmitRecipeView(LoginRequiredMixin, CreateView):
    model = Recipe
    form_class = RecipeForm
    template_name = 'recipes/submit_recipe.html'
    success_url = reverse_lazy('recipe_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Your recipe has been submitted successfully!')
        return super().form_valid(form)
