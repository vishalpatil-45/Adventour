// Booking System with Step-by-Step Flow

class BookingSystem {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.bookingData = {
            destination: '',
            packageId: '',
            packageName: '',
            dateFrom: '',
            dateTo: '',
            adults: 1,
            children: 0,
            infants: 0,
            roomType: 'standard',
            addons: [],
            personalInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                country: ''
            },
            payment: {
                method: 'credit-card',
                cardNumber: '',
                cardName: '',
                expiryDate: '',
                cvv: ''
            },
            totalPrice: 0
        };
        this.init();
    }

    init() {
        this.loadURLParams();
        this.setupEventListeners();
        this.updateProgress();
        this.calculatePrice();
    }

    loadURLParams() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('package')) {
            this.bookingData.packageId = params.get('package');
        }
        if (params.has('name')) {
            this.bookingData.packageName = params.get('name');
        }
        if (params.has('date')) {
            this.bookingData.dateFrom = params.get('date');
        }

        // Update UI with loaded data
        const packageNameEl = document.querySelector('#selectedPackage');
        if (packageNameEl && this.bookingData.packageName) {
            packageNameEl.textContent = this.bookingData.packageName;
        }

        const dateFromEl = document.querySelector('#dateFrom');
        if (dateFromEl && this.bookingData.dateFrom) {
            dateFromEl.value = this.bookingData.dateFrom;
        }
    }

    setupEventListeners() {
        // Next/Previous buttons
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        // Guest counters
        this.setupGuestCounters();

        // Date inputs
        const dateFrom = document.querySelector('#dateFrom');
        const dateTo = document.querySelector('#dateTo');
        
        if (dateFrom) {
            dateFrom.addEventListener('change', (e) => {
                this.bookingData.dateFrom = e.target.value;
                if (dateTo) {
                    dateTo.setAttribute('min', e.target.value);
                }
                this.calculatePrice();
            });
        }

        if (dateTo) {
            dateTo.addEventListener('change', (e) => {
                this.bookingData.dateTo = e.target.value;
                this.calculatePrice();
            });
        }

        // Room type selection
        document.querySelectorAll('input[name="roomType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.bookingData.roomType = e.target.value;
                this.calculatePrice();
            });
        });

        // Add-ons checkboxes
        document.querySelectorAll('.addon-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const addonId = e.target.getAttribute('data-addon');
                const addonPrice = parseFloat(e.target.getAttribute('data-price') || '0');
                
                if (e.target.checked) {
                    this.bookingData.addons.push({
                        id: addonId,
                        price: addonPrice
                    });
                } else {
                    this.bookingData.addons = this.bookingData.addons.filter(a => a.id !== addonId);
                }
                this.calculatePrice();
            });
        });

        // Personal info inputs
        document.querySelectorAll('[data-personal-info]').forEach(input => {
            input.addEventListener('change', (e) => {
                const field = e.target.getAttribute('data-personal-info');
                this.bookingData.personalInfo[field] = e.target.value;
            });
        });

        // Payment method
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.bookingData.payment.method = e.target.value;
                this.updatePaymentForm();
            });
        });

        // Final booking button
        const confirmBtn = document.querySelector('#confirmBooking');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmBooking());
        }
    }

    setupGuestCounters() {
        ['adults', 'children', 'infants'].forEach(type => {
            const minusBtn = document.querySelector(`#${type}Minus`);
            const plusBtn = document.querySelector(`#${type}Plus`);
            const input = document.querySelector(`#${type}Count`);

            if (minusBtn && plusBtn && input) {
                minusBtn.addEventListener('click', () => {
                    let current = parseInt(input.value) || 0;
                    const min = type === 'adults' ? 1 : 0;
                    if (current > min) {
                        current--;
                        input.value = current;
                        this.bookingData[type] = current;
                        this.calculatePrice();
                    }
                });

                plusBtn.addEventListener('click', () => {
                    let current = parseInt(input.value) || 0;
                    const max = 20;
                    if (current < max) {
                        current++;
                        input.value = current;
                        this.bookingData[type] = current;
                        this.calculatePrice();
                    }
                });

                // Direct input
                input.addEventListener('change', (e) => {
                    const value = parseInt(e.target.value) || 0;
                    const min = type === 'adults' ? 1 : 0;
                    const max = 20;
                    const clamped = Math.max(min, Math.min(max, value));
                    input.value = clamped;
                    this.bookingData[type] = clamped;
                    this.calculatePrice();
                });
            }
        });
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }

        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.updateProgress();
            this.showStep(this.currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgress();
            this.showStep(this.currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    showStep(step) {
        document.querySelectorAll('.booking-step').forEach((stepEl, index) => {
            stepEl.style.display = index + 1 === step ? 'block' : 'none';
        });

        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 === step);
            indicator.classList.toggle('completed', index + 1 < step);
        });
    }

    updateProgress() {
        const progress = ((this.currentStep - 1) / (this.maxSteps - 1)) * 100;
        const progressBar = document.querySelector('.progress-bar-fill');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update step numbers
        const currentStepEl = document.querySelector('#currentStep');
        const totalStepsEl = document.querySelector('#totalSteps');
        if (currentStepEl) currentStepEl.textContent = this.currentStep;
        if (totalStepsEl) totalStepsEl.textContent = this.maxSteps;
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.booking-step:nth-child(${this.currentStep})`);
        if (!currentStepEl) return true;

        const requiredInputs = currentStepEl.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
                
                // Show error message
                let errorMsg = input.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });

        // Email validation
        const emailInput = currentStepEl.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.classList.add('error');
                isValid = false;
            }
        }

        // Phone validation
        const phoneInput = currentStepEl.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phoneInput.value)) {
                phoneInput.classList.add('error');
                isValid = false;
            }
        }

        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly', 'error');
        }

        return isValid;
    }

    calculatePrice() {
        let basePrice = 125000; // Default base price per person in INR
        
        // Get base price from package if available
        const packagePrice = document.querySelector('[data-package-price]');
        if (packagePrice) {
            basePrice = parseFloat(packagePrice.getAttribute('data-package-price'));
        }

        // Calculate days
        let days = 1;
        if (this.bookingData.dateFrom && this.bookingData.dateTo) {
            const from = new Date(this.bookingData.dateFrom);
            const to = new Date(this.bookingData.dateTo);
            days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) || 1;
        }

        // Calculate guests price
        const totalGuests = this.bookingData.adults + 
                           (this.bookingData.children * 0.5) + 
                           (this.bookingData.infants * 0.2);
        
        let subtotal = basePrice * totalGuests * days;

        // Room type multiplier
        const roomMultipliers = {
            'standard': 1,
            'deluxe': 1.5,
            'suite': 2
        };
        subtotal *= roomMultipliers[this.bookingData.roomType] || 1;

        // Add-ons
        const addonsTotal = this.bookingData.addons.reduce((sum, addon) => sum + addon.price, 0);
        subtotal += addonsTotal;

        // Tax (15%)
        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        this.bookingData.totalPrice = total;

        // Update UI
        this.updatePriceSummary(basePrice, days, totalGuests, subtotal, addonsTotal, tax, total);
    }

    formatIndianPrice(amount) {
        return '₹' + amount.toFixed(0).toLocaleString('en-IN');
    }

    updatePriceSummary(basePrice, days, guests, subtotal, addons, tax, total) {
        const elements = {
            basePrice: document.querySelector('#basePriceDisplay'),
            days: document.querySelector('#daysDisplay'),
            guests: document.querySelector('#guestsDisplay'),
            subtotal: document.querySelector('#subtotalDisplay'),
            addons: document.querySelector('#addonsDisplay'),
            tax: document.querySelector('#taxDisplay'),
            total: document.querySelector('#totalDisplay')
        };

        if (elements.basePrice) elements.basePrice.textContent = this.formatIndianPrice(basePrice);
        if (elements.days) elements.days.textContent = days;
        if (elements.guests) elements.guests.textContent = guests.toFixed(1);
        if (elements.subtotal) elements.subtotal.textContent = this.formatIndianPrice(subtotal);
        if (elements.addons) elements.addons.textContent = this.formatIndianPrice(addons);
        if (elements.tax) elements.tax.textContent = this.formatIndianPrice(tax);
        if (elements.total) elements.total.textContent = this.formatIndianPrice(total);
    }

    updatePaymentForm() {
        const paymentForms = document.querySelectorAll('.payment-form-section');
        paymentForms.forEach(form => {
            form.style.display = 'none';
        });

        const selectedForm = document.querySelector(`.payment-form-${this.bookingData.payment.method}`);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }
    }

    confirmBooking() {
        if (!this.validateCurrentStep()) {
            return;
        }

        // Show loading
        this.showNotification('Processing your booking...', 'info');

        // Simulate API call
        setTimeout(() => {
            // Save booking to localStorage for demo
            const bookingId = 'BK' + Date.now();
            const booking = {
                id: bookingId,
                ...this.bookingData,
                date: new Date().toISOString(),
                status: 'confirmed'
            };

            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Show success message
            this.showSuccessPage(bookingId);
        }, 2000);
    }

    showSuccessPage(bookingId) {
        const bookingForm = document.querySelector('.booking-form');
        if (bookingForm) {
            bookingForm.innerHTML = `
                <div class="booking-success">
                    <div class="success-icon">✓</div>
                    <h2>Booking Confirmed!</h2>
                    <p>Thank you for your booking. Your confirmation number is:</p>
                    <div class="booking-id">${bookingId}</div>
                    <p class="success-message">
                        We've sent a confirmation email to ${this.bookingData.personalInfo.email}
                        with all the details of your trip.
                    </p>
                    <div class="success-actions">
                        <a href="index.html" class="btn btn-primary">Back to Home</a>
                        <button onclick="window.print()" class="btn btn-secondary">Print Confirmation</button>
                    </div>
                </div>
            `;
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.booking-form')) {
        new BookingSystem();
    }
});

