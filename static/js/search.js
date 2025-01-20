// Debounce function for search optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search and filters
const handleSearch = debounce((event) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('q', event.target.value);
    window.location.search = searchParams.toString();
}, 500);

// Handle category filter
const handleCategoryFilter = (event) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('category', event.target.value);
    window.location.search = searchParams.toString();
};