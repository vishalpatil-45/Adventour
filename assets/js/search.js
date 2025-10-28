// Advanced Search & Filter Functionality

class SearchEngine {
    constructor() {
        this.packages = [];
        this.locations = [];
        this.filters = {
            destination: '',
            dateFrom: '',
            dateTo: '',
            maxPrice: 10000,
            category: 'all',
            rating: 0,
            guests: 1
        };
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.applyURLFilters();
    }

    loadData() {
        // Load package data from DOM
        document.querySelectorAll('.package-card').forEach(card => {
            this.packages.push({
                id: card.getAttribute('data-id'),
                title: card.querySelector('.package-title')?.textContent,
                price: parseInt(card.getAttribute('data-price') || '0'),
                category: card.getAttribute('data-category'),
                rating: parseFloat(card.getAttribute('data-rating') || '0'),
                destination: card.getAttribute('data-destination'),
                element: card
            });
        });

        // Load location data
        document.querySelectorAll('.location-card').forEach(card => {
            this.locations.push({
                id: card.getAttribute('data-id'),
                name: card.querySelector('.location-name')?.textContent,
                element: card
            });
        });
    }

    setupEventListeners() {
        // Hero search form
        const heroForm = document.getElementById('heroSearchForm');
        if (heroForm) {
            heroForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const destination = document.getElementById('searchInput').value;
                const dateFrom = document.getElementById('dateFrom').value;
                const dateTo = document.getElementById('dateTo').value;
                const price = document.getElementById('priceRange').value;
                
                // Redirect to package page with filters
                window.location.href = `package.html?destination=${encodeURIComponent(destination)}&dateFrom=${dateFrom}&dateTo=${dateTo}&price=${price}`;
            });
        }
        
        // Search input
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.destination = e.target.value.toLowerCase();
                this.filterPackages();
            });
        }

        // Price range
        const priceRange = document.querySelector('#priceRange');
        const priceDisplay = document.querySelector('#priceDisplay');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.filters.maxPrice = parseInt(e.target.value);
                if (priceDisplay) {
                    priceDisplay.textContent = `₹${this.formatIndianPrice(this.filters.maxPrice)}`;
                }
                this.filterPackages();
            });
        }

        // Category filters
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.category-filter').forEach(b => 
                    b.classList.remove('active'));
                btn.classList.add('active');
                this.filters.category = btn.getAttribute('data-category');
                this.filterPackages();
            });
        });

        // Sort dropdown
        const sortSelect = document.querySelector('#sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortPackages(e.target.value);
            });
        }

        // Date filters
        const dateFrom = document.querySelector('#dateFrom');
        const dateTo = document.querySelector('#dateTo');
        if (dateFrom) {
            dateFrom.addEventListener('change', (e) => {
                this.filters.dateFrom = e.target.value;
                if (dateTo) dateTo.setAttribute('min', e.target.value);
                this.filterPackages();
            });
        }
        if (dateTo) {
            dateTo.addEventListener('change', (e) => {
                this.filters.dateTo = e.target.value;
                this.filterPackages();
            });
        }
    }

    applyURLFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('destination')) {
            this.filters.destination = urlParams.get('destination').toLowerCase();
            const input = document.querySelector('#searchInput');
            if (input) input.value = urlParams.get('destination');
        }
        
        if (urlParams.has('price')) {
            this.filters.maxPrice = parseInt(urlParams.get('price'));
            const range = document.querySelector('#priceRange');
            if (range) range.value = this.filters.maxPrice;
            const display = document.querySelector('#priceDisplay');
            if (display) display.textContent = `₹${this.formatIndianPrice(this.filters.maxPrice)}`;
        }
        
        if (urlParams.has('date')) {
            this.filters.dateFrom = urlParams.get('date');
            const dateInput = document.querySelector('#dateFrom');
            if (dateInput) dateInput.value = this.filters.dateFrom;
        }

        this.filterPackages();
    }

    filterPackages() {
        let visibleCount = 0;

        this.packages.forEach(pkg => {
            let visible = true;

            // Filter by destination
            if (this.filters.destination && 
                !pkg.title?.toLowerCase().includes(this.filters.destination) &&
                !pkg.destination?.toLowerCase().includes(this.filters.destination)) {
                visible = false;
            }

            // Filter by price
            if (pkg.price > this.filters.maxPrice) {
                visible = false;
            }

            // Filter by category
            if (this.filters.category !== 'all' && 
                pkg.category !== this.filters.category) {
                visible = false;
            }

            // Filter by rating
            if (pkg.rating < this.filters.rating) {
                visible = false;
            }

            // Show/hide package
            if (visible) {
                pkg.element.style.display = 'block';
                setTimeout(() => pkg.element.classList.add('show'), 10);
                visibleCount++;
            } else {
                pkg.element.classList.remove('show');
                setTimeout(() => pkg.element.style.display = 'none', 300);
            }
        });

        // Update results count
        const resultsCount = document.querySelector('#resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'package' : 'packages'} found`;
        }

        // Show no results message
        const noResults = document.querySelector('#noResults');
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    sortPackages(sortBy) {
        const container = document.querySelector('.packages-grid');
        if (!container) return;

        const sortedPackages = [...this.packages].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'popular':
                    return b.rating - a.rating; // Use rating as popularity metric
                default:
                    return 0;
            }
        });

        sortedPackages.forEach(pkg => {
            container.appendChild(pkg.element);
        });
    }

    formatIndianPrice(price) {
        return price.toLocaleString('en-IN');
    }

    clearFilters() {
        this.filters = {
            destination: '',
            dateFrom: '',
            dateTo: '',
            maxPrice: 833000,
            category: 'all',
            rating: 0,
            guests: 1
        };

        // Reset UI
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) searchInput.value = '';
        
        const priceRange = document.querySelector('#priceRange');
        if (priceRange) priceRange.value = 833000;
        
        const priceDisplay = document.querySelector('#priceDisplay');
        if (priceDisplay) priceDisplay.textContent = '₹8,33,000';

        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            }
        });

        this.filterPackages();
    }
}

// Initialize search engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const searchEngine = new SearchEngine();

    // Clear filters button
    const clearBtn = document.querySelector('#clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchEngine.clearFilters();
        });
    }
});

