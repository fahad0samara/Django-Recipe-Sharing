from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

def process_recipe_image(image_file):
    """Process and optimize recipe images"""
    if not image_file:
        return None
        
    img = Image.open(image_file)
    output = BytesIO()
    
    # Resize if too large
    if img.height > 1080 or img.width > 1920:
        img.thumbnail((1920, 1080), Image.LANCZOS)
    
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Save with optimization
    img.save(output, format='JPEG', quality=85, optimize=True)
    output.seek(0)
    
    return InMemoryUploadedFile(
        output,
        'ImageField',
        f"{image_file.name.split('.')[0]}.jpg",
        'image/jpeg',
        sys.getsizeof(output),
        None
    )