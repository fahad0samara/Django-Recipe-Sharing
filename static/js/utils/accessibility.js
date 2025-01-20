export const A11y = {
  announceMessage(message) {
    const announcer = document.getElementById('a11y-announcer') || 
      createAnnouncer();
    announcer.textContent = message;
  },

  focusTrap(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }
};

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  return announcer;
}