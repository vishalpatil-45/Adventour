// Image Carousel/Gallery Component

class Carousel {
    constructor(element) {
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = Array.from(this.track?.children || []);
        this.nextButton = element.querySelector('.carousel-btn-next');
        this.prevButton = element.querySelector('.carousel-btn-prev');
        this.dotsContainer = element.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        // Create dots
        if (this.dotsContainer) {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }

        this.dots = Array.from(this.dotsContainer?.children || []);

        // Button events
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }

        // Touch events for swipe
        this.setupTouchEvents();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Auto play
        this.startAutoPlay();

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Show first slide
        this.updateCarousel();
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoPlay();
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.startAutoPlay();
        });

        // Mouse drag for desktop
        this.track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            this.track.style.cursor = 'grabbing';
            this.stopAutoPlay();
        });

        this.track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
        });

        this.track.addEventListener('mouseup', () => {
            if (!isDragging) return;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.track.style.cursor = 'grab';
            this.startAutoPlay();
        });

        this.track.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                this.track.style.cursor = 'grab';
                this.startAutoPlay();
            }
        });
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    updateCarousel() {
        // Update track position
        const slideWidth = this.slides[0].offsetWidth;
        const offset = -slideWidth * this.currentIndex;
        this.track.style.transform = `translateX(${offset}px)`;

        // Update active states
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update button states
        if (this.prevButton) {
            this.prevButton.disabled = this.currentIndex === 0;
        }
        if (this.nextButton) {
            this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
        }
    }

    startAutoPlay(interval = 5000) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
            // Loop back to start
            if (this.currentIndex === this.slides.length - 1) {
                setTimeout(() => this.goToSlide(0), interval);
            }
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Image Gallery Modal
class ImageGallery {
    constructor() {
        this.modal = null;
        this.currentImages = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        // Create modal
        this.createModal();

        // Setup gallery triggers
        document.querySelectorAll('[data-gallery]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const galleryId = trigger.getAttribute('data-gallery');
                this.openGallery(galleryId);
            });
        });

        // Setup image click handlers
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', () => {
                const galleryId = img.closest('[data-gallery-group]')?.getAttribute('data-gallery-group');
                if (galleryId) {
                    this.openGalleryAtImage(galleryId, img.src);
                }
            });
        });
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'gallery-modal';
        this.modal.innerHTML = `
            <div class="gallery-modal-content">
                <button class="gallery-close">&times;</button>
                <button class="gallery-prev">&#10094;</button>
                <button class="gallery-next">&#10095;</button>
                <img class="gallery-image" src="" alt="Gallery Image">
                <div class="gallery-caption"></div>
                <div class="gallery-counter"></div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Event listeners
        this.modal.querySelector('.gallery-close').addEventListener('click', () => this.closeGallery());
        this.modal.querySelector('.gallery-prev').addEventListener('click', () => this.prevImage());
        this.modal.querySelector('.gallery-next').addEventListener('click', () => this.nextImage());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeGallery();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeGallery();
            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    }

    openGallery(galleryId) {
        const galleryGroup = document.querySelector(`[data-gallery-group="${galleryId}"]`);
        if (!galleryGroup) return;

        this.currentImages = Array.from(galleryGroup.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            caption: img.getAttribute('data-caption') || img.alt
        }));

        this.currentIndex = 0;
        this.showImage();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    openGalleryAtImage(galleryId, imageSrc) {
        this.openGallery(galleryId);
        const index = this.currentImages.findIndex(img => img.src === imageSrc);
        if (index !== -1) {
            this.currentIndex = index;
            this.showImage();
        }
    }

    closeGallery() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showImage() {
        if (this.currentImages.length === 0) return;

        const current = this.currentImages[this.currentIndex];
        const img = this.modal.querySelector('.gallery-image');
        const caption = this.modal.querySelector('.gallery-caption');
        const counter = this.modal.querySelector('.gallery-counter');

        img.src = current.src;
        img.alt = current.alt;
        caption.textContent = current.caption;
        counter.textContent = `${this.currentIndex + 1} / ${this.currentImages.length}`;
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.currentImages.length;
        this.showImage();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.currentImages.length) % this.currentImages.length;
        this.showImage();
    }
}

// Initialize all carousels on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        new Carousel(carousel);
    });

    // Initialize gallery
    new ImageGallery();
});

