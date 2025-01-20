from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from ..models import Recipe, Category
from ..forms import RecipeForm
from ..utils.recipe_utils import process_recipe_image

def home(request):
    featured_recipes = Recipe.objects.filter(is_featured=True)[:6]
    categories = Category.objects.all()
    return render(request, 'recipes/home.html', {
        'featured_recipes': featured_recipes,
        'categories': categories
    })

def recipe_list(request):
    recipes = Recipe.objects.all()
    query = request.GET.get('q')
    category = request.GET.get('category')
    
    if query:
        recipes = recipes.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )
    
    if category:
        recipes = recipes.filter(category__slug=category)
    
    return render(request, 'recipes/recipe_list.html', {'recipes': recipes})

def recipe_detail(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug)
    reviews = recipe.reviews.all()
    return render(request, 'recipes/recipe_detail.html', {
        'recipe': recipe,
        'reviews': reviews
    })

@login_required
def submit_recipe(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST, request.FILES)
        if form.is_valid():
            recipe = form.save(commit=False)
            recipe.author = request.user
            recipe.image = process_recipe_image(request.FILES['image'])
            recipe.save()
            return redirect('recipe_detail', slug=recipe.slug)
    else:
        form = RecipeForm()
    return render(request, 'recipes/submit_recipe.html', {'form': form})