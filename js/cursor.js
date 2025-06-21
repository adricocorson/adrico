/**
 * Custom Cursor Implementation for rixco website
 * Complete custom cursor - hides default cursor everywhere
 */

(function() {
    let cursor;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let arrowTimeout;
    let isInitialized = false;
    
    // More reliable touch device detection
    const isTouchDevice = () => {
        return ('ontouchstart' in window) && 
               (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) &&
               (window.matchMedia("(pointer: coarse)").matches);
    };
    
    // Force hide default cursor everywhere
    const hideDefaultCursor = () => {
        // Create comprehensive CSS to hide cursor everywhere
        const style = document.createElement('style');
        style.id = 'force-cursor-hide';
        style.textContent = `
            html, body, * {
                cursor: none !important;
            }
            
            *:hover, *:active, *:focus {
                cursor: none !important;
            }
            
            /* Scrollbar targeting - very aggressive */
            ::-webkit-scrollbar {
                cursor: none !important;
            }
            
            ::-webkit-scrollbar-thumb {
                cursor: none !important;
            }
            
            ::-webkit-scrollbar-track {
                cursor: none !important;
            }
            
            ::-webkit-scrollbar-corner {
                cursor: none !important;
            }
            
            ::-webkit-scrollbar-button {
                cursor: none !important;
            }
            
            ::-webkit-scrollbar-track-piece {
                cursor: none !important;
            }
            
            /* All scrollbar states */
            ::-webkit-scrollbar:hover,
            ::-webkit-scrollbar:active,
            ::-webkit-scrollbar-thumb:hover,
            ::-webkit-scrollbar-thumb:active,
            ::-webkit-scrollbar-track:hover,
            ::-webkit-scrollbar-track:active {
                cursor: none !important;
            }
            
            /* Target all interactive elements */
            a, button, input, textarea, select, [role="button"], 
            div, span, section, header, nav, main, footer,
            ul, li, p, h1, h2, h3, h4, h5, h6 {
                cursor: none !important;
            }
            
            /* Force override any existing cursor styles with highest specificity */
            html * {
                cursor: none !important;
            }
            
            body * {
                cursor: none !important;
            }
            
            /* Target body and html specifically */
            html {
                cursor: none !important;
            }
            
            body {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    };
    
    // Create arrow SVG
    const createArrowSvg = () => {
        if (!cursor || document.querySelector('.cursor .arrow-svg')) return;
        
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
        
        svg.style.position = 'absolute';
        svg.style.top = '50%';
        svg.style.left = '50%';
        svg.style.transform = 'translate(-50%, -50%)';
        svg.style.opacity = '0';
    };
    
    // Track mouse position
    const trackMouse = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    
    // Handle cursor expansion on hover
    const handleMouseEnter = (e) => {
        if (!cursor) return;
        
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
    };
    
    const handleMouseLeave = (e) => {
        if (!cursor) return;
        
        cursor.classList.remove('expanded');
        const svg = document.querySelector('.cursor .arrow-svg');
        if (svg) {
            svg.style.opacity = '0';
            arrowTimeout = setTimeout(() => {
                if (svg && svg.style.opacity === '0') {
                    svg.style.display = 'none';
                }
            }, 250);
        }
    };
    
    // Initialize cursor basics
    const initCursor = () => {
        cursor = document.querySelector('.cursor');
        
        if (!cursor) {
            console.error('Cursor element not found. Make sure <div class="cursor"></div> exists in your HTML.');
            return false;
        }
        
        if (isTouchDevice()) {
            cursor.style.display = 'none';
            return false;
        }
        
        // Force hide default cursor everywhere
        hideDefaultCursor();
        
        cursor.style.opacity = '1';
        cursor.style.zIndex = '9999';
        
        createArrowSvg();
        
        // Add mouse tracking
        document.addEventListener('mousemove', trackMouse);
        
        // Handle window events
        window.addEventListener('mouseleave', function() {
            if (cursor) cursor.style.opacity = '0';
        });
        
        window.addEventListener('mouseenter', function() {
            if (cursor) cursor.style.opacity = '1';
        });
        
        return true;
    };
    
    // Smooth cursor animation
    const updateCursor = () => {
        if (!cursor) {
            requestAnimationFrame(updateCursor);
            return;
        }
        
        const ease = 0.12;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursor);
    };
    
    // Add event delegation for dynamic content
    const setupEventDelegation = () => {
        // Use event delegation on document to catch dynamically loaded elements
        document.addEventListener('mouseenter', function(e) {
            const target = e.target;
            const clickableSelectors = [
                'a', 'button', '[role="button"]', 'input', 'textarea', 'select',
                '.home-hamburger-menu', '.text-slide-link', '.home-cta-button',
                '.project-link', '.contact-button'
            ];
            
            // Check if the target or any parent matches our selectors
            let element = target;
            while (element && element !== document) {
                for (const selector of clickableSelectors) {
                    if (element.matches && element.matches(selector)) {
                        handleMouseEnter(e);
                        return;
                    }
                }
                element = element.parentElement;
            }
        }, true);
        
        document.addEventListener('mouseleave', function(e) {
            const target = e.target;
            const clickableSelectors = [
                'a', 'button', '[role="button"]', 'input', 'textarea', 'select',
                '.home-hamburger-menu', '.text-slide-link', '.home-cta-button',
                '.project-link', '.contact-button'
            ];
            
            let element = target;
            while (element && element !== document) {
                for (const selector of clickableSelectors) {
                    if (element.matches && element.matches(selector)) {
                        handleMouseLeave(e);
                        return;
                    }
                }
                element = element.parentElement;
            }
        }, true);
    };
    
    // Force cursor hiding periodically to override any other scripts
    const forceCursorHiding = () => {
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';
        
        // Apply to all elements including newly created ones
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.cursor = 'none';
        });
        
        // Specifically target scrollbar areas
        document.documentElement.style.setProperty('cursor', 'none', 'important');
        document.body.style.setProperty('cursor', 'none', 'important');
        
        // Force override on common containers
        const containers = document.querySelectorAll('html, body, div, section, header, nav, main, footer');
        containers.forEach(el => {
            el.style.setProperty('cursor', 'none', 'important');
        });
    };
    
    // Main initialization function
    const initialize = () => {
        if (isInitialized) return;
        
        if (initCursor()) {
            setupEventDelegation();
            updateCursor();
            
            // Force hide cursor immediately and periodically
            forceCursorHiding();
            setInterval(forceCursorHiding, 500); // Check every 500ms
            
            // Also force hide on scroll events
            window.addEventListener('scroll', forceCursorHiding);
            document.addEventListener('scroll', forceCursorHiding);
            
            // Force hide on mouse events
            document.addEventListener('mouseover', forceCursorHiding);
            document.addEventListener('mouseenter', forceCursorHiding);
            
            // Also force hide after any dynamic content changes
            const observer = new MutationObserver(() => {
                setTimeout(forceCursorHiding, 50);
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            isInitialized = true;
        }
    };
    
    // Try to initialize immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also try to initialize after a short delay to catch dynamic content
    setTimeout(initialize, 100);
    setTimeout(initialize, 500);
    
    // Expose reinitialize function globally for pageSection.js to call
    window.initCustomCursor = function() {
        initialize();
        
        // Force hide default cursor again after reinitialization
        setTimeout(() => {
            forceCursorHiding();
        }, 50);
    };
    
})();