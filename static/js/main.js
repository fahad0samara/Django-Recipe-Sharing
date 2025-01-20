// Import utilities
import { animate } from './utils/animation';
import { format } from './utils/format';
import { validate } from './utils/validation';
import { recipeParser } from './utils/recipe-parser';
import { cookingConverter } from './utils/cooking-converter';

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  // Setup lazy loading
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = img.dataset.src;
          animate.fadeIn(img);
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  });

  // Initialize tooltips
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(element => {
    element.addEventListener('mouseenter', e => {
      const tooltip = document.createElement('div');
      tooltip.className = 'glass-card p-2 absolute z-50';
      tooltip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tooltip);
      
      const rect = e.target.getBoundingClientRect();
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.top = `${rect.bottom + 5}px`;
      
      e.target.addEventListener('mouseleave', () => tooltip.remove(), { once: true });
    });
  });
});