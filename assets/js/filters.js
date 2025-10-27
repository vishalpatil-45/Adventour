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

            const filterValue = button.textContent.toLowerCase();

            packageCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else {
                    // Check if card has the category class
                    if (card.dataset.category.toLowerCase() === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.package-heart');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the card link from activating
            const packageId = button.closest('.package-card').dataset.id;
            
            if (!isUserLoggedIn()) {
                showLoginModal();
                return;
            }

            toggleWishlist(packageId, button);
        });
    });
});

function isUserLoggedIn() {
    return localStorage.getItem('user') !== null;
}

function toggleWishlist(packageId, button) {
    const user = JSON.parse(localStorage.getItem('user'));
    let wishlist = JSON.parse(localStorage.getItem('wishlist_' + user.id) || '[]');
    
    const heartIcon = button.querySelector('i');
    
    if (wishlist.includes(packageId)) {
        // Remove from wishlist
        wishlist = wishlist.filter(id => id !== packageId);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    } else {
        // Add to wishlist
        wishlist.push(packageId);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
    }
    
    localStorage.setItem('wishlist_' + user.id, JSON.stringify(wishlist));
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}