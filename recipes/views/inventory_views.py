from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from ..services.inventory_service import InventoryService

@login_required
def inventory_view(request):
    inventory = InventoryService.get_user_inventory(request.user)
    expiring_soon = InventoryService.check_expiring_items(request.user)
    return render(request, 'recipes/inventory/view.html', {
        'inventory': inventory,
        'expiring_soon': expiring_soon
    })

@login_required
def update_inventory(request):
    if request.method == 'POST':
        item_id = request.POST.get('item_id')
        quantity = request.POST.get('quantity')
        try:
            InventoryService.update_quantity(item_id, quantity)
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})