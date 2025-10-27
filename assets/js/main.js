// Modern JavaScript for Adventour Website

// DOM Elements (use IDs/selectors present in index.html and guard usage)
const header = document.getElementById('header');
const searchForm = document.getElementById('searchForm');
const destinationInput = document.getElementById('destinationInput');
const checkInInput = document.getElementById('checkInDate');
const checkOutInput = document.getElementById('checkOutDate');
const guestsSelect = document.getElementById('guestsSelect');
const filterBtns = document.querySelectorAll('.filter-btn');
const packageCards = document.querySelectorAll('.package-card');
const heartIcons = document.querySelectorAll('.package-heart i');

// Header scroll effect
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Search form submission (guarded)
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destination = (destinationInput && destinationInput.value) || '';
        const checkIn = (checkInInput && checkInInput.value) || '';
        const checkOut = (checkOutInput && checkOutInput.value) || '';
        const guests = (guestsSelect && guestsSelect.value) || '';

        const searchData = { destination, checkIn, checkOut, guests };
        console.log('Search data:', searchData);
        showNotification('Searching for properties...', 'info');
    });
}

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.textContent.toLowerCase();
        filterPackages(filter);
    });
});

function filterPackages(filter) {
    packageCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const isVisible = filter === 'all' || cardText.includes(filter);
        
        card.style.display = isVisible ? 'block' : 'none';
        card.style.opacity = isVisible ? '1' : '0';
        card.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
    });
}

// Heart/favorite functionality
heartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        // Prevent default navigation but allow other handlers (e.g. wishlist handler)
        // Do NOT call stopImmediatePropagation here because it blocks other listeners
        e.stopPropagation();
    });
});

// Package card click functionality - handle clicks on anchor tags
document.addEventListener('DOMContentLoaded', function() {
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        if (card.tagName === 'A') {
            // Only attach handler if card is an anchor
            card.addEventListener('click', function(e) {
                // Don't navigate if clicking on heart or anything inside heart container
                if (e.target.closest('.package-heart') || e.target.classList.contains('package-heart')) {
                    return; // Let the wishlist handler work
                }
                
                // Extract data and navigate
                const title = card.querySelector('.package-title').textContent;
                const price = card.querySelector('.package-price').textContent;
                const location = card.querySelector('.package-location').textContent;
                const image = card.querySelector('img')?.src || '';
                
                // Store package data for booking
                localStorage.setItem('selectedPackage', JSON.stringify({
                    title,
                    price,
                    location,
                    image,
                    id: card.dataset.id
                }));
            });
        }
    });
});

// Location card click functionality
const locationCards = document.querySelectorAll('.location-card');
locationCards.forEach(card => {
    card.addEventListener('click', () => {
        const location = card.querySelector('.location-title').textContent;
        const country = card.querySelector('.location-subtitle').textContent;
        
        // Filter packages by location
        filterPackagesByLocation(location);
        showNotification(`Showing properties in ${location}, ${country}`, 'info');
    });
});

function filterPackagesByLocation(location) {
    packageCards.forEach(card => {
        const cardLocation = card.querySelector('.package-location').textContent.toLowerCase();
        const isVisible = cardLocation.includes(location.toLowerCase());
        
        card.style.display = isVisible ? 'block' : 'none';
        card.style.opacity = isVisible ? '1' : '0';
    });
}

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Thank you for subscribing!', 'success');
        newsletterForm.reset();
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-content i {
        font-size: 18px;
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .package-card, .location-card').forEach(el => {
    observer.observe(el);
});

// Price range slider functionality
function createPriceSlider() {
    const priceRange = document.createElement('div');
    priceRange.className = 'price-range';
    priceRange.innerHTML = `
        <label>Price Range: ₹<span id="min-price">1000</span> - ₹<span id="max-price">50000</span></label>
        <div class="slider-container">
            <input type="range" id="price-slider" min="1000" max="50000" value="25000" step="1000">
        </div>
    `;
    
    const slider = priceRange.querySelector('#price-slider');
    const minPrice = priceRange.querySelector('#min-price');
    const maxPrice = priceRange.querySelector('#max-price');
    
    slider.addEventListener('input', () => {
        const value = slider.value;
        maxPrice.textContent = value;
        filterByPrice(parseInt(value));
    });
    
    return priceRange;
}

