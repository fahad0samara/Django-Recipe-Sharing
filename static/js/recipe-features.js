// Reading Progress Bar
class ReadingProgress {
    constructor() {
        this.progressBar = document.getElementById('reading-progress');
        this.content = document.querySelector('.recipe-container');
        this.init();
    }

    init() {
        if (!this.progressBar || !this.content) return;
        
        window.addEventListener('scroll', () => {
            this.updateProgress();
        });
    }

    updateProgress() {
        const contentBox = this.content.getBoundingClientRect();
        const contentHeight = contentBox.height;
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        
        const totalHeight = contentHeight - windowHeight;
        const progress = (scrolled / totalHeight) * 100;
        
        this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
}

// Share Functionality
class ShareFeature {
    constructor() {
        this.shareButton = document.getElementById('share-recipe');
        this.shareMenu = document.getElementById('share-menu');
        this.init();
    }

    init() {
        if (!this.shareButton || !this.shareMenu) return;

        this.shareButton.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.shareButton.contains(e.target) && !this.shareMenu.contains(e.target)) {
                this.shareMenu.classList.add('hidden');
            }
        });

        // Handle share options
        const shareOptions = this.shareMenu.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const platform = e.currentTarget.dataset.platform;
                this.share(platform);
            });
        });
    }

    toggleMenu() {
        this.shareMenu.classList.toggle('hidden');
    }

    async share(platform) {
        const url = window.location.href;
        const title = document.title;
        const text = 'Check out this amazing recipe!';

        try {
            switch (platform) {
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, 
                               '_blank', 'width=600,height=400');
                    break;

                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, 
                               '_blank', 'width=600,height=400');
                    break;

                case 'whatsapp':
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, 
                               '_blank');
                    break;

                case 'copy':
                    await navigator.clipboard.writeText(url);
                    window.toast.show('Link copied to clipboard!', 'success');
                    break;

                default:
                    if (navigator.share) {
                        await navigator.share({
                            title,
                            text,
                            url
                        });
                    }
            }

            // Close menu after sharing
            this.shareMenu.classList.add('hidden');
            
            if (platform !== 'copy') {
                window.toast.show('Thanks for sharing!', 'success');
            }

        } catch (error) {
            console.error('Error sharing:', error);
            window.toast.show('Failed to share. Please try again.', 'error');
        }
    }
}

// Recipe Timer Feature
class RecipeTimer {
    constructor() {
        this.timers = new Map();
        this.init();
    }

    init() {
        const timeElements = document.querySelectorAll('.recipe-time');
        timeElements.forEach((el, index) => {
            const minutes = parseInt(el.dataset.minutes);
            if (!isNaN(minutes)) {
                this.createTimer(el, minutes, index);
            }
        });
    }

    createTimer(element, minutes, id) {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'recipe-timer';
        
        const button = document.createElement('button');
        button.className = 'timer-button';
        button.innerHTML = `
            <svg class="timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Timer (${minutes}m)
        `;

        const display = document.createElement('div');
        display.className = 'timer-display hidden';

        timerContainer.appendChild(button);
        timerContainer.appendChild(display);
        element.appendChild(timerContainer);

        button.addEventListener('click', () => {
            this.toggleTimer(id, minutes, display, button);
        });
    }

    toggleTimer(id, minutes, display, button) {
        if (this.timers.has(id)) {
            // Stop timer
            clearInterval(this.timers.get(id));
            this.timers.delete(id);
            display.classList.add('hidden');
            button.innerHTML = `
                <svg class="timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Timer (${minutes}m)
            `;
        } else {
            // Start timer
            let timeLeft = minutes * 60;
            display.classList.remove('hidden');
            
            const updateDisplay = () => {
                const minutesLeft = Math.floor(timeLeft / 60);
                const secondsLeft = timeLeft % 60;
                display.textContent = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
                
                if (timeLeft === 0) {
                    clearInterval(this.timers.get(id));
                    this.timers.delete(id);
                    window.toast.show('Timer finished!', 'success');
                    
                    // Play notification sound
                    const audio = new Audio('/static/sounds/timer-done.mp3');
                    audio.play();
                    
                    button.innerHTML = `
                        <svg class="timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start Timer (${minutes}m)
                    `;
                    display.classList.add('hidden');
                }
                timeLeft--;
            };

            updateDisplay();
            this.timers.set(id, setInterval(updateDisplay, 1000));
            
            button.innerHTML = `
                <svg class="timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M6 18L18 6M6 6l12 12" />
                </svg>
                Stop Timer
            `;
        }
    }
}

// Initialize features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReadingProgress();
    new ShareFeature();
    new RecipeTimer();
});
