/**
 * Positivus Landing Page - Main JavaScript
 * Handles interactions, animations, and dynamic behavior
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initButtonInteractions();
    initCardAnimations();
    initScrollReveal();
    initInfinityScroll();
    initNavScroll();
});

/**
 * Toggle glassmorphism state on the nav when the user scrolls.
 */
function initNavScroll() {
    const nav = document.getElementById('siteNav');
    if (!nav) return;

    const threshold = 12;
    let ticking = false;

    const update = () => {
        nav.classList.toggle('is-scrolled', window.scrollY > threshold);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}

/**
 * Infinity scroll for logos
 */
function initInfinityScroll() {
    // Strip is already duplicated in markup (2x .logo-strip), so translateX(-50%) loops seamlessly.
}

/**
 * Generic scroll reveal - adds .is-visible to any .reveal element
 * and auto-tags common sections so the whole site animates in.
 */
function initScrollReveal() {
    // Tag containers
    document.querySelectorAll('section').forEach(el => {
        if (el.closest('nav') || el.closest('header')) return;
        el.classList.add('reveal');
    });

    // Tag inner staggered items with variants
    document.querySelectorAll('.service-card').forEach((el, i) => {
        el.classList.add('reveal', 'reveal-pop');
        el.style.animationDelay = `${i * 100}ms`;
    });
    document.querySelectorAll('h2.bg-lime').forEach(el => {
        el.classList.add('reveal', 'reveal-left');
    });
    document.querySelectorAll('.cta-illustration').forEach(el => {
        el.classList.add('reveal', 'reveal-right');
    });

    // Defer observing so the initial opacity:0 paints before is-visible flips it
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const revealElements = document.querySelectorAll('.reveal');
        const isSupported = 'IntersectionObserver' in window;

        const revealElement = (element) => {
            // Pequeno delay para garantir que o estado inicial (opacity 0) foi renderizado
            setTimeout(() => {
                element.classList.add('is-visible');
            }, 50);
        };

        if (!isSupported) {
            revealElements.forEach(revealElement);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach((el, index) => {
            el.style.setProperty('--reveal-delay', `${index * 80}ms`);
            const rect = el.getBoundingClientRect();
            const isAlreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isAlreadyVisible) {
                revealElement(el);
            } else {
                observer.observe(el);
            }
        });
    }));
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Button interactions and hover effects
 */
function initButtonInteractions() {
    // CTA buttons hover tracking
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Card entrance animations on scroll
 */
function initCardAnimations() {
    // Handled by initScrollReveal now (reveal-pop on .service-card).
}

/**
 * Mobile menu toggle (if needed)
 */
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('mobile-open');
}

/**
 * Form validation helper
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Newsletter subscription handler
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (validateEmail(email)) {
        // Success feedback
        showNotification('Thank you for subscribing!', 'success');
        emailInput.value = '';
    } else {
        // Error feedback
        showNotification('Please enter a valid email address.', 'error');
    }
}

/**
 * Simple notification helper
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#B9FF66' : type === 'error' ? '#ff6666' : '#F3F3F3'};
        color: ${type === 'success' ? '#191A23' : '#fff'};
        font-weight: 500;
        z-index: 1000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export functions for global access
window.Positivus = {
    toggleMobileMenu,
    handleNewsletterSubmit,
    showNotification
};
