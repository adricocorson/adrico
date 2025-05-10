/**
 * Custom Cursor Implementation for rixco website
 * Fixed version to work with your specific site structure
 */

// Wait for jQuery to be ready since your site uses it
$(document).ready(function() {
    // Select the cursor element that already exists in your HTML
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
    
    // Find all clickable elements on your site
    // Adjusted selector to match your site's structure
    const clickableElements = $('a, button, .home-hamburger-menu, .text-slide-link, .home-cta-button, [role="button"]');
    
    // Track mouse position with improved precision
    $(document).on('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Apply cursor styles to ensure it's visible
    cursor.style.opacity = '1';
    cursor.style.zIndex = '9999'; // Make sure it's on top of everything
    
    // Add hover effects to clickable elements
    // Using jQuery for better compatibility with your site
    clickableElements.each(function() {
        const element = $(this);
        
        element.on('mouseenter', function() {
            // Clear any existing timeout to prevent race conditions
            if (arrowTimeout) {
                clearTimeout(arrowTimeout);
                arrowTimeout = null;
            }
            
            // Add a slight delay for more natural feeling
            setTimeout(() => {
                cursor.classList.add('expanded');
                
                // Create and add SVG only when hovering
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
                    svg.style.opacity = '1';
                } else {
                    const svg = document.querySelector('.cursor .arrow-svg');
                    svg.style.display = 'block';
                    svg.style.opacity = '1';
                }
            }, 10);
        });
        
        element.on('mouseleave', function() {
            cursor.classList.remove('expanded');
            // Hide SVG when not hovering with a fade-out effect
            const svg = document.querySelector('.cursor .arrow-svg');
            if (svg) {
                svg.style.opacity = '0';
                // Delay the display:none to allow the fade-out animation
                // Store the timeout ID so we can cancel it if needed
                arrowTimeout = setTimeout(() => {
                    // Check if opacity is still 0 before hiding
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
    
    // Disable the custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
        return; // Exit early for touch devices
    }
    
    // Improved smooth cursor animation using requestAnimationFrame for optimal performance
    function updateCursor() {
        // More refined easing for smoother movement
        const ease = 0.12; // Slightly lower value for smoother following
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        // Use transform for better performance instead of left/top
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursor);
    }
    
    // Start the animation
    updateCursor();
});