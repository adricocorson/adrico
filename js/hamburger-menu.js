document.addEventListener('DOMContentLoaded', () => {
    // Get hamburger menu elements
    const hamburgerMenu = document.querySelector('.home-hamburger-menu');
    const hamburgerIcon = document.querySelector('.home-hamburger-icon');
    const navMenu = document.querySelector('.home-nav-menu');
    
    // Toggle menu when hamburger is clicked
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener('click', () => {
        hamburgerIcon.classList.toggle('home-open');
        navMenu.classList.toggle('home-active');
        // Prevent scrolling when menu is open
        document.body.classList.toggle('no-scroll');
      });
    }
  
    // Close menu when clicking a navigation link
    const navLinks = document.querySelectorAll('.home-nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerIcon.classList.remove('home-open');
        navMenu.classList.remove('home-active');
        document.body.classList.remove('no-scroll');
      });
    });
    
    // Also close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('home-active') && 
          !navMenu.contains(e.target) && 
          !hamburgerMenu.contains(e.target)) {
        hamburgerIcon.classList.remove('home-open');
        navMenu.classList.remove('home-active');
        document.body.classList.remove('no-scroll');
      }
    });
  });