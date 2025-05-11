/**
 * Custom Cursor Implementation for rixco website
 * Fixed version to work with Netlify deployment
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Check if jQuery is available, use it if so
    const $ = window.jQuery || window.$;
    
    // Select the cursor element
    const cursor = document.querySelector('.cursor');
    
    // Make sure the cursor exists
    if (!cursor) {
        console.error('Cursor element not found. Make sure <div class="cursor"></div> exists in your HTML.');
        return;
    }
    
    // Variables for smooth cursor movement
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Store timeout ID to be able to clear it
    let arrowTimeout;
    
    // More reliable touch device detection
    const isTouchDevice = () => {
        // Check for actual touch capability, not just the presence of the API
        return ('ontouchstart' in window) && 
               (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) &&
               (window.matchMedia("(pointer: coarse)").matches);
    };
    
    // Disable the custom cursor on actual touch-only devices
    if (isTouchDevice()) {
        cursor.style.display = 'none';
        return; // Exit early for touch-only devices
    }
    
    // Ensure cursor is visible
    cursor.style.opacity = '1';
    cursor.style.zIndex = '9999';
    
    // Add SVG arrow to cursor element once on init to prevent creation issues
    const createArrowSvg = () => {
        if (!document.querySelector('.cursor .arrow-svg')) {
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("viewBox", "0 0 14 15");
            svg.setAttribute("fill", "none");
            svg.setAttribute("class", "arrow-svg");
            svg.setAttribute("width", "32");
            svg.setAttribute("height", "32");
            svg.setAttribute("aria-hidden", "true");
            
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", "M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z");
            path.setAttribute("fill", "currentColor");
            
            svg.appendChild(path);
            cursor.appendChild(svg);
            
            // Position the SVG centered in the cursor
            svg.style.position = 'absolute';
            svg.style.top = '50%';
            svg.style.left = '50%';
            svg.style.transform = 'translate(-50%, -50%)';
            svg.style.opacity = '0'; // Start with 0 opacity
        }
    };
    
    // Create the arrow SVG immediately
    createArrowSvg();
    
    // Track mouse position
    const trackMouse = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    
    // If jQuery is available, use it for compatibility, otherwise use native DOM
    if ($) {
        // Find all clickable elements on the site
        const clickableElements = $('a, button, .home-hamburger-menu, .text-slide-link, .home-cta-button, [role="button"]');
        
        $(document).on('mousemove', trackMouse);
        
        // Add hover effects to clickable elements
        clickableElements.each(function() {
            const element = $(this);
            
            element.on('mouseenter', function() {
                if (arrowTimeout) {
                    clearTimeout(arrowTimeout);
                    arrowTimeout = null;
                }
                
                cursor.classList.add('expanded');
                const svg = document.querySelector('.cursor .arrow-svg');
                if (svg) {
                    svg.style.opacity = '1';
                    svg.style.display = 'block';
                }
            });
            
            element.on('mouseleave', function() {
                cursor.classList.remove('expanded');
                const svg = document.querySelector('.cursor .arrow-svg');
                if (svg) {
                    svg.style.opacity = '0';
                    arrowTimeout = setTimeout(() => {
                        if (svg.style.opacity === '0') {
                            svg.style.display = 'none';
                        }
                    }, 250);
                }
            });
        });
        
        // Handle window events
        $(window).on('mouseleave', function() {
            cursor.style.opacity = '0';
        });
        
        $(window).on('mouseenter', function() {
            cursor.style.opacity = '1';
        });
    } else {
        // Fallback to vanilla JS if jQuery is not available
        document.addEventListener('mousemove', trackMouse);
        
        // Find clickable elements
        const clickableElements = document.querySelectorAll('a, button, .home-hamburger-menu, .text-slide-link, .home-cta-button, [role="button"]');
        
        clickableElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                if (arrowTimeout) {
                    clearTimeout(arrowTimeout);
                    arrowTimeout = null;
                }
                
                cursor.classList.add('expanded');
                const svg = document.querySelector('.cursor .arrow-svg');
                if (svg) {
                    svg.style.opacity = '1';
                    svg.style.display = 'block';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                cursor.classList.remove('expanded');
                const svg = document.querySelector('.cursor .arrow-svg');
                if (svg) {
                    svg.style.opacity = '0';
                    arrowTimeout = setTimeout(() => {
                        if (svg.style.opacity === '0') {
                            svg.style.display = 'none';
                        }
                    }, 250);
                }
            });
        });
        
        // Handle window events
        window.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
        });
        
        window.addEventListener('mouseenter', function() {
            cursor.style.opacity = '1';
        });
    }
    
    // Use requestAnimationFrame for smooth cursor animation
    function updateCursor() {
        const ease = 0.12;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursor);
    }
    
    // Start the animation
    updateCursor();
    
    // Log successful initialization for debugging
    console.log('Custom cursor initialized successfully');
});