// Index page specific fixes
document.addEventListener('DOMContentLoaded', function() {
    console.log('Index page scripts loaded');
    
    // Ensure heart clicks don't navigate — prevent default navigation but allow other handlers
    const heartButtons = document.querySelectorAll('.package-heart');
    heartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Do not stopImmediatePropagation here; other handlers (wishlist) should run
            e.stopPropagation();
        }, false);
    });
    
    // Also handle clicks on the icons themselves
    const heartIcons = document.querySelectorAll('.package-heart i');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    // Remove onclick from HTML to use event listeners instead
    heartButtons.forEach(button => {
        if (button.onclick) {
            button.removeAttribute('onclick');
        }
    });
});

