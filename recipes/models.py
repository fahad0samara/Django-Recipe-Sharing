from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg, Count
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from django.urls import reverse

class UserPreference(models.Model):
    COOKING_SKILL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorite_categories = models.ManyToManyField('Category')
    dietary_restrictions = models.JSONField(default=dict)
    cooking_skill = models.CharField(max_length=20, choices=COOKING_SKILL_CHOICES, default='beginner')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s preferences"

class UserInteraction(models.Model):
    INTERACTION_TYPES = [
        ('view', 'Viewed'),
        ('save', 'Saved'),
        ('share', 'Shared'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'recipe', 'interaction_type']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} {self.interaction_type} {self.recipe.title}"

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Recipe(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    DIETARY_CHOICES = [
        ('vegetarian', 'Vegetarian'),
        ('vegan', 'Vegan'),
        ('gluten_free', 'Gluten Free'),
        ('dairy_free', 'Dairy Free'),
        ('keto', 'Keto'),
        ('none', 'None')
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    ingredients = models.TextField(help_text="Enter each ingredient on a new line")
    instructions = models.TextField()
    cooking_time = models.IntegerField(help_text="Cooking time in minutes")
    servings = models.IntegerField(default=4)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    dietary_preferences = models.CharField(max_length=20, choices=DIETARY_CHOICES, default='none')
    calories_per_serving = models.IntegerField(null=True, blank=True)
    prep_time = models.IntegerField(help_text="Preparation time in minutes", default=15)
    total_time = models.IntegerField(help_text="Total time in minutes", null=True, blank=True)
    image = models.ImageField(upload_to='recipe_images/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    is_featured = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.total_time and self.cooking_time and self.prep_time:
            self.total_time = self.cooking_time + self.prep_time
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def get_similar_recipes(self, limit=5):
        """Get similar recipes based on category and ingredients"""
        return Recipe.objects.filter(
            category=self.category
        ).exclude(
            id=self.id
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).order_by('-avg_rating', '-review_count')[:limit]

    def get_absolute_url(self):
        return reverse('recipe_detail', kwargs={'slug': self.slug})

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f"{self.user.username} likes {self.recipe.title}"

class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.recipe.title}'

class Review(models.Model):
    RATING_CHOICES = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f"{self.user.username}'s {self.rating}-star review of {self.recipe.title}"