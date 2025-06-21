// Wait for jQuery to be ready
$(document).ready(function() {
    let sectionsLoaded = 0;
    const totalSections = 7; // Including header
    
    // Function to check if all sections are loaded
    function checkAllSectionsLoaded() {
        sectionsLoaded++;
        
        if (sectionsLoaded === totalSections) {
            // Small delay to ensure DOM is fully ready
            setTimeout(function() {
                // Initialize smooth scroll
                if (window.initSmoothScroll) {
                    window.initSmoothScroll();
                } else {
                    console.error('[PageSection] Smooth scroll function not found!');
                }
                
                // Initialize cursor
                if (window.initCustomCursor) {
                    window.initCustomCursor();
                }
            }, 300);
        }
    }
    
    // Load header section
    $('.headerSection').load('./html/header.html', function(response, status, xhr) {
        if (status === "error") {
            console.error('[PageSection] Error loading header:', xhr.status, xhr.statusText);
        } else {
            // Initialize hamburger menu
            setTimeout(initializeHamburgerMenu, 50);
        }
        checkAllSectionsLoaded();
    });
    
    // Load other sections
    $('.homeSection').load('./html/home.html', function(response, status) {
        checkAllSectionsLoaded();
    });
    
    $('.aboutSection').load('./html/about.html', function(response, status) {
        checkAllSectionsLoaded();
    });
    
    $('.skillsSection').load('./html/skills.html', function(response, status) {
        checkAllSectionsLoaded();
    });
    
    $('.projectsSection').load('./html/project.html', function(response, status) {
        checkAllSectionsLoaded();
    });
    
    $('.contactSection').load('./html/contact.html', function(response, status) {
        checkAllSectionsLoaded();
    });
    
    $('.footerSection').load('./html/footer.html', function(response, status) {
        // Initialize Malaysia time
        setTimeout(initializeMalaysiaTime, 50);
        checkAllSectionsLoaded();
    });
});

// Function to initialize hamburger menu
function initializeHamburgerMenu() {
    const hamburgerMenu = $('.home-hamburger-menu');
    const hamburgerIcon = $('.home-hamburger-icon');
    const navMenu = $('.home-nav-menu');
    
    if (hamburgerMenu.length && hamburgerIcon.length && navMenu.length) {
        // Remove any existing click handlers first
        hamburgerMenu.off('click');
        
        // Toggle menu function
        function toggleMenu() {
            hamburgerIcon.toggleClass('home-open');
            navMenu.toggleClass('home-active');
            $('body').toggleClass('no-scroll');
        }
        
        // Click handler
        hamburgerMenu.on('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Touch handlers
        hamburgerMenu.on('touchstart', function(e) {
            e.preventDefault();
        });
        
        hamburgerMenu.on('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Keyboard accessibility
        hamburgerMenu.on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Close menu when clicking outside
        $(document).on('click', function(e) {
            if (navMenu.hasClass('home-active')) {
                if (!navMenu.is(e.target) && navMenu.has(e.target).length === 0 && 
                    !hamburgerMenu.is(e.target) && hamburgerMenu.has(e.target).length === 0) {
                    hamburgerIcon.removeClass('home-open');
                    navMenu.removeClass('home-active');
                    $('body').removeClass('no-scroll');
                }
            }
        });
    } else {
        console.error('[PageSection] Hamburger menu elements not found!');
    }
}

// Function to initialize Malaysia time
function initializeMalaysiaTime() {
    function updateMalaysiaTime() {
        const options = {
            timeZone: 'Asia/Kuala_Lumpur',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        
        const malaysiaTime = new Date().toLocaleTimeString('en-US', options);
        $('#current-time').text(malaysiaTime);
    }

    // Update immediately and then every second
    updateMalaysiaTime();
    setInterval(updateMalaysiaTime, 1000);
}