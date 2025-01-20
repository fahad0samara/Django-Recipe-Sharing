// Image gallery with lazy loading
export class ImageGallery {
    constructor(container) {
        this.container = container;
        this.images = [];
        this.currentIndex = 0;
    }

    addImage(url, alt) {
        this.images.push({ url, alt });
        this.render();
    }

    render() {
        const img = document.createElement('img');
        img.dataset.src = this.images[this.currentIndex].url;
        img.alt = this.images[this.currentIndex].alt;
        img.classList.add('lazy-image', 'opacity-0', 'transition-opacity');
        
        this.container.appendChild(img);
        this.observeImage(img);
    }

    observeImage(img) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.classList.remove('opacity-0');
                    observer.unobserve(img);
                }
            });
        });
        observer.observe(img);
    }
}