from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from ..services.collection_service import CollectionService

@login_required
def collection_list(request):
    collections = CollectionService.get_user_collections(request.user)
    public_collections = CollectionService.get_public_collections()
    return render(request, 'recipes/collections/list.html', {
        'collections': collections,
        'public_collections': public_collections
    })

@login_required
def add_to_collection(request):
    if request.method == 'POST':
        collection_id = request.POST.get('collection_id')
        recipe_id = request.POST.get('recipe_id')
        try:
            CollectionService.add_recipe_to_collection(collection_id, recipe_id)
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})