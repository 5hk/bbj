// Main JavaScript - All interactions and animations

// Image loading skeleton effect
function initImageLoading() {
    // Select all images in specific sections
    const imageContainers = document.querySelectorAll(
        '.about-image, .artist-image-container, .release-cover'
    );
    
    imageContainers.forEach(container => {
        // Add loading class
        container.classList.add('image-loading');
        
        const img = container.querySelector('img');
        if (img) {
            // Check if image is already loaded (cached)
            if (img.complete && img.naturalHeight !== 0) {
                container.classList.add('loaded');
            } else {
                // Add load event listener
                img.addEventListener('load', function() {
                    container.classList.add('loaded');
                });
                
                // Handle error case
                img.addEventListener('error', function() {
                    container.classList.add('loaded');
                });
            }
        }
    });
}

// Section title scroll animation
function initSectionTitleAnimation() {
    const sectionTitles = document.querySelectorAll('.section-title');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add reveal animation class
                entry.target.classList.add('reveal');
                entry.target.classList.remove('observe-animation');
            } else {
                // When scrolling back out, reset to hidden state
                entry.target.classList.remove('reveal');
                entry.target.classList.add('observe-animation');
            }
        });
    }, observerOptions);
    
    sectionTitles.forEach(title => {
        // Check if element is already in viewport (page load)
        const rect = title.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isInViewport) {
            // Only add observe-animation class if NOT in viewport
            title.classList.add('observe-animation');
        }
        
        observer.observe(title);
    });
}

// About image scroll animation
function initAboutImageAnimation() {
    const aboutImage = document.querySelector('#about .about-image');
    
    if (!aboutImage) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                entry.target.classList.remove('observe-animation');
            } else {
                entry.target.classList.remove('reveal');
                entry.target.classList.add('observe-animation');
            }
        });
    }, observerOptions);
    
    // Check if element is already in viewport
    const rect = aboutImage.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (!isInViewport) {
        aboutImage.classList.add('observe-animation');
    }
    
    observer.observe(aboutImage);
}

// Mobile menu toggle
function initMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const navMenu = document.querySelector('nav ul');
    
    if (menuButton && navMenu) {
        menuButton.addEventListener('click', function() {
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            menuButton.classList.toggle('active');
            
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when clicking on a menu item
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuButton.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav')) {
                navMenu.classList.remove('active');
                menuButton.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Mobile touch support for release cards
function initReleaseTouchSupport() {
    const releaseCards = document.querySelectorAll('.release-card');
    
    // Check if device is mobile/tablet
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        releaseCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all other cards
                releaseCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });
                
                // Toggle active class on clicked card
                card.classList.toggle('active');
            });
        });
        
        // Close overlay when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.release-card')) {
                releaseCards.forEach(card => {
                    card.classList.remove('active');
                });
            }
        });
    }
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize image loading
    initImageLoading();
    
    // Initialize section title animations
    initSectionTitleAnimation();
    
    // Initialize about image animation
    initAboutImageAnimation();
    
    // Initialize release card touch support
    initReleaseTouchSupport();
});

