from django.utils.text import slugify
import random
import string

def generate_unique_slug(model_instance, title, slug_field="slug"):
    """Generate a unique slug for a model instance"""
    slug = slugify(title)
    unique_slug = slug
    extension = 1
    ModelClass = model_instance.__class__
    
    while ModelClass._default_manager.filter(**{slug_field: unique_slug}).exists():
        unique_slug = f"{slug}-{extension}"
        extension += 1
    
    return unique_slug