class ShoppingList {
    static addIngredients(recipeId, ingredients) {
        const list = this.getList();
        list[recipeId] = ingredients;
        localStorage.setItem('shopping-list', JSON.stringify(list));
        Toast.show('Ingredients added to shopping list');
    }

    static getList() {
        return JSON.parse(localStorage.getItem('shopping-list') || '{}');
    }

    static removeRecipe(recipeId) {
        const list = this.getList();
        delete list[recipeId];
        localStorage.setItem('shopping-list', JSON.stringify(list));
        this.updateUI();
    }

    static updateUI() {
        const container = document.getElementById('shopping-list');
        if (!container) return;

        const list = this.getList();
        container.innerHTML = Object.entries(list)
            .map(([recipeId, ingredients]) => `
                <div class="glass-card p-4 mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold">${ingredients.recipeName}</h4>
                        <button onclick="ShoppingList.removeRecipe('${recipeId}')" 
                                class="text-red-500 hover:text-red-700">
                            ✕
                        </button>
                    </div>
                    <ul class="space-y-1">
                        ${ingredients.items.map(item => `
                            <li class="flex items-center gap-2">
                                <input type="checkbox" class="rounded">
                                <span>${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
    }
}