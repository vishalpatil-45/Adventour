document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserData();
    loadBookings();
    loadWishlist();
    setupTabNavigation();
    bindProfileForm();

    // Add CSS variables for the new styles
    document.documentElement.style.setProperty('--success', '#22c55e');
    document.documentElement.style.setProperty('--success-light', '#dcfce7');
    document.documentElement.style.setProperty('--danger', '#ef4444');
    document.documentElement.style.setProperty('--danger-light', '#fee2e2');
    document.documentElement.style.setProperty('--danger-dark', '#dc2626');
});

function isUserLoggedIn() {
    return !!localStorage.getItem('currentUser');
}

function getCurrentUser() {
    // Support legacy 'user' key: migrate it to 'currentUser' if present
    const current = localStorage.getItem('currentUser');
    if (current) return JSON.parse(current);

    const legacy = localStorage.getItem('user');
    if (legacy) {
        try {
            localStorage.setItem('currentUser', legacy);
            localStorage.removeItem('user');
            return JSON.parse(legacy);
        } catch (e) {
            return JSON.parse(legacy);
        }
    }

    return null;
}

function loadUserData() {
    const user = getCurrentUser();
    if (!user) return;

    const displayName = user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email);
    document.getElementById('userName').textContent = displayName;
    document.getElementById('userEmail').textContent = user.email || '';
    
    // Set user avatar
    const userAvatarElement = document.getElementById('userAvatar');
    if (userAvatarElement) {
        if (user.avatar) {
            userAvatarElement.src = user.avatar;
        } else {
            userAvatarElement.src = './assets/files/default-avatar.png';
        }

        // Handle avatar click for image upload
        document.querySelector('.user-avatar').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        userAvatarElement.src = e.target.result;
                        user.avatar = e.target.result;
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        });
    }
    
    // Fill profile form
    document.getElementById('fullName').value = displayName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
}

function loadBookings() {
    const user = getCurrentUser();
    const bookingsGrid = document.getElementById('bookingsGrid');
    if (!user || !bookingsGrid) return;

    let bookings = JSON.parse(localStorage.getItem('bookings_' + user.id) || '[]');
    
    // Filter out empty bookings and bookings without title or location
    bookings = bookings.filter(booking => 
        booking && 
        booking.title && 
        booking.title.trim() !== '' && 
        booking.title.trim() !== 'Booking' &&
        booking.location && booking.location.trim() !== ''
    );
    
    if (!bookings || bookings.length === 0) {
        bookingsGrid.innerHTML = '<p class="no-items">No bookings yet</p>';
        return;
    }

    // Sort bookings by date (most recent first)
    bookings = bookings.sort((a, b) => 
        new Date(b.bookingDate || b.checkIn) - new Date(a.bookingDate || a.checkIn)
    );

    bookingsGrid.innerHTML = bookings.map(booking => `
        <div class="booking-card" data-booking-id="${booking.id}">
            <img src="${booking.image || ''}" alt="${booking.title}">
            <div class="booking-details">
                <h3>${booking.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${booking.location}</p>
                <div class="booking-info">
                    <p class="date-range">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Check-in: ${formatDate(booking.checkIn)}</span>
                        <span>Check-out: ${formatDate(booking.checkOut)}</span>
                    </p>
                    <p class="guests">
                        <i class="fas fa-users"></i>
                        <span>${booking.guests} guests</span>
                    </p>
                    <div class="booking-status ${booking.status ? booking.status.toLowerCase() : ''}">${booking.status || 'Confirmed'}</div>
                </div>
                ${booking.status && booking.status.toLowerCase() === 'cancelled' ? '' : `<button class="cancel-booking-btn" onclick="confirmCancelBooking('${booking.id}')"><i class="fas fa-times"></i> Cancel Booking</button>`}
            </div>
        </div>
    `).join('');
}



function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function confirmCancelBooking(bookingId) {
    // Create and show confirmation dialog
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <div class="confirm-dialog-content">
            <h3>Cancel Booking</h3>
            <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div class="confirm-dialog-buttons">
                <button class="btn-secondary" onclick="closeConfirmDialog()">No, Keep it</button>
                <button class="btn-danger" onclick="cancelBooking('${bookingId}')">Yes, Cancel Booking</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    
    // Show dialog with animation
    requestAnimationFrame(() => {
        dialog.classList.add('active');
    });
}

