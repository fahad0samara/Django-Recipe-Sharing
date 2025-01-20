class IngredientScaler {
    static scale(baseServings, newServings, ingredients) {
        const factor = newServings / baseServings;
        return ingredients.map(ingredient => {
            const { amount, unit, item } = this.parseIngredient(ingredient);
            if (amount) {
                const newAmount = (amount * factor).toFixed(1);
                return `${newAmount} ${unit} ${item}`;
            }
            return ingredient;
        });
    }

    static parseIngredient(ingredient) {
        const match = ingredient.match(/^([\d.]+)\s*(\w+)\s+(.+)$/);
        if (match) {
            return {
                amount: parseFloat(match[1]),
                unit: match[2],
                item: match[3]
            };
        }
        return { amount: null, unit: '', item: ingredient };
    }

    static updateDisplay(baseServings, newServings) {
        const ingredients = JSON.parse(
            document.getElementById('recipe-ingredients').dataset.ingredients
        );
        const scaled = this.scale(baseServings, newServings, ingredients);
        
        document.getElementById('ingredients-list').innerHTML = scaled
            .map(ingredient => `<li class="mb-2">${ingredient}</li>`)
            .join('');
    }
}