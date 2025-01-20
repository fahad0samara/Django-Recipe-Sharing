class BookmarkManager {
    static toggle(recipeId) {
        const button = document.querySelector(`#bookmark-${recipeId}`);
        
        fetch(`/api/recipes/${recipeId}/bookmark/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            button.classList.toggle('text-yellow-500');
            Toast.show(data.bookmarked ? 'Recipe bookmarked!' : 'Bookmark removed');
        });
    }
}