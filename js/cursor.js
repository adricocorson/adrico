document.addEventListener('DOMContentLoaded', () => {
  // Check for touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    // Hide the cursor element on touch devices and exit
    const cursorElement = document.querySelector('.cursor');
    if (cursorElement) {
      cursorElement.style.display = 'none';
    }
    console.log('Touch device detected, custom cursor disabled.'); // Optional: for debugging
    return; // Don't initialize custom cursor on touch devices
  }

  // Initialize cursor elements (only runs if not a touch device)
  const cursor = document.querySelector('.cursor');
  const links = document.querySelectorAll('a, button, .clickable');

  // Ensure cursor element exists before proceeding
  if (!cursor) {
    console.error('Custom cursor element (.cursor) not found.');
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Use requestAnimationFrame for smoother cursor movement
  function updateCursor() {
    // Add slight lag for smoother movement
    const ease = 0.2;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(updateCursor);
  }

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Make sure cursor is visible initially
  cursor.style.opacity = '1';

  // Add hover effects for interactive elements
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      cursor.classList.add('expanded');
      // Create and add SVG only when hovering
      if (!document.querySelector('.cursor .arrow-svg')) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 14 15");
        svg.setAttribute("fill", "none");
        svg.setAttribute("class", "arrow-svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
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
        if (svg) { // Check if SVG element exists before accessing style
           svg.style.display = 'block';
           svg.style.opacity = '1';
        }
      }
    });

    link.addEventListener('mouseleave', () => {
      cursor.classList.remove('expanded');
      // Hide SVG when not hovering
      const svg = document.querySelector('.cursor .arrow-svg');
      if (svg) {
        svg.style.display = 'none';
      }
    });
  });

  // Hide cursor when leaving the window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  // Start the animation
  updateCursor();
});