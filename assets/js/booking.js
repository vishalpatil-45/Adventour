// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load selected package data
    loadSelectedPackage();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize date validation
    initializeDateValidation();
    
    // Initialize payment form
    initializePaymentForm();
    
    // Initialize form submission
    initializeFormSubmission();
});

// Load selected package data from localStorage
function loadSelectedPackage() {
    const selectedPackage = localStorage.getItem('selectedPackage');
    if (selectedPackage) {
        const packageData = JSON.parse(selectedPackage);
        updatePropertySummary(packageData);
    } else {
        // Default package if none selected
        updatePropertySummary({
            title: 'Luxury Beach Villa',
            location: 'Goa, India',
            price: '₹2,700',
            rating: '4.8 (124 reviews)',
            badge: 'Popular'
        });
    }
}

// Update property summary with selected package data
function updatePropertySummary(packageData) {
    const propertyTitle = document.querySelector('.property-details h3');
    const propertyLocation = document.querySelector('.property-details p');
    const propertyPrice = document.querySelector('.price');
    const propertyRating = document.querySelector('.property-rating span');
    
    if (propertyTitle) propertyTitle.textContent = packageData.title;
    if (propertyLocation) propertyLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${packageData.location}`;
    if (propertyPrice) propertyPrice.textContent = packageData.price;
    if (propertyRating && packageData.rating) propertyRating.textContent = packageData.rating;
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('booking-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    const errorMessage = fieldGroup.querySelector('.error-message') || createErrorMessage(fieldGroup);
    
    let isValid = true;
    let errorText = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorText = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorText = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorText = 'Please enter a valid phone number';
        }
    }
    
    // Card number validation
    if (field.name === 'cardNumber' && value) {
        const cardRegex = /^[0-9\s]{13,19}$/;
        if (!cardRegex.test(value)) {
            isValid = false;
            errorText = 'Please enter a valid card number';
        }
    }
    
    // CVV validation
    if (field.name === 'cvv' && value) {
        const cvvRegex = /^[0-9]{3,4}$/;
        if (!cvvRegex.test(value)) {
            isValid = false;
            errorText = 'Please enter a valid CVV';
        }
    }
    
    // Update field state
    if (isValid) {
        fieldGroup.classList.remove('error');
        errorMessage.textContent = '';
    } else {
        fieldGroup.classList.add('error');
        errorMessage.textContent = errorText;
    }
    
    return isValid;
}

// Create error message element
function createErrorMessage(fieldGroup) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    fieldGroup.appendChild(errorMessage);
    return errorMessage;
}

// Clear field error
function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.remove('error');
    const errorMessage = fieldGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

// Initialize date validation
function initializeDateValidation() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    
    checkInInput.addEventListener('change', function() {
        const checkInDate = new Date(this.value);
        const minCheckOut = new Date(checkInDate);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        
        checkOutInput.min = minCheckOut.toISOString().split('T')[0];
        
        if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
            checkOutInput.value = '';
        }
    });
    
    checkOutInput.addEventListener('change', function() {
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(this.value);
        
        if (checkOutDate <= checkInDate) {
            this.value = '';
            showNotification('Check-out date must be after check-in date', 'error');
        }
    });
}

// Initialize payment form
function initializePaymentForm() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    // Format card number
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Format CVV
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Initialize form submission
function initializeFormSubmission() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitBooking();
        }
    });
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('booking-form');
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Validate dates
    const checkInDate = new Date(document.getElementById('checkIn').value);
    const checkOutDate = new Date(document.getElementById('checkOut').value);
    
    if (checkOutDate <= checkInDate) {
        showNotification('Check-out date must be after check-in date', 'error');
        isFormValid = false;
    }
    
    return isFormValid;
}

// Submit booking
function submitBooking() {
    const submitButton = document.querySelector('.btn-primary');
    const form = document.getElementById('booking-form');
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Hide loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        // Show success message
        showBookingSuccess();

        // Save booking to localStorage for account page
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                // build booking object from form + selected package
                const selectedPackage = JSON.parse(localStorage.getItem('selectedPackage') || 'null');

                const bookingImage = (selectedPackage && selectedPackage.image) || 
                                   document.querySelector('.property-image img')?.src || 
                                   'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                
                const booking = {
                    id: Date.now().toString(),
                    title: (selectedPackage && selectedPackage.title) || document.querySelector('.property-details h3')?.textContent || 'Booking',
                    image: bookingImage,
                    location: (selectedPackage && selectedPackage.location) || document.querySelector('.property-details p')?.textContent || '',
                    checkIn: document.getElementById('checkIn')?.value || '',
                    checkOut: document.getElementById('checkOut')?.value || '',
                    guests: document.getElementById('guests')?.value || '',
                    rooms: document.getElementById('rooms')?.value || '',
                    status: 'Confirmed'
                };

                const key = 'bookings_' + currentUser.id;
                const bookings = JSON.parse(localStorage.getItem(key) || '[]');
                bookings.push(booking);
                localStorage.setItem(key, JSON.stringify(bookings));
            }
        } catch (err) {
            console.error('Failed to save booking:', err);
        }

        // Clear form
        form.reset();

        // Clear selected package
        localStorage.removeItem('selectedPackage');
    }, 2000);
}

// Show booking success
function showBookingSuccess() {
    const bookingContent = document.querySelector('.booking-content');
    
    bookingContent.innerHTML = `
        <div class="booking-success">
            <i class="fas fa-check-circle"></i>
            <h2>Booking Confirmed!</h2>
            <p>Your booking has been successfully confirmed. You will receive a confirmation email shortly.</p>
            <div class="form-actions">
                <button class="btn-primary" onclick="window.location.href='./index.html'">
                    <i class="fas fa-home"></i>
                    Back to Home
                </button>
                <button class="btn-secondary" onclick="window.print()">
                    <i class="fas fa-print"></i>
                    Print Confirmation
                </button>
            </div>
        </div>
    `;
}

// Calculate total price
function calculateTotal() {
    const basePrice = 2700; // Base price per night
    const checkInDate = new Date(document.getElementById('checkIn').value);
    const checkOutDate = new Date(document.getElementById('checkOut').value);
    
    if (checkInDate && checkOutDate) {
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalBasePrice = basePrice * nights;
        const serviceFee = Math.round(totalBasePrice * 0.1);
        const taxes = Math.round(totalBasePrice * 0.15);
        const total = totalBasePrice + serviceFee + taxes;
        
        // Update summary
        updateBookingSummary(totalBasePrice, serviceFee, taxes, total);
    }
}

// Update booking summary
function updateBookingSummary(basePrice, serviceFee, taxes, total) {
    const summaryItems = document.querySelectorAll('.summary-item');
    
    if (summaryItems.length >= 4) {
        summaryItems[0].querySelector('span:last-child').textContent = `₹${basePrice.toLocaleString()}`;
        summaryItems[1].querySelector('span:last-child').textContent = `₹${serviceFee.toLocaleString()}`;
        summaryItems[2].querySelector('span:last-child').textContent = `₹${taxes.toLocaleString()}`;
        summaryItems[3].querySelector('span:last-child').textContent = `₹${total.toLocaleString()}`;
    }
}

// Add event listeners for price calculation
document.addEventListener('DOMContentLoaded', function() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput) {
        checkInInput.addEventListener('change', calculateTotal);
    }
    
    if (checkOutInput) {
        checkOutInput.addEventListener('change', calculateTotal);
    }
});

// Auto-save form data
function autoSaveForm() {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    localStorage.setItem('bookingFormData', JSON.stringify(formObject));
}

// Load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('bookingFormData');
    if (savedData) {
        const formObject = JSON.parse(savedData);
        const form = document.getElementById('booking-form');
        
        Object.keys(formObject).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = formObject[key];
            }
        });
    }
}

// Add auto-save functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    
    // Load saved data
    loadSavedFormData();
    
    // Auto-save on input
    form.addEventListener('input', debounce(autoSaveForm, 1000));
});

// Debounce function
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

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: var(--text-dark);
        color: var(--white);
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    e.target.tooltipElement = tooltip;
}

// Hide tooltip
function hideTooltip(e) {
    if (e.target.tooltipElement) {
        e.target.tooltipElement.remove();
        e.target.tooltipElement = null;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    loadSavedFormData();
});

console.log('Booking page loaded successfully!');
