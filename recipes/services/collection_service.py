from ..models.collection import Collection
from ..utils.query_optimizer import QueryOptimizer

class CollectionService:
    @staticmethod
    def get_user_collections(user):
        return Collection.objects.filter(user=user).prefetch_related('recipes')
    
    @staticmethod
    def get_public_collections():
        return Collection.objects.filter(
            is_public=True
        ).select_related('user').prefetch_related('recipes')
    
    @staticmethod
    def add_recipe_to_collection(collection_id, recipe_id):
        collection = Collection.objects.get(id=collection_id)
        collection.recipes.add(recipe_id)
        collection.save()