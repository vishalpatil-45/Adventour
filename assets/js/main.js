// Main JavaScript for Adventour Tourism Website
// Modern, Airbnb-style functionality

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        navbar.classList.remove('scrolled');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close menu when clicking on a link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    });
});

// ===== SEARCH FUNCTIONALITY =====
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    const searchInput = searchForm.querySelector('input[type="text"]');
    const dateInput = searchForm.querySelector('input[type="date"]');
    const priceRange = searchForm.querySelector('input[type="range"]');
    const priceDisplay = searchForm.querySelector('#result');
    
    // Update price display
    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            priceDisplay.textContent = value.toLocaleString('en-IN');
        });
    }
    
    // Handle search
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destination = searchInput.value;
        const date = dateInput.value;
        const maxPrice = priceRange.value;
        
        console.log('Searching:', { destination, date, maxPrice });
        // Redirect to packages with filters
        window.location.href = `package.html?destination=${destination}&date=${date}&price=${maxPrice}`;
    });
}

// ===== DATE PICKER ENHANCEMENT =====
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    input.setAttribute('min', today);
});

// ===== SMOOTH SCROLL =====
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

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .service-card, .location-card, .package-card').forEach(el => {
    observer.observe(el);
});

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 10);
                } else {
                    card.classList.remove('show');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// Initialize filters if they exist
if (document.querySelector('.filter-btn')) {
    initializeFilters();
}

// ===== PRICE RANGE FILTER =====
function filterByPrice(maxPrice) {
    const cards = document.querySelectorAll('.package-card');
    
    cards.forEach(card => {
        const price = parseInt(card.getAttribute('data-price') || '0');
        if (price <= maxPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== TESTIMONIAL SLIDER =====
function initializeTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = slider.querySelectorAll('.dot');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    // Auto slide
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
}

initializeTestimonialSlider();

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== LAZY LOADING IMAGES =====
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== FORM VALIDATION =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// ===== LIKE/FAVORITE FUNCTIONALITY =====
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        
        // Save to localStorage
        const itemId = btn.getAttribute('data-id');
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (btn.classList.contains('active')) {
            favorites.push(itemId);
        } else {
            favorites = favorites.filter(id => id !== itemId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    });
});

// Load favorites on page load
window.addEventListener('load', () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites.forEach(id => {
        const btn = document.querySelector(`.favorite-btn[data-id="${id}"]`);
        if (btn) btn.classList.add('active');
    });
});

// ===== GUEST COUNTER =====
const guestInputs = document.querySelectorAll('.guest-input');
guestInputs.forEach(container => {
    const minusBtn = container.querySelector('.minus');
    const plusBtn = container.querySelector('.plus');
    const input = container.querySelector('input');
    
    if (minusBtn && plusBtn && input) {
        minusBtn.addEventListener('click', () => {
            const current = parseInt(input.value) || 0;
            const min = parseInt(input.getAttribute('min')) || 0;
            if (current > min) {
                input.value = current - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            const current = parseInt(input.value) || 0;
            const max = parseInt(input.getAttribute('max')) || 99;
            if (current < max) {
                input.value = current + 1;
            }
        });
    }
});

console.log('🚀 Adventour - Loaded successfully!');

