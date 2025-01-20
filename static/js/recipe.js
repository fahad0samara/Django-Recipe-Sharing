// Social sharing functionality
function shareRecipe(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.querySelector('h1').textContent);
    
    let shareUrl;
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
            break;
        default:
            return;
    }
    
    const windowFeatures = 'width=600,height=400,resizable=yes,scrollbars=yes,status=yes';
    window.open(shareUrl, 'Share Recipe', windowFeatures);
}

// Favorite functionality
function toggleFavorite(recipeSlug) {
    const favoriteBtn = document.getElementById('favorite-btn');
    const tooltip = favoriteBtn.querySelector('span');
    const filledHeart = favoriteBtn.querySelectorAll('svg')[1];
    const favoriteCount = document.getElementById('favorite-count');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    // Don't allow clicking while processing
    if (favoriteBtn.disabled) return;
    
    // Disable button and add loading state
    favoriteBtn.disabled = true;
    favoriteBtn.classList.add('animate-pulse');
    
    // Get current state
    const isFavorite = favoriteBtn.dataset.favorite === 'true';
    const currentCount = parseInt(favoriteCount.textContent);
    
    // Optimistic UI update
    updateFavoriteUI(!isFavorite, currentCount + (isFavorite ? -1 : 1));
    
    // Add heart beat animation
    filledHeart.classList.add('animate-heartbeat');
    
    fetch(`/recipe/${recipeSlug}/toggle-favorite/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Remove loading states
        favoriteBtn.classList.remove('animate-pulse');
        favoriteBtn.disabled = false;
        
        // Update UI with server response
        updateFavoriteUI(data.is_favorite, data.favorite_count);
        
        // Show success message
        showToast(
            data.is_favorite ? 'Added to favorites!' : 'Removed from favorites',
            'success'
        );
    })
    .catch(error => {
        console.error('Error:', error);
        // Revert optimistic update
        updateFavoriteUI(isFavorite, currentCount);
        // Remove loading states
        favoriteBtn.classList.remove('animate-pulse');
        favoriteBtn.disabled = false;
        // Show error message
        showToast('Error updating favorite status', 'error');
    })
    .finally(() => {
        // Remove heart beat animation
        setTimeout(() => {
            filledHeart.classList.remove('animate-heartbeat');
        }, 1000);
    });
}

// Helper function to update favorite UI
function updateFavoriteUI(isFavorite, count) {
    const favoriteBtn = document.getElementById('favorite-btn');
    const filledHeart = favoriteBtn.querySelectorAll('svg')[1];
    const favoriteCount = document.getElementById('favorite-count');
    const tooltip = favoriteBtn.querySelector('span');
    
    // Update button state
    favoriteBtn.dataset.favorite = isFavorite;
    
    // Update heart icon
    if (isFavorite) {
        filledHeart.classList.remove('opacity-0');
        filledHeart.classList.add('opacity-100');
    } else {
        filledHeart.classList.remove('opacity-100');
        filledHeart.classList.add('opacity-0');
    }
    
    // Update tooltip
    tooltip.textContent = isFavorite ? 'Remove from favorites' : 'Add to favorites';
    
    // Update count
    favoriteCount.textContent = count;
    favoriteCount.classList.toggle('scale-0', count === 0);
    favoriteCount.classList.toggle('scale-100', count > 0);
}

// Helper function to show toast messages
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    toast.textContent = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('translate-y-0');
        toast.classList.remove('translate-y-full');
    });
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add heart beat animation to style section
const style = document.createElement('style');
style.textContent = `
@keyframes heartbeat {
    0% { transform: scale(1); }
    25% { transform: scale(1.1); }
    50% { transform: scale(1); }
    75% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.animate-heartbeat {
    animation: heartbeat 1s ease-in-out;
}
`;
document.head.appendChild(style);
