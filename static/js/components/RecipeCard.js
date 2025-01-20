// Reusable recipe card component
export class RecipeCard {
  constructor(container) {
    this.container = container;
  }

  render(recipe) {
    const card = document.createElement('div');
    card.className = 'glass-card overflow-hidden hover:shadow-lg transition-shadow';
    card.innerHTML = `
      <img src="${recipe.image}" 
           alt="${recipe.title}" 
           class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-lg font-semibold">${recipe.title}</h3>
        <p class="text-sm text-gray-600 mt-2">${recipe.description}</p>
        <div class="flex items-center gap-2 mt-3">
          <span class="text-sm">⏱️ ${recipe.cooking_time}m</span>
          <span class="text-sm">👥 ${recipe.servings} servings</span>
        </div>
      </div>
    `;
    this.container.appendChild(card);
  }
}