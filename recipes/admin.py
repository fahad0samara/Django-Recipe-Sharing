from django.contrib import admin
from .models import Recipe, Category, UserPreference, Review, UserInteraction

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_by', 'cooking_time', 'is_featured')
    list_filter = ('category', 'is_featured', 'difficulty')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'cooking_skill', 'created_at')
    list_filter = ('cooking_skill',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'recipe', 'rating', 'created_at')
    list_filter = ('rating',)

@admin.register(UserInteraction)
class UserInteractionAdmin(admin.ModelAdmin):
    list_display = ('user', 'recipe', 'interaction_type', 'created_at')
    list_filter = ('interaction_type',)