function filterByPrice(maxPrice) {
    packageCards.forEach(card => {
        const priceText = card.querySelector('.package-price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        
        if (price <= maxPrice) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Initialize price slider
document.addEventListener('DOMContentLoaded', () => {
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        const priceSlider = createPriceSlider();
        filterBar.appendChild(priceSlider);
    }
});

// Search suggestions
let searchSuggestions = [
    'Goa, India',
    'Kashmir, India',
    'Mumbai, India',
    'Dubai, UAE',
    'Bali, Indonesia',
    'Paris, France',
    'Istanbul, Turkey',
    'Geneva, Switzerland',
    'Thailand',
    'Vietnam',
    'Egypt'
];

function createSuggestions() {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    `;
    
    return suggestionsContainer;
}

// Add search suggestions to search inputs
document.querySelectorAll('input[type="text"]').forEach(input => {
    const suggestionsContainer = createSuggestions();
    input.parentNode.appendChild(suggestionsContainer);
    
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 0) {
            const filtered = searchSuggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(query)
            );
            
            suggestionsContainer.innerHTML = filtered.map(suggestion => 
                `<div class="suggestion-item" style="padding: 12px; cursor: pointer; border-bottom: 1px solid #eee;">${suggestion}</div>`
            ).join('');
            
            suggestionsContainer.style.display = 'block';
            
            // Add click handlers to suggestions
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    input.value = item.textContent;
                    suggestionsContainer.style.display = 'none';
                });
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
});

// Loading states
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    showNotification('Something went wrong. Please try again.', 'error');
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced search
const debouncedSearch = debounce((query) => {
    console.log('Searching for:', query);
    // Implement search logic here
}, 300);

// Add search input listeners
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
});

// Search functionality with destinations
const destinations = [
    // India
    'Kashmir, India', 'Goa, India', 'Mumbai, India', 'Delhi, India', 'Kerala, India', 'Pune, India',
    'Bangalore, India', 'Chennai, India', 'Hyderabad, India', 'Jaipur, India', 'Agra, India', 'Varanasi, India',
    'Shimla, India', 'Manali, India', 'Darjeeling, India', 'Ooty, India', 'Mysore, India', 'Kochi, India',
    'Rishikesh, India', 'Haridwar, India', 'Amritsar, India', 'Jodhpur, India', 'Udaipur, India', 'Jaisalmer, India',
    
    // International
    'Paris, France', 'London, UK', 'New York, USA', 'Los Angeles, USA', 'Dubai, UAE', 'Bali, Indonesia',
    'Bangkok, Thailand', 'Singapore', 'Tokyo, Japan', 'Sydney, Australia', 'Melbourne, Australia',
    'Rome, Italy', 'Barcelona, Spain', 'Amsterdam, Netherlands', 'Berlin, Germany', 'Prague, Czech Republic',
    'Vienna, Austria', 'Zurich, Switzerland', 'Geneva, Switzerland', 'Istanbul, Turkey', 'Cairo, Egypt',
    'Cape Town, South Africa', 'Marrakech, Morocco', 'Lisbon, Portugal', 'Athens, Greece', 'Stockholm, Sweden',
    'Oslo, Norway', 'Copenhagen, Denmark', 'Helsinki, Finland', 'Warsaw, Poland', 'Budapest, Hungary',
    'Krakow, Poland', 'Bratislava, Slovakia', 'Ljubljana, Slovenia', 'Zagreb, Croatia', 'Sarajevo, Bosnia',
    'Belgrade, Serbia', 'Sofia, Bulgaria', 'Bucharest, Romania', 'Chisinau, Moldova', 'Kiev, Ukraine',
    'Minsk, Belarus', 'Vilnius, Lithuania', 'Riga, Latvia', 'Tallinn, Estonia', 'Reykjavik, Iceland',
    'Dublin, Ireland', 'Edinburgh, UK', 'Glasgow, UK', 'Manchester, UK', 'Birmingham, UK',
    'Liverpool, UK', 'Leeds, UK', 'Newcastle, UK', 'Cardiff, UK', 'Belfast, UK',
    'Montreal, Canada', 'Toronto, Canada', 'Vancouver, Canada', 'Calgary, Canada', 'Ottawa, Canada',
    'Quebec City, Canada', 'Halifax, Canada', 'Winnipeg, Canada', 'Edmonton, Canada', 'Victoria, Canada',
    'Mexico City, Mexico', 'Cancun, Mexico', 'Playa del Carmen, Mexico', 'Tulum, Mexico', 'Puerto Vallarta, Mexico',
    'Guadalajara, Mexico', 'Monterrey, Mexico', 'Puebla, Mexico', 'Oaxaca, Mexico', 'San Miguel de Allende, Mexico',
    'Buenos Aires, Argentina', 'Santiago, Chile', 'Lima, Peru', 'Bogota, Colombia', 'Caracas, Venezuela',
    'Quito, Ecuador', 'La Paz, Bolivia', 'Asuncion, Paraguay', 'Montevideo, Uruguay', 'Brasilia, Brazil',
    'Sao Paulo, Brazil', 'Rio de Janeiro, Brazil', 'Salvador, Brazil', 'Recife, Brazil', 'Fortaleza, Brazil',
    'Manaus, Brazil', 'Belem, Brazil', 'Curitiba, Brazil', 'Porto Alegre, Brazil', 'Campinas, Brazil'
];

// Initialize search functionality
function initializeSearch() {
    const destinationInput = document.getElementById('destinationInput');
    const suggestionsDropdown = document.getElementById('suggestionsDropdown');
    const searchForm = document.getElementById('searchForm');
    
    if (!destinationInput || !suggestionsDropdown || !searchForm) return;
    
    // Show suggestions on input
    destinationInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        if (query.length > 0) {
            const filtered = destinations.filter(dest => 
                dest.toLowerCase().includes(query)
            );
            
            suggestionsDropdown.innerHTML = filtered.map(dest => 
                `<div class="suggestion-item" data-destination="${dest}">${dest}</div>`
            ).join('');
            
            suggestionsDropdown.style.display = 'block';
            
            // Add click handlers to suggestions
            suggestionsDropdown.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    destinationInput.value = item.textContent;
                    suggestionsDropdown.style.display = 'none';
                });
            });
        } else {
            suggestionsDropdown.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!destinationInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
            suggestionsDropdown.style.display = 'none';
        }
    });
    
    // Handle form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const destination = destinationInput.value;
        const checkIn = document.getElementById('checkInDate').value;
        const checkOut = document.getElementById('checkOutDate').value;
        const guests = document.getElementById('guestsSelect').value;
        
        if (destination && checkIn && checkOut) {
            // Filter packages based on search
            filterPackagesBySearch(destination, checkIn, checkOut, guests);
            showNotification(`Searching for properties in ${destination}`, 'info');
        } else {
            showNotification('Please fill in all search fields', 'error');
        }
    });
}

// Filter packages based on search
function filterPackagesBySearch(destination, checkIn, checkOut, guests) {
    const packageCards = document.querySelectorAll('.package-card');
    const destinationLower = destination.toLowerCase();
    
    packageCards.forEach(card => {
        const cardLocation = card.querySelector('.package-location').textContent.toLowerCase();
        const isVisible = cardLocation.includes(destinationLower);
        
        card.style.display = isVisible ? 'block' : 'none';
        card.style.opacity = isVisible ? '1' : '0';
        card.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
    });
}

// Modal functionality
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeLoginModal();
    setTimeout(() => openSignupModal(), 300);
}

function switchToLogin() {
    closeSignupModal();
    setTimeout(() => openLoginModal(), 300);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (e.target === loginModal) {
        closeLoginModal();
    }
    if (e.target === signupModal) {
        closeSignupModal();
    }
});

// Form submissions are now handled in auth.js

// Initialize filter functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            filterPackages(filter);
        });
    });
}

// Filter packages by type
function filterPackages(filter) {
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            const badge = card.querySelector('.package-badge');
            const cardType = badge ? badge.textContent.toLowerCase() : '';
            
            // Map badges to filter types
            const typeMapping = {
                'popular': 'beach',
                'new': 'mountain',
                'trending': 'city',
                'luxury': 'luxury',
                'exotic': 'beach',
                'romantic': 'city',
                'nature': 'mountain',
                'tropical': 'beach',
                'historic': 'city'
            };
            
            const cardTypeFilter = typeMapping[cardType] || cardType;
            const isVisible = cardTypeFilter.includes(filter) || badge.textContent.toLowerCase().includes(filter);
            
            card.style.display = isVisible ? 'block' : 'none';
            card.style.opacity = isVisible ? '1' : '0';
            card.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
        }
    });
}

// Make property cards clickable to redirect to booking page
function initializePropertyClicks() {
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        // Only add event listener if card doesn't already have href
        if (!card.getAttribute('href')) {
            card.addEventListener('click', function(e) {
                // Don't redirect if clicking on heart
                if (e.target.closest('.package-heart')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                
                const title = card.querySelector('.package-title').textContent;
                const location = card.querySelector('.package-location').textContent;
                const price = card.querySelector('.package-price').textContent;
                const rating = card.querySelector('.package-rating span').textContent;
                const badge = card.querySelector('.package-badge')?.textContent || '';
                
                // Store package data
                localStorage.setItem('selectedPackage', JSON.stringify({
                    title,
                    location,
                    price,
                    rating,
                    badge
                }));
                
                // Redirect to booking page
                window.location.href = './booking.html';
            });
        }
    });
}

// Initialize heart/like functionality
function initializeLikeButtons() {
    const heartIcons = document.querySelectorAll('.package-heart i');
    
    heartIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Don't handle the toggle here - let filters_new.js handle it
            // This is just to prevent navigation
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializePropertyClicks();
    initializeLikeButtons();
});

console.log('Adventour website loaded successfully!');
