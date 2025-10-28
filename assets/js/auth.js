// Authentication System for Adventour

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal();
            });
        }

        // Close modal
        const closeBtn = document.getElementById('closeAuthModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAuthModal());
        }

        // Modal backdrop click
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAuthModal();
                }
            });
        }

        // Switch to signup
        const showSignup = document.getElementById('showSignup');
        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToSignup();
            });
        }

        // Switch to login
        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToLogin();
            });
        }

        // Continue as guest buttons
        const guestBtns = document.querySelectorAll('#continueAsGuest, #continueAsGuestSignup');
        guestBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.continueAsGuest();
            });
        });

        // Login form submission
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Signup form submission
        const signupForm = document.getElementById('signupFormElement');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(e);
            });
        }

        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    switchToSignup() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    }

    switchToLogin() {
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }

    handleLogin(e) {
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isGuest: false
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUIForLoggedInUser();
            this.closeAuthModal();
            this.showNotification('Welcome back, ' + user.firstName + '!', 'success');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    handleSignup(e) {
        const form = e.target;
        const firstName = form.querySelector('input[placeholder="John"]').value;
        const lastName = form.querySelector('input[placeholder="Doe"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[placeholder="Create a password"]').value;
        const confirmPassword = form.querySelector('input[placeholder="Confirm your password"]').value;

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            this.showNotification('An account with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Log in the user
        this.currentUser = {
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            isGuest: false
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.updateUIForLoggedInUser();
        this.closeAuthModal();
        this.showNotification('Account created successfully! Welcome, ' + firstName + '!', 'success');
    }

    continueAsGuest() {
        this.currentUser = {
            email: 'guest@adventour.com',
            firstName: 'Guest',
            lastName: 'User',
            isGuest: true
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUIForLoggedInUser();
        this.closeAuthModal();
        this.showNotification('Continuing as guest', 'info');
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('loginBtn');
        const accountLink = document.getElementById('accountLink');

        if (loginBtn && this.currentUser) {
            loginBtn.textContent = this.currentUser.firstName;
            loginBtn.style.pointerEvents = 'none';
        }

        if (accountLink && this.currentUser) {
            accountLink.style.display = 'block';
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        const loginBtn = document.getElementById('loginBtn');
        const accountLink = document.getElementById('accountLink');

        if (loginBtn) {
            loginBtn.textContent = 'Login / Sign Up';
            loginBtn.style.pointerEvents = 'auto';
        }

        if (accountLink) {
            accountLink.style.display = 'none';
        }

        this.showNotification('Logged out successfully', 'info');
        
        // Redirect to home if on account page
        if (window.location.pathname.includes('account.html')) {
            window.location.href = './index.html';
        }
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

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize authentication system
const authSystem = new AuthSystem();

// Export for use in other files
window.authSystem = authSystem;

