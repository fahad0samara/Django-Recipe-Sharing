// Meal planning utility
export const mealPlanner = {
  // Meal types and their typical characteristics
  MEAL_TYPES: {
    breakfast: {
      prepTime: { max: 30 },
      calories: { min: 300, max: 800 },
      preferredCategories: ['breakfast', 'brunch', 'quick']
    },
    lunch: {
      prepTime: { max: 45 },
      calories: { min: 400, max: 900 },
      preferredCategories: ['lunch', 'salad', 'sandwich']
    },
    dinner: {
      prepTime: { max: 60 },
      calories: { min: 500, max: 1200 },
      preferredCategories: ['dinner', 'main course', 'entree']
    },
    snack: {
      prepTime: { max: 15 },
      calories: { min: 100, max: 300 },
      preferredCategories: ['snack', 'appetizer']
    }
  },

  generateMealPlan(recipes, preferences) {
    const plan = {
      monday: this.planDay(recipes, preferences),
      tuesday: this.planDay(recipes, preferences),
      wednesday: this.planDay(recipes, preferences),
      thursday: this.planDay(recipes, preferences),
      friday: this.planDay(recipes, preferences),
      saturday: this.planDay(recipes, preferences),
      sunday: this.planDay(recipes, preferences)
    };

    return {
      plan,
      shoppingList: this.generateShoppingList(plan),
      nutritionSummary: this.calculateNutritionSummary(plan)
    };
  },

  planDay(recipes, preferences) {
    const meals = {};
    Object.keys(this.MEAL_TYPES).forEach(mealType => {
      meals[mealType] = this.selectRecipe(
        recipes,
        mealType,
        preferences,
        Object.values(meals) // Already selected recipes
      );
    });
    return meals;
  },

  selectRecipe(recipes, mealType, preferences, selectedRecipes) {
    const mealConstraints = this.MEAL_TYPES[mealType];
    
    // Filter recipes based on constraints and preferences
    const suitable = recipes.filter(recipe => {
      // Skip already selected recipes
      if (selectedRecipes.includes(recipe)) return false;

      // Check preparation time
      if (recipe.prepTime > mealConstraints.prepTime.max) return false;

      // Check calories
      const calories = recipe.nutrition?.calories || 0;
      if (calories < mealConstraints.calories.min || 
          calories > mealConstraints.calories.max) return false;

      // Check dietary restrictions
      if (preferences.dietary && !this.meetsRestrictions(recipe, preferences.dietary)) {
        return false;
      }

      return true;
    });

    // Score and sort suitable recipes
    const scored = suitable.map(recipe => ({
      recipe,
      score: this.scoreRecipe(recipe, mealType, preferences)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.recipe || null;
  },

  scoreRecipe(recipe, mealType, preferences) {
    let score = 0;
    const mealConstraints = this.MEAL_TYPES[mealType];

    // Preferred categories bonus
    if (mealConstraints.preferredCategories.includes(recipe.category)) {
      score += 5;
    }

    // Cooking time optimization
    const idealPrepTime = mealConstraints.prepTime.max * 0.7;
    score += 3 * (1 - Math.abs(recipe.prepTime - idealPrepTime) / idealPrepTime);

    // Preferred ingredients bonus
    if (preferences.ingredients) {
      const preferredCount = preferences.ingredients.filter(ing => 
        recipe.ingredients.toLowerCase().includes(ing.toLowerCase())
      ).length;
      score += preferredCount;
    }

    // Difficulty level matching
    if (preferences.skillLevel) {
      const difficultyMatch = {
        beginner: { easy: 3, intermediate: 1, advanced: 0 },
        intermediate: { easy: 1, intermediate: 3, advanced: 1 },
        advanced: { easy: 0, intermediate: 1, advanced: 3 }
      };
      score += difficultyMatch[preferences.skillLevel][recipe.difficulty] || 0;
    }

    return score;
  },

  meetsRestrictions(recipe, restrictions) {
    const ingredients = recipe.ingredients.toLowerCase();
    return !restrictions.some(restriction => {
      switch(restriction) {
        case 'vegetarian':
          return /\b(meat|chicken|beef|pork|fish)\b/.test(ingredients);
        case 'vegan':
          return /\b(meat|chicken|beef|pork|fish|egg|milk|cheese|honey)\b/.test(ingredients);
        case 'gluten-free':
          return /\b(flour|wheat|barley|rye)\b/.test(ingredients);
        case 'dairy-free':
          return /\b(milk|cheese|cream|butter|yogurt)\b/.test(ingredients);
        default:
          return false;
      }
    });
  },

  generateShoppingList(mealPlan) {
    const ingredients = {};

    // Collect all ingredients from the meal plan
    Object.values(mealPlan).forEach(day => {
      Object.values(day).forEach(recipe => {
        if (!recipe) return;

        recipe.ingredients.forEach(ingredient => {
          const key = ingredient.ingredient.toLowerCase();
          if (!ingredients[key]) {
            ingredients[key] = {
              name: ingredient.ingredient,
              amount: 0,
              unit: ingredient.unit
            };
          }
          ingredients[key].amount += ingredient.amount || 0;
        });
      });
    });

    // Convert to array and sort by category
    return Object.values(ingredients)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  calculateNutritionSummary(mealPlan) {
    const summary = {
      daily: {},
      weekly: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };

    Object.entries(mealPlan).forEach(([day, meals]) => {
      summary.daily[day] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };

      Object.values(meals).forEach(recipe => {
        if (!recipe?.nutrition) return;

        // Add to daily totals
        summary.daily[day].calories += recipe.nutrition.calories;
        summary.daily[day].protein += recipe.nutrition.protein;
        summary.daily[day].carbs += recipe.nutrition.carbs;
        summary.daily[day].fat += recipe.nutrition.fat;

        // Add to weekly totals
        summary.weekly.calories += recipe.nutrition.calories;
        summary.weekly.protein += recipe.nutrition.protein;
        summary.weekly.carbs += recipe.nutrition.carbs;
        summary.weekly.fat += recipe.nutrition.fat;
      });
    });

    // Calculate averages
    summary.average = {
      calories: summary.weekly.calories / 7,
      protein: summary.weekly.protein / 7,
      carbs: summary.weekly.carbs / 7,
      fat: summary.weekly.fat / 7
    };

    return summary;
  }
};