from django import forms
from .models import Recipe, Review, Comment, Category

class RecipeForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make important fields required
        self.fields['title'].required = True
        self.fields['category'].required = True
        self.fields['description'].required = True
        self.fields['ingredients'].required = True
        self.fields['instructions'].required = True
        self.fields['cooking_time'].required = True
        self.fields['prep_time'].required = True
        self.fields['servings'].required = True
        
        # Add help text
        self.fields['ingredients'].help_text = "Enter each ingredient on a new line, e.g.:\n2 cups flour\n1 tsp salt\n3 eggs"
        self.fields['instructions'].help_text = "Enter each step on a new line, e.g.:\n1. Preheat oven to 350°F\n2. Mix dry ingredients\n3. Add wet ingredients"
    
    def clean_cooking_time(self):
        cooking_time = self.cleaned_data.get('cooking_time')
        if cooking_time is not None and cooking_time < 1:
            raise forms.ValidationError("Cooking time must be at least 1 minute")
        return cooking_time
    
    def clean_prep_time(self):
        prep_time = self.cleaned_data.get('prep_time')
        if prep_time is not None and prep_time < 1:
            raise forms.ValidationError("Preparation time must be at least 1 minute")
        return prep_time
    
    def clean_servings(self):
        servings = self.cleaned_data.get('servings')
        if servings is not None and servings < 1:
            raise forms.ValidationError("Number of servings must be at least 1")
        return servings
    
    class Meta:
        model = Recipe
        fields = ['title', 'category', 'description', 'ingredients', 'instructions', 
                 'cooking_time', 'prep_time', 'servings', 'difficulty', 
                 'dietary_preferences', 'calories_per_serving', 'image']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter your recipe title',
                'maxlength': '200'
            }),
            'category': forms.Select(attrs={
                'class': 'form-select'
            }),
            'description': forms.Textarea(attrs={
                'rows': 4,
                'class': 'form-textarea',
                'placeholder': 'Describe your recipe - what makes it special?'
            }),
            'ingredients': forms.Textarea(attrs={
                'rows': 8,
                'class': 'form-textarea',
                'placeholder': '2 cups flour\n1 tsp salt\n3 eggs'
            }),
            'instructions': forms.Textarea(attrs={
                'rows': 8,
                'class': 'form-textarea',
                'placeholder': '1. Preheat oven to 350°F\n2. Mix dry ingredients\n3. Add wet ingredients'
            }),
            'cooking_time': forms.NumberInput(attrs={
                'class': 'form-input',
                'min': '1',
                'placeholder': 'e.g., 30'
            }),
            'prep_time': forms.NumberInput(attrs={
                'class': 'form-input',
                'min': '1',
                'placeholder': 'e.g., 15'
            }),
            'servings': forms.NumberInput(attrs={
                'class': 'form-input',
                'min': '1',
                'placeholder': 'e.g., 4'
            }),
            'difficulty': forms.Select(attrs={
                'class': 'form-select'
            }),
            'dietary_preferences': forms.Select(attrs={
                'class': 'form-select'
            }),
            'calories_per_serving': forms.NumberInput(attrs={
                'class': 'form-input',
                'min': '0',
                'placeholder': 'e.g., 350 (optional)'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-input',
                'accept': 'image/*'
            })
        }

class ReviewForm(forms.ModelForm):
    RATING_CHOICES = [
        (5, '★★★★★ Excellent'),
        (4, '★★★★☆ Very Good'),
        (3, '★★★☆☆ Good'),
        (2, '★★☆☆☆ Fair'),
        (1, '★☆☆☆☆ Poor')
    ]
    
    rating = forms.ChoiceField(
        choices=RATING_CHOICES,
        widget=forms.RadioSelect(attrs={
            'class': 'rating-input hidden'
        })
    )
    
    comment = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 4,
            'class': 'form-textarea',
            'placeholder': 'Share your experience with this recipe...'
        })
    )
    
    class Meta:
        model = Review
        fields = ['rating', 'comment']

class CommentForm(forms.ModelForm):
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 3,
            'class': 'form-textarea',
            'placeholder': 'Write your comment here...'
        })
    )

    class Meta:
        model = Comment
        fields = ['content']

class RecipeSearchForm(forms.Form):
    SORT_CHOICES = [
        ('newest', 'Newest First'),
        ('oldest', 'Oldest First'),
        ('popular', 'Most Popular'),
        ('rating', 'Highest Rated'),
        ('cooking_time', 'Cooking Time'),
    ]

    TIME_CHOICES = [
        ('', 'Any Time'),
        ('15', 'Under 15 minutes'),
        ('30', 'Under 30 minutes'),
        ('60', 'Under 1 hour'),
        ('120', 'Under 2 hours'),
    ]

    query = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Search recipes...'
        })
    )
    
    category = forms.ModelChoiceField(
        queryset=Category.objects.all(),
        required=False,
        empty_label="All Categories",
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    difficulty = forms.ChoiceField(
        choices=[('', 'Any Difficulty')] + Recipe.DIFFICULTY_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    dietary = forms.ChoiceField(
        choices=[('', 'Any Diet')] + Recipe.DIETARY_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    max_cooking_time = forms.ChoiceField(
        choices=TIME_CHOICES,
        required=False,
        label='Cooking Time',
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    sort_by = forms.ChoiceField(
        choices=SORT_CHOICES,
        required=False,
        initial='newest',
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    has_image = forms.BooleanField(
        required=False,
        label='Only show recipes with images',
        widget=forms.CheckboxInput(attrs={'class': 'form-checkbox'})
    )
    
    min_rating = forms.ChoiceField(
        choices=[('', 'Any Rating')] + [(str(i), f'{i}+ Stars') for i in range(1, 6)],
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )