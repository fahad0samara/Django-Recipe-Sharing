// Utility for nutrition calculations
export const nutritionCalculator = {
  calculateCalories(ingredients) {
    // Basic calorie estimation
    return ingredients.reduce((total, ingredient) => {
      const baseCalories = this.getBaseCalories(ingredient.ingredient);
      const amount = parseFloat(ingredient.amount) || 1;
      return total + (baseCalories * amount);
    }, 0);
  },

  getBaseCalories(ingredient) {
    // Simplified calorie database
    const calorieDb = {
      'chicken': 165,
      'rice': 130,
      'olive oil': 120,
      'egg': 70,
      'beef': 250,
      'salmon': 208,
      'pasta': 131,
      'bread': 265,
      'milk': 103,
      'cheese': 402,
      'butter': 717,
      'potato': 77,
      'carrot': 41,
      'broccoli': 55,
      'spinach': 23,
      'apple': 52,
      'banana': 89,
      'sugar': 387,
      'flour': 364
    };
    
    return calorieDb[ingredient.toLowerCase()] || 50;
  },

  calculateNutrition(ingredients) {
    return ingredients.reduce((total, ingredient) => {
      const nutrition = this.getNutritionInfo(ingredient.ingredient);
      const amount = parseFloat(ingredient.amount) || 1;
      
      return {
        calories: total.calories + (nutrition.calories * amount),
        protein: total.protein + (nutrition.protein * amount),
        carbs: total.carbs + (nutrition.carbs * amount),
        fat: total.fat + (nutrition.fat * amount),
        fiber: total.fiber + (nutrition.fiber * amount)
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    });
  },

  getNutritionInfo(ingredient) {
    // Basic nutrition database (per 100g)
    const nutritionDb = {
      'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
      'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
      'salmon': { calories: 208, protein: 22, carbs: 0, fat: 13, fiber: 0 },
      'broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 2.6 },
      'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }
    };

    return nutritionDb[ingredient.toLowerCase()] || 
      { calories: 50, protein: 2, carbs: 5, fat: 2, fiber: 1 };
  }
};