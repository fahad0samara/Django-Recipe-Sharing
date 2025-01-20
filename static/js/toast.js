class Toast {
    static show(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 p-4 rounded-lg glass-card transform translate-y-full opacity-0 transition-all duration-300 ${
            type === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`;
        
        toast.innerHTML = message;
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.remove('translate-y-full', 'opacity-0');
        }, 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}