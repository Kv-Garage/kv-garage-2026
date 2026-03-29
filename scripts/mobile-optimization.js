/**
 * Mobile Optimization Script
 * Enhances mobile responsiveness and performance
 */

// Mobile-first viewport optimization
function optimizeViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  }
}

// Touch-friendly navigation
function enhanceNavigation() {
  // Hamburger menu animation
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Close menu when clicking links
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      const hamburger = document.querySelector('.hamburger');
      const mobileMenu = document.querySelector('.mobile-menu');
      if (hamburger && mobileMenu) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  });
}

// Smooth scrolling optimization
function optimizeScrolling() {
  // Smooth scrolling for anchor links
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

  // Performance optimization for scroll events
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const navbar = document.querySelector('nav');
        
        if (navbar) {
          if (scrolled > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Touch gesture optimization
function optimizeTouchGestures() {
  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Enhanced touch targets
  const touchTargets = document.querySelectorAll('button, a, input, select');
  touchTargets.forEach(target => {
    // Ensure minimum touch target size
    if (target.offsetHeight < 44 || target.offsetWidth < 44) {
      target.style.minHeight = '44px';
      target.style.minWidth = '44px';
    }
  });
}

// Form optimization for mobile
function optimizeForms() {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Add appropriate input modes for better mobile keyboards
    if (input.type === 'email') {
      input.setAttribute('inputmode', 'email');
      input.setAttribute('autocomplete', 'email');
    } else if (input.type === 'tel') {
      input.setAttribute('inputmode', 'tel');
      input.setAttribute('autocomplete', 'tel');
    } else if (input.type === 'text') {
      input.setAttribute('inputmode', 'text');
    }

    // Focus management
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement?.classList.remove('focused');
    });
  });
}

// Image optimization
function optimizeImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading attribute for performance
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add alt text if missing
    if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
      img.setAttribute('alt', 'Image');
    }
  });
}

// Cart optimization for mobile
function optimizeCart() {
  const cartButtons = document.querySelectorAll('[data-cart-open], .cart-toggle');
  const cartSidebar = document.querySelector('.cart-sidebar');
  
  if (cartButtons.length > 0 && cartSidebar) {
    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.toggle('open');
      });
    });

    // Close cart when clicking outside
    cartSidebar.addEventListener('click', (e) => {
      if (e.target === cartSidebar) {
        cartSidebar.classList.remove('open');
      }
    });
  }
}

// Performance optimizations
function optimizePerformance() {
  // Debounce resize events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimize resize events
  window.addEventListener('resize', debounce(() => {
    // Update layout on resize
    const viewportWidth = window.innerWidth;
    if (viewportWidth > 768) {
      // Desktop layout
      document.body.classList.remove('mobile-view');
    } else {
      // Mobile layout
      document.body.classList.add('mobile-view');
    }
  }, 250));

  // Optimize scroll performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Perform scroll-related optimizations
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Update scroll indicators
      const progress = (scrollTop / (document.body.scrollHeight - window.innerHeight)) * 100;
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        scrollIndicator.style.width = `${progress}%`;
      }
    }, 100);
  });
}

// Accessibility enhancements
function enhanceAccessibility() {
  // Skip links
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 10px;
    z-index: 9999;
    padding: 8px 16px;
    background: #D4AF37;
    color: #000;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '10px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);

  // ARIA labels for interactive elements
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Button');
    }
  });
}

// Initialize all optimizations
function initMobileOptimizations() {
  optimizeViewport();
  enhanceNavigation();
  optimizeScrolling();
  optimizeTouchGestures();
  optimizeForms();
  optimizeImages();
  optimizeCart();
  optimizePerformance();
  enhanceAccessibility();

  // Add CSS-in-JS for mobile-specific styles
  const style = document.createElement('style');
  style.textContent = `
    /* Mobile-specific optimizations */
    .skip-link:focus {
      left: 10px !important;
    }
    
    .scroll-indicator {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #D4AF37, #F2C94C);
      z-index: 9999;
      transition: width 0.1s;
    }
    
    @media (max-width: 768px) {
      .cart-sidebar.open {
        transform: translateX(0);
      }
      
      .mobile-menu.active {
        transform: translateX(0);
      }
      
      .focused {
        outline: 2px solid #D4AF37;
        outline-offset: 2px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Run optimizations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileOptimizations);
} else {
  initMobileOptimizations();
}

// Export for use in other scripts
window.MobileOptimizations = {
  optimizeViewport,
  enhanceNavigation,
  optimizeScrolling,
  optimizeTouchGestures,
  optimizeForms,
  optimizeImages,
  optimizeCart,
  optimizePerformance,
  enhanceAccessibility,
  initMobileOptimizations
};