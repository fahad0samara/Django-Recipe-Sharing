// Toast Notification System
class ToastNotification {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate-slide-up`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <p>${message}</p>
            </div>
            <button class="toast-close">×</button>
        `;

        this.container.appendChild(toast);

        // Auto-dismiss after 5 seconds
        setTimeout(() => this.dismiss(toast), 5000);

        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.dismiss(toast);
        });
    }

    dismiss(toast) {
        toast.classList.add('animate-fade-out');
        setTimeout(() => toast.remove(), 300);
    }

    getIcon(type) {
        const icons = {
            success: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            error: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            warning: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
            info: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        return icons[type] || icons.info;
    }
}

// Search Bar with Autocomplete
class SearchBar {
    constructor(input, resultsContainer) {
        this.input = input;
        this.resultsContainer = resultsContainer;
        this.debounceTimeout = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.input.addEventListener('input', () => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => this.handleSearch(), 300);
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.resultsContainer.contains(e.target)) {
                this.resultsContainer.classList.add('hidden');
            }
        });
    }

    async handleSearch() {
        const query = this.input.value.trim();
        if (query.length < 2) {
            this.resultsContainer.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            this.displayResults(results);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    displayResults(results) {
        if (!results.length) {
            this.resultsContainer.classList.add('hidden');
            return;
        }

        this.resultsContainer.innerHTML = results.map(result => `
            <a href="${result.url}" class="search-result">
                <div class="search-result-content">
                    <h4>${result.title}</h4>
                    <p>${result.description}</p>
                </div>
            </a>
        `).join('');

        this.resultsContainer.classList.remove('hidden');
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.createElement('button');
        this.button.className = 'back-to-top hidden';
        this.button.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        `;
        document.body.appendChild(this.button);
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.classList.remove('hidden');
            } else {
                this.button.classList.add('hidden');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Loading Spinner
class LoadingSpinner {
    constructor() {
        this.spinner = document.createElement('div');
        this.spinner.className = 'loading-spinner hidden';
        this.spinner.innerHTML = `
            <div class="spinner"></div>
            <p>Loading...</p>
        `;
        document.body.appendChild(this.spinner);
    }

    show() {
        this.spinner.classList.remove('hidden');
    }

    hide() {
        this.spinner.classList.add('hidden');
    }
}

// Initialize all UI components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Toast Notifications
    window.toast = new ToastNotification();

    // Initialize Search Bar
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    if (searchInput && searchResults) {
        new SearchBar(searchInput, searchResults);
    }

    // Initialize Back to Top Button
    new BackToTop();

    // Initialize Loading Spinner
    window.spinner = new LoadingSpinner();

    // Example usage of toast notifications
    const showExampleToast = () => {
        toast.show('Welcome to our recipe sharing community!', 'success');
    };
    
    // Show welcome toast after a short delay
    setTimeout(showExampleToast, 1000);
});

// Add loading spinner to all form submissions
document.addEventListener('submit', () => {
    window.spinner.show();
});

// Add loading spinner to all link clicks with data-loading attribute
document.querySelectorAll('a[data-loading]').forEach(link => {
    link.addEventListener('click', () => {
        window.spinner.show();
    });
});
