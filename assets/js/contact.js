// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initializeContactForm();
    
    // Initialize FAQ accordion
    initializeFAQ();
    
    // Initialize form validation
    initializeFormValidation();
});

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm();
        }
    });
}

// Initialize FAQ accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
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
    errorMessage.style.cssText = `
        color: #EF4444;
        font-size: 12px;
        margin-top: 4px;
        display: none;
    `;
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

// Validate entire contact form
function validateContactForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// Submit contact form
function submitContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Prepare data
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Simulate API call
    setTimeout(() => {
        // Hide loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // If newsletter was checked, show additional message
        if (contactData.newsletter) {
            setTimeout(() => {
                showNotification('You\'ve been subscribed to our newsletter!', 'info');
            }, 2000);
        }
        
    }, 2000);
}

// Show notification
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
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animations if not already present
if (!document.querySelector('#contact-animations')) {
    const style = document.createElement('style');
    style.id = 'contact-animations';
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
        
        .form-group.error input,
        .form-group.error select,
        .form-group.error textarea {
            border-color: #EF4444;
            box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
        }
        
        .error-message {
            color: #EF4444;
            font-size: 12px;
            margin-top: 4px;
            display: block;
        }
        
        .submit-btn.loading {
            opacity: 0.7;
            cursor: not-allowed;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

// Auto-save form data
function autoSaveForm() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    localStorage.setItem('contactFormData', JSON.stringify(formObject));
}

// Load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
        const formObject = JSON.parse(savedData);
        const form = document.getElementById('contact-form');
        
        Object.keys(formObject).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = formObject[key] === 'on';
                } else {
                    field.value = formObject[key];
                }
            }
        });
    }
}

// Add auto-save functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
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

// Smooth scrolling for anchor links
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

// Add loading animation to submit button
function addLoadingAnimation() {
    const submitButton = document.querySelector('.submit-btn');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.classList.add('loading');
            }
        });
    }
}

// Initialize loading animation
document.addEventListener('DOMContentLoaded', addLoadingAnimation);

console.log('Contact page loaded successfully!');


