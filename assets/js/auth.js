// Auth related functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('signupModal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.getElementById('loginModal').style.display = 'none';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        // Remove any existing listeners
        const newLoginForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newLoginForm, loginForm);
        
        newLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store logged in user info
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateAuthUI(true);
                closeLoginModal();
                showToast('Login successful!', 'success');
                
                // Small delay before reload to show toast
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showToast('Invalid email or password', 'error');
            }
        });
    }
    
    if (signupForm) {
        // Remove any existing listeners
        const newSignupForm = signupForm.cloneNode(true);
        signupForm.parentNode.replaceChild(newSignupForm, signupForm);
        
        newSignupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('signupFirstName').value;
            const lastName = document.getElementById('signupLastName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            if (users.some(user => user.email === email)) {
                showToast('An account with this email already exists', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                firstName,
                lastName,
                email,
                password,
                wishlist: []
            };
            
            // Add to users array
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Update UI
            updateAuthUI(true);
            closeSignupModal();
            showToast('Account created successfully!', 'success');
            
            // Small delay before reload to show toast
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
});

function showToast(message, type = 'success') {
    // Check if toast element exists, if not create it
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'toast show';
    toast.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
    toast.style.cssText += `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
    `;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function updateAuthUI(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        authButtons.innerHTML = `
            <a href="./account.html" class="auth-btn account-btn">My Account</a>
            <button class="auth-btn logout-btn" onclick="logout()">Log out</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="auth-btn login-btn" onclick="openLoginModal()">Log in</button>
            <button class="auth-btn signup-btn" onclick="openSignupModal()">Sign up</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI(false);
    window.location.href = 'index.html';
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    updateAuthUI(!!currentUser);
});