// Recipe difficulty estimator
export const difficultyEstimator = {
  // Complexity indicators for different techniques
  TECHNIQUES: {
    basic: ['mix', 'stir', 'combine', 'add', 'pour', 'heat'],
    intermediate: ['knead', 'fold', 'whisk', 'beat', 'simmer', 'marinate', 'grill'],
    advanced: ['temper', 'proof', 'ferment', 'blanch', 'braise', 'deglaze', 'reduce']
  },

  // Equipment complexity levels
  EQUIPMENT_COMPLEXITY: {
    basic: ['bowl', 'spoon', 'pan', 'pot', 'knife'],
    intermediate: ['mixer', 'blender', 'food processor', 'thermometer'],
    advanced: ['stand mixer', 'sous vide', 'torch', 'mandoline']
  },

  estimateDifficulty(recipe) {
    const scores = {
      techniques: this.analyzeTechniques(recipe.instructions),
      ingredients: this.analyzeIngredients(recipe.ingredients),
      time: this.analyzeTime(recipe.cookingTime),
      equipment: this.analyzeEquipment(recipe.instructions)
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return this.getDifficultyLevel(totalScore);
  },

  analyzeTechniques(instructions) {
    let score = 0;
    const text = instructions.toLowerCase();

    // Check for technique complexity
    this.TECHNIQUES.basic.forEach(technique => {
      if (text.includes(technique)) score += 1;
    });

    this.TECHNIQUES.intermediate.forEach(technique => {
      if (text.includes(technique)) score += 2;
    });

    this.TECHNIQUES.advanced.forEach(technique => {
      if (text.includes(technique)) score += 3;
    });

    return Math.min(score, 10); // Cap at 10 points
  },

  analyzeIngredients(ingredients) {
    const count = ingredients.length;
    // Score based on number of ingredients
    if (count <= 5) return 1;
    if (count <= 10) return 2;
    if (count <= 15) return 3;
    return 4;
  },

  analyzeTime(cookingTime) {
    // Score based on total cooking time in minutes
    if (cookingTime <= 15) return 1;
    if (cookingTime <= 30) return 2;
    if (cookingTime <= 60) return 3;
    return 4;
  },

  analyzeEquipment(instructions) {
    let score = 0;
    const text = instructions.toLowerCase();

    this.EQUIPMENT_COMPLEXITY.basic.forEach(equipment => {
      if (text.includes(equipment)) score += 1;
    });

    this.EQUIPMENT_COMPLEXITY.intermediate.forEach(equipment => {
      if (text.includes(equipment)) score += 2;
    });

    this.EQUIPMENT_COMPLEXITY.advanced.forEach(equipment => {
      if (text.includes(equipment)) score += 3;
    });

    return Math.min(score, 8); // Cap at 8 points
  },

  getDifficultyLevel(score) {
    if (score <= 8) return { level: 'easy', score };
    if (score <= 16) return { level: 'intermediate', score };
    return { level: 'advanced', score };
  },

  getTimeEstimate(recipe) {
    const prepTime = this.estimatePrepTime(recipe);
    const activeTime = this.estimateActiveTime(recipe);
    const totalTime = recipe.cookingTime;

    return {
      prep: prepTime,
      active: activeTime,
      total: totalTime,
      waiting: totalTime - (prepTime + activeTime)
    };
  },

  estimatePrepTime(recipe) {
    // Estimate prep time based on ingredients and techniques
    let time = recipe.ingredients.length * 2; // Base time per ingredient
    const text = recipe.instructions.toLowerCase();

    // Add time for prep-heavy techniques
    const prepTechniques = {
      'chop': 3,
      'dice': 3,
      'mince': 4,
      'peel': 2,
      'grate': 3,
      'measure': 1
    };

    Object.entries(prepTechniques).forEach(([technique, minutes]) => {
      if (text.includes(technique)) {
        time += minutes;
      }
    });

    return time;
  },

  estimateActiveTime(recipe) {
    // Estimate time actively cooking (not waiting)
    let time = 0;
    const text = recipe.instructions.toLowerCase();

    const activeTechniques = {
      'stir': 5,
      'knead': 10,
      'fold': 5,
      'whisk': 3,
      'beat': 5,
      'sauté': 8
    };

    Object.entries(activeTechniques).forEach(([technique, minutes]) => {
      if (text.includes(technique)) {
        time += minutes;
      }
    });

    return Math.min(time, recipe.cookingTime);
  }
};