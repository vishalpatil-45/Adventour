// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');

    // Initialize wishlist icons
    initializeWishlistIcons();

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.textContent.toLowerCase().trim();

            packageCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = '';
                } else {
                    if (card.dataset.category === filterValue) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Wishlist functionality - use event delegation for robustness
    document.body.addEventListener('click', function delegatedWishlistHandler(e) {
        const heartEl = e.target.closest('.package-heart');
        if (!heartEl) return;

        // Prevent navigation but allow other handlers to run if needed
        e.preventDefault();
        e.stopPropagation();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Please log in to add items to your wishlist');
            if (typeof openLoginModal === 'function') {
                openLoginModal();
            }
            return false;
        }

        const packageCard = heartEl.closest('.package-card');
        if (!packageCard) return false;

        // Normalize package id as string
        const packageId = (packageCard.dataset.id || packageCard.getAttribute('data-id') || '').toString();

        // Extract package data safely
        const imgEl = packageCard.querySelector('img');
        const titleEl = packageCard.querySelector('.package-title');
        const locationEl = packageCard.querySelector('.package-location');
        const priceEl = packageCard.querySelector('.package-price');

        const packageData = {
            id: packageId,
            image: imgEl ? imgEl.src : '',
            title: titleEl ? titleEl.textContent.trim() : 'Package',
            location: locationEl ? locationEl.textContent.trim() : '',
            price: priceEl ? priceEl.textContent.trim() : '',
            category: packageCard.dataset.category || '',
            rating: packageCard.querySelector('.package-rating span')?.textContent || ''
        };

        toggleWishlist(packageData, heartEl);
        return false;
    }, false);
    
    // Prevent navigation when clicking on heart - must be on the anchor tag itself
    packageCards.forEach(card => {
        if (card.tagName === 'A') {
            // Card is an anchor tag - attach to it with capture phase
            card.addEventListener('click', function(e) {
                // If clicking on heart or anything inside heart container, don't navigate
                if (e.target.closest('.package-heart')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
            }, true); // Capture phase - executes BEFORE the bubble phase
        }
    });
});

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast show';
    toast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#FF385C';
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function initializeWishlistIcons() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`) || '[]');
    const wishlistButtons = document.querySelectorAll('.package-heart');

    wishlistButtons.forEach(button => {
        const packageCard = button.closest('.package-card');
        if (!packageCard) return;
        
        const packageId = packageCard.dataset.id;
        const heartIcon = button.querySelector('i');
        
        if (wishlist.some(item => item.id === packageId)) {
            if (heartIcon) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartIcon.style.color = '#FF385C';
            }
            button.classList.add('active');
        }
    });
}

function toggleWishlist(packageData, button) {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
        showToast('Please log in to add to wishlist', 'error');
        if (typeof openLoginModal === 'function') {
            openLoginModal();
        }
        return;
    }
    
    const currentUser = JSON.parse(currentUserStr);

    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`) || '[]');
    const heartIcon = button.querySelector('i');
    
    const existingIndex = wishlist.findIndex(item => item.id === packageData.id);
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        if (heartIcon) {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            heartIcon.style.color = '';
        }
        button.classList.remove('active');
        showToast('Removed from wishlist', 'error');
    } else {
        // Add to wishlist
        wishlist.push(packageData);
        if (heartIcon) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            heartIcon.style.color = '#FF385C';
        }
        button.classList.add('active');
        showToast('Added to wishlist!');
    }
    
    localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));

    // Update wishlist display if we're on the account page
    if (typeof loadWishlist === 'function') {
        loadWishlist();
    }
}