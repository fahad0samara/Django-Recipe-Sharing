// Utility functions for animations
export const animate = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = 0;
        element.style.transition = `opacity ${duration}ms`;
        requestAnimationFrame(() => element.style.opacity = 1);
    },
    
    slideIn: (element, duration = 300) => {
        element.style.transform = 'translateY(20px)';
        element.style.opacity = 0;
        element.style.transition = `all ${duration}ms`;
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = 1;
        });
    }
};