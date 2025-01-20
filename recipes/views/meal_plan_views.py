from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from ..services.meal_plan_service import MealPlanService
from ..models.meal_plan import MealPlan

@login_required
def meal_plan_view(request):
    weekly_plan = MealPlanService.get_weekly_plan(request.user)
    return render(request, 'recipes/meal_plan.html', {
        'meal_plan': weekly_plan
    })

@login_required
def add_to_meal_plan(request):
    if request.method == 'POST':
        try:
            meal_plan = MealPlan.objects.create(
                user=request.user,
                recipe_id=request.POST['recipe_id'],
                date=request.POST['date'],
                meal_type=request.POST['meal_type'],
                servings=request.POST.get('servings', 1)
            )
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})