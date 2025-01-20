class ShareModal {
    static show(recipeId, title) {
        const url = window.location.href;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="glass-card p-6 max-w-md w-full">
                <h3 class="text-xl font-semibold mb-4">Share Recipe</h3>
                <div class="space-y-4">
                    <button onclick="navigator.clipboard.writeText('${url}').then(() => Toast.show('Link copied!'))"
                            class="w-full p-2 glass-card hover:bg-opacity-75">
                        Copy Link
                    </button>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this recipe: ${title}`)}&url=${encodeURIComponent(url)}"
                       target="_blank"
                       class="block w-full p-2 glass-card hover:bg-opacity-75 text-center">
                        Share on Twitter
                    </a>
                </div>
                <button onclick="this.closest('.fixed').remove()"
                        class="absolute top-2 right-2 p-2">
                    ✕
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}