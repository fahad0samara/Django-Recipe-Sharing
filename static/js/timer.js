class RecipeTimer {
    constructor(duration) {
        this.duration = duration;
        this.remaining = duration;
        this.timerId = null;
    }

    start() {
        if (this.timerId) return;
        
        const startTime = Date.now();
        this.timerId = setInterval(() => {
            this.remaining = Math.max(0, this.duration - (Date.now() - startTime) / 1000);
            this.updateDisplay();
            
            if (this.remaining === 0) {
                this.stop();
                this.notify();
            }
        }, 1000);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    reset() {
        this.stop();
        this.remaining = this.duration;
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = Math.floor(this.remaining % 60);
        document.getElementById('timer-display').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    notify() {
        Toast.show('Timer finished!');
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Recipe Timer', {
                body: 'Your timer has finished!',
                icon: '/static/images/timer-icon.png'
            });
        }
    }
}