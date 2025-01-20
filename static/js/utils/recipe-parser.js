// Utility for parsing recipe ingredients and instructions
export const recipeParser = {
  parseIngredients(text) {
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const match = line.match(/^([\d.\/]+)?\s*(\w+)?\s*(.+)$/);
        if (match) {
          const [_, amount, unit, ingredient] = match;
          return {
            amount: this.convertFractionToDecimal(amount),
            unit: unit?.toLowerCase() || '',
            ingredient: ingredient.trim(),
            original: line.trim()
          };
        }
        return { original: line.trim() };
      });
  },

  convertFractionToDecimal(fraction) {
    if (!fraction) return null;
    
    // Handle mixed numbers (e.g., "1 1/2")
    const mixed = fraction.split(' ');
    if (mixed.length > 1) {
      const whole = parseFloat(mixed[0]);
      const frac = this.convertFractionToDecimal(mixed[1]);
      return whole + frac;
    }

    // Handle simple fractions (e.g., "1/2")
    if (fraction.includes('/')) {
      const [num, denom] = fraction.split('/').map(Number);
      return num / denom;
    }

    return parseFloat(fraction);
  },

  parseInstructions(text) {
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((step, index) => ({
        number: index + 1,
        text: step,
        time: this.extractCookingTime(step),
        equipment: this.extractEquipment(step)
      }));
  },

  extractCookingTime(step) {
    const timeRegex = /(\d+)[-\s]?(minute|min|hour|hr|second|sec)s?/gi;
    const matches = [...step.matchAll(timeRegex)];
    
    return matches.map(match => {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      
      // Convert all times to minutes
      switch(unit) {
        case 'hour':
        case 'hr':
          return value * 60;
        case 'second':
        case 'sec':
          return value / 60;
        default:
          return value;
      }
    });
  },

  extractEquipment(step) {
    const commonEquipment = [
      'pan', 'pot', 'bowl', 'oven', 'skillet', 'knife', 'cutting board',
      'whisk', 'spoon', 'spatula', 'mixer', 'blender', 'grater', 'peeler',
      'colander', 'strainer', 'baking sheet', 'dish', 'plate'
    ];

    return commonEquipment
      .filter(item => step.toLowerCase().includes(item))
      .map(item => ({
        name: item,
        action: this.getEquipmentAction(step, item)
      }));
  },

  getEquipmentAction(step, equipment) {
    const actions = {
      'pan': ['heat', 'fry', 'sauté', 'cook'],
      'pot': ['boil', 'simmer', 'cook'],
      'bowl': ['mix', 'whisk', 'combine'],
      'oven': ['bake', 'roast', 'heat'],
      'mixer': ['beat', 'mix', 'whip']
    };

    const equipmentActions = actions[equipment] || [];
    return equipmentActions.find(action => 
      step.toLowerCase().includes(action)
    ) || 'use';
  },

  formatIngredient(ingredient) {
    if (!ingredient.amount && !ingredient.unit) {
      return ingredient.original;
    }

    const amount = ingredient.amount ? 
      (Number.isInteger(ingredient.amount) ? 
        ingredient.amount.toString() : 
        ingredient.amount.toFixed(2)
      ) : '';
    
    const unit = ingredient.unit ? ` ${ingredient.unit}` : '';
    const name = ` ${ingredient.ingredient}`;

    return `${amount}${unit}${name}`;
  }
};