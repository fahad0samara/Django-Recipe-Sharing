from datetime import date
from django.db.models import F
from ..models.inventory import InventoryItem, Ingredient

class InventoryService:
    @staticmethod
    def get_user_inventory(user):
        return InventoryItem.objects.filter(
            user=user
        ).select_related('ingredient').order_by('ingredient__category')
    
    @staticmethod
    def check_expiring_items(user, days=7):
        threshold = date.today() + timedelta(days=days)
        return InventoryItem.objects.filter(
            user=user,
            expiry_date__lte=threshold
        ).select_related('ingredient')
    
    @staticmethod
    def update_quantity(item_id, new_quantity):
        return InventoryItem.objects.filter(id=item_id).update(
            quantity=new_quantity
        )