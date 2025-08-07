/**
 * Green Stay Website - JavaScript Functionality
 * Includes mobile navigation, accessibility features, form validation,
 * filtering, bookmarking, and scroll animations
 */

// ===================================
// Global Variables and State
// ===================================

let isHighContrast = false;
let currentFontSize = 'normal'; // 'small', 'normal', 'large'
let bookmarkedProperties = JSON.parse(localStorage.getItem('bookmarkedProperties') || '[]');

// ===================================
// DOM Content Loaded Event
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===================================
// App Initialization
// ===================================

function initializeApp() {
    // Initialize all components
    initializeMobileNavigation();
    initializeAccessibilityControls();
    initializeStickyHeader();
    initializeScrollAnimations();
    initializeFormValidation();
    initializePropertyFilters();
    initializeBookmarking();
    initializeLocalStorage();

    console.log('Green Stay website initialized successfully');
}

// ===================================
// Mobile Navigation
// ===================================

function initializeMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

        // Toggle aria-expanded
        navToggle.setAttribute('aria-expanded', !isExpanded);

        // Toggle menu visibility
        navMenu.classList.toggle('active');

        // Update accessibility
        if (!isExpanded) {
            navMenu.setAttribute('aria-hidden', 'false');
            // Focus first menu item
            const firstMenuItem = navMenu.querySelector('a');
            if (firstMenuItem) {
                setTimeout(() => firstMenuItem.focus(), 100);
            }
        } else {
            navMenu.setAttribute('aria-hidden', 'true');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            navMenu.setAttribute('aria-hidden', 'true');
            navToggle.focus();
        }
    });

    // Close menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            navMenu.removeAttribute('aria-hidden');
        }
    });
}

// ===================================
// Accessibility Controls
// ===================================

function initializeAccessibilityControls() {
    initializeFontSizeControls();
    initializeContrastToggle();
}

function initializeFontSizeControls() {
    const fontSizeButtons = document.querySelectorAll('.font-size-btn');

    fontSizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');

            if (action === 'increase') {
                increaseFontSize();
            } else if (action === 'decrease') {
                decreaseFontSize();
            }

            // Save to localStorage
            localStorage.setItem('fontSize', currentFontSize);

            // Announce change to screen readers
            announceToScreenReader(`Font size changed to ${currentFontSize}`);
        });
    });

    // Load saved font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize && savedFontSize !== 'normal') {
        currentFontSize = savedFontSize;
        applyFontSize(currentFontSize);
    }
}

function increaseFontSize() {
    if (currentFontSize === 'small') {
        currentFontSize = 'normal';
    } else if (currentFontSize === 'normal') {
        currentFontSize = 'large';
    }
    // Already at large, no change

    applyFontSize(currentFontSize);
}

function decreaseFontSize() {
    if (currentFontSize === 'large') {
        currentFontSize = 'normal';
    } else if (currentFontSize === 'normal') {
        currentFontSize = 'small';
    }
    // Already at small, no change

    applyFontSize(currentFontSize);
}

function applyFontSize(size) {
    document.body.classList.remove('font-size-small', 'font-size-large');

    if (size === 'small') {
        document.body.classList.add('font-size-small');
    } else if (size === 'large') {
        document.body.classList.add('font-size-large');
    }
}

function initializeContrastToggle() {
    const contrastToggle = document.querySelector('.contrast-toggle');

    if (!contrastToggle) return;

    contrastToggle.addEventListener('click', function() {
        isHighContrast = !isHighContrast;

        if (isHighContrast) {
            document.body.classList.add('high-contrast');
            this.setAttribute('aria-label', 'Disable high contrast mode');
        } else {
            document.body.classList.remove('high-contrast');
            this.setAttribute('aria-label', 'Enable high contrast mode');
        }

        // Save to localStorage
        localStorage.setItem('highContrast', isHighContrast);

        // Announce change to screen readers
        announceToScreenReader(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`);
    });

    // Load saved contrast setting
    const savedContrast = localStorage.getItem('highContrast');
    if (savedContrast === 'true') {
        isHighContrast = true;
        document.body.classList.add('high-contrast');
        contrastToggle.setAttribute('aria-label', 'Disable high contrast mode');
    }
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===================================
// Sticky Header
// ===================================

function initializeStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });
}

// ===================================
// Scroll Animations
// ===================================

function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .property-card, .package-card, .faq-item');

    if (animatedElements.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Add animation classes
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');

        // Add staggered delay
        element.style.transitionDelay = `${index * 100}ms`;
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Form Validation
// ===================================

function initializeFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        // Validate all fields
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            submitForm(contactForm);
        } else {
            // Focus first error field
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
        }
    });

    // Reset form
    const resetButton = contactForm.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            setTimeout(() => {
                clearFormErrors(contactForm);
            }, 10);
        });
    }
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);

    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required.`;
    }

    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Phone validation
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-()]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }

    // Checkbox validation (privacy policy)
    else if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
        isValid = false;
        errorMessage = 'You must agree to the privacy policy to continue.';
    }

    // Update UI
    if (isValid) {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    } else {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }

    return isValid;
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return field.name;
}

function clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    const errorFields = form.querySelectorAll('.error');

    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });

    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('form-success');

    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.focus();
        }

        // Announce success to screen readers
        announceToScreenReader('Your message has been sent successfully!');

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            clearFormErrors(form);
            form.style.display = 'grid';
            if (successMessage) {
                successMessage.style.display = 'none';
            }
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 5000);

    }, 2000);
}

// ===================================
// Property Filtering
// ===================================

function initializePropertyFilters() {
    const filtersForm = document.querySelector('.filters-form');
    const propertiesGrid = document.getElementById('properties-grid');

    if (!filtersForm || !propertiesGrid) return;

    const locationFilter = document.getElementById('location-filter');
    const priceFilter = document.getElementById('price-filter');
    const amenitiesFilter = document.getElementById('amenities-filter');

    // Apply filters on form submission
    filtersForm.addEventListener('submit', function(event) {
        event.preventDefault();
        applyFilters();
    });

    // Apply filters on input change
    [locationFilter, priceFilter, amenitiesFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });

    // Reset filters
    const resetButton = filtersForm.querySelector('.filter-reset');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            setTimeout(() => {
                applyFilters();
            }, 10);
        });
    }
}

function applyFilters() {
    const locationValue = document.getElementById('location-filter')?.value || '';
    const priceValue = document.getElementById('price-filter')?.value || '';
    const amenitiesValue = document.getElementById('amenities-filter')?.value || '';

    const propertyCards = document.querySelectorAll('.property-card');
    let visibleCount = 0;

    propertyCards.forEach(card => {
        const location = card.getAttribute('data-location') || '';
        const price = card.getAttribute('data-price') || '';
        const amenities = card.getAttribute('data-amenities') || '';

        let shouldShow = true;

        // Location filter
        if (locationValue && location !== locationValue) {
            shouldShow = false;
        }

        // Price filter
        if (priceValue && price !== priceValue) {
            shouldShow = false;
        }

        // Amenities filter
        if (amenitiesValue && !amenities.includes(amenitiesValue)) {
            shouldShow = false;
        }

        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update results count (if element exists)
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${visibleCount} properties found`;
    }
}

// ===================================
// Bookmarking Functionality
// ===================================
function initializeBookmarking() {
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');

    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-property-id');
            toggleBookmark(propertyId);
        });
    });

    // Load bookmarks from localStorage
    loadBookmarks();
}
function toggleBookmark(propertyId) {
    const index = bookmarkedProperties.indexOf(propertyId);

    if (index > -1) {
        // Already bookmarked, remove it
        bookmarkedProperties.splice(index, 1);
        updateBookmarkButton(propertyId, false);
    } else {
        // Not bookmarked, add it
        bookmarkedProperties.push(propertyId);
        updateBookmarkButton(propertyId, true);
    }

    // Save to localStorage
    localStorage.setItem('bookmarkedProperties', JSON.stringify(bookmarkedProperties));

    // Announce change to screen readers
    announceToScreenReader(`Property ${propertyId} has been ${index > -1 ? 'removed from' : 'added to'} bookmarks.`);
}
function updateBookmarkButton(propertyId, isBookmarked) {
    const button = document.querySelector(`.bookmark-btn[data-property-id="${propertyId}"]`);
    if (button) {
        button.classList.toggle('bookmarked', isBookmarked);
        button.setAttribute('aria-pressed', isBookmarked);
        button.textContent = isBookmarked ? 'Remove Bookmark' : 'Add Bookmark';
    }
}
function loadBookmarks() {
    bookmarkedProperties.forEach(propertyId => {
        updateBookmarkButton(propertyId, true);
    });
}
// ===================================
// Local Storage Initialization
// ===================================
function initializeLocalStorage() {
    // Ensure localStorage is available
    if (typeof(Storage) === 'undefined') {
        console.warn('Local Storage is not supported in this browser.');
        return;
    }

    // Initialize bookmarked properties from localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedProperties') || '[]');
    if (Array.isArray(savedBookmarks)) {
        bookmarkedProperties = savedBookmarks;
        loadBookmarks();
    }
}
