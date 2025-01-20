// Scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    const scrollElements = document.querySelectorAll('.scroll-fade-up');
    scrollElements.forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Recipe card hover effects
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.01)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        
        card.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });

        card.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero-section');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }

    // Category tag click handler
    const categoryTags = document.querySelectorAll('.category-tag');
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
            // Add your category filter logic here
            console.log(`Filtering by category: ${category}`);
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add skeleton loading for recipe cards
    function addSkeletonLoading() {
        const recipeCards = document.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            const img = card.querySelector('img');
            if (img && !img.complete) {
                card.classList.add('skeleton');
                img.addEventListener('load', () => {
                    card.classList.remove('skeleton');
                });
            }
        });
    }
    addSkeletonLoading();

    // Initialize floating animations
    const floatingElements = document.querySelectorAll('.animate-float');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');
        
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
    }

    const rippleButtons = document.querySelectorAll('.btn-primary');
    rippleButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
    }
});

// Handle dark mode toggle
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark-mode');
}

// Optional: Add smooth scrolling polyfill for Safari
if (!('scrollBehavior' in document.documentElement.style)) {
    import('scroll-behavior-polyfill').then(() => {
        console.log('Smooth scrolling polyfill loaded');
    });
}