function closeConfirmDialog() {
    const dialog = document.querySelector('.confirm-dialog');
    if (dialog) {
        dialog.classList.remove('active');
        setTimeout(() => dialog.remove(), 300);
    }
}

function cancelBooking(bookingId) {
    const user = getCurrentUser();
    if (!user) return;

    let bookings = JSON.parse(localStorage.getItem('bookings_' + user.id) || '[]');
    
    // Update booking status instead of removing it
    bookings = bookings.map(booking => {
        if (booking.id === bookingId) {
            return { ...booking, status: 'Cancelled' };
        }
        return booking;
    });

    localStorage.setItem('bookings_' + user.id, JSON.stringify(bookings));
    
    // Close dialog and reload bookings
    closeConfirmDialog();
    loadBookings();
}

function loadWishlist() {
    const user = getCurrentUser();
    const wishlistGrid = document.getElementById('wishlistGrid');
    if (!user || !wishlistGrid) return;

    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');

    if (!wishlist || wishlist.length === 0) {
        wishlistGrid.innerHTML = '<p class="no-items">No items in wishlist</p>';
        return;
    }

    wishlistGrid.innerHTML = wishlist.map(item => `
        <div class="booking-card wishlist-item" data-id="${item.id}" data-category="${item.category || 'popular'}">
            <img src="${item.image || ''}" alt="${item.title}" class="wishlist-image">
            <div class="package-heart active" onclick="removeFromWishlist(event, '${item.id}')">
                <i class="fas fa-heart"></i>
            </div>
            <div class="wishlist-content" onclick="selectPackageForBooking(event, '${item.id}')" style="cursor: pointer;">
                <div class="package-location" title="${item.location}">
                    <i class="fas fa-map-marker-alt"></i> ${item.location}
                </div>
                <h3 class="package-title" title="${item.title}">${item.title}</h3>
                <div class="package-price">
                    ${item.price || '₹2,700'} / night
                </div>
                <div class="package-rating">
                    <div class="stars">★★★★★</div>
                    <span>${item.rating || '4.8 (124 reviews)'}</span>
                </div>
                <button class="book-btn" onclick="selectPackageForBooking(event, '${item.id}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

function setupTabNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const tab = document.getElementById(tabName);
            if (tab) tab.classList.add('active');
        });
    });
}

function removeFromWishlist(event, packageId) {
    event.preventDefault();
    event.stopPropagation();
    
    const user = getCurrentUser();
    if (!user) return;

    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    wishlist = wishlist.filter(item => item.id !== packageId);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    
    // Show notification
    alert('Removed from wishlist');
    
    loadWishlist();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function bindProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) return;

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const newPassword = document.getElementById('newPassword').value;

        // Update currentUser
        // Try to split fullName into first/last
        if (fullName) {
            const parts = fullName.split(' ');
            user.firstName = parts.shift();
            user.lastName = parts.join(' ');
            user.name = fullName;
        }
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (newPassword) user.password = newPassword;

        // Update users array if present
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx > -1) {
            users[idx] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Save currentUser
        localStorage.setItem('currentUser', JSON.stringify(user));

        alert('Profile updated successfully!');
        loadUserData();
    });
}

// Helper: when clicking an item in wishlist, store selectedPackage and go to booking page
function selectPackageForBooking(e, packageId) {
    e.preventDefault();
    e.stopPropagation();
    
    const user = getCurrentUser();
    if (!user) return;

    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const selectedPackage = wishlist.find(p => p.id === packageId);
    
    if (selectedPackage) {
        // Store full package details for booking page
        localStorage.setItem('selectedPackage', JSON.stringify({
            ...selectedPackage,
            rating: selectedPackage.rating || '4.8',
            reviews: selectedPackage.reviews || '124',
            category: selectedPackage.category || 'Popular'
        }));
        window.location.href = './booking.html';
    }
}