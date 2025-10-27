// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Gallery Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(button => button.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 100);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let visibleImages = [];

// Update visible images array based on current filter
function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => {
        return window.getComputedStyle(item).display !== 'none';
    });
}

// Open lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        currentImageIndex = visibleImages.indexOf(item);
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Navigation in lightbox
lightboxPrev.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    lightboxImg.src = visibleImages[currentImageIndex].querySelector('img').src;
});

lightboxNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    lightboxImg.src = visibleImages[currentImageIndex].querySelector('img').src;
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    }
});

// Contact Form Functionality
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Basic form validation
    if (!formObject.name || !formObject.email || !formObject.service) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // In a real implementation, you would send this to your server or email service
        // For demo purposes, we'll simulate a successful submission
        await simulateFormSubmission(formObject);
        
        showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
        contactForm.reset();
        
        // Track form submission in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': formObject.service
            });
        }
        
    } catch (error) {
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Simulate form submission (replace with actual implementation)
function simulateFormSubmission(formData) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            console.log('Form submitted:', formData);
            resolve();
        }, 1000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    const style = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .notification-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: inherit;
            padding: 0;
            line-height: 1;
        }
        
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
        
        @media (max-width: 480px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = style;
        document.head.appendChild(styleSheet);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .about-text, .about-image');
    animateElements.forEach(el => observer.observe(el));
});

// Google Analytics Event Tracking
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track gallery interactions
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        trackEvent('gallery_image_click', 'Gallery', `Image ${index + 1}`);
    });
});

// Track service card interactions
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        const serviceName = card.querySelector('h3').textContent;
        trackEvent('service_card_click', 'Services', serviceName);
    });
});

// Track social media clicks
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const platform = e.target.classList.contains('fa-instagram') ? 'Instagram' :
                         e.target.classList.contains('fa-facebook-f') ? 'Facebook' :
                         e.target.classList.contains('fa-pinterest') ? 'Pinterest' : 'Unknown';
        trackEvent('social_media_click', 'Social Media', platform);
    });
});

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent;
        trackEvent('button_click', 'Navigation', buttonText);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}
