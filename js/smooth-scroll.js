document.addEventListener('DOMContentLoaded', () => {
    // Initialize cursor element
    const cursor = document.querySelector('.cursor');
    if (!cursor) return; // Safety check
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Create arrow SVG element once
    const createArrowSvg = () => {
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
      
      // Position the SVG centered in the cursor
      svg.style.position = 'absolute';
      svg.style.top = '50%';
      svg.style.left = '50%';
      svg.style.transform = 'translate(-50%, -50%)';
      svg.style.opacity = '0';
      svg.style.pointerEvents = 'none';
      
      return svg;
    };
    
    // Add the arrow SVG to cursor immediately
    const arrowSvg = createArrowSvg();
    cursor.appendChild(arrowSvg);
    
    // Function to handle cursor following mouse
    const updateCursor = () => {
      // Add slight lag for smoother movement
      const ease = 0.2;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      
      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }
      
      requestAnimationFrame(updateCursor);
    };
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Make sure cursor is visible initially
    cursor.style.opacity = '1';
    
    // Function to check if element is clickable
    const isClickable = (element) => {
      // Common clickable elements and classes
      const clickableElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
      const clickableClasses = ['clickable', 'btn', 'button', 'link', 'nav-link', 'menu-item'];
      
      // Check tag name
      if (clickableElements.includes(element.tagName)) {
        return true;
      }
      
      // Check class list
      if (Array.from(element.classList).some(cls => clickableClasses.some(clickClass => 
        cls.toLowerCase().includes(clickClass.toLowerCase())
      ))) {
        return true;
      }
      
      // Check for cursor: pointer style
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.cursor === 'pointer') {
        return true;
      }
      
      // Check for click or onclick attribute
      if (element.hasAttribute('onclick') || element.onclick) {
        return true;
      }
      
      return false;
    };
    
    // Function to expand cursor
    const expandCursor = () => {
      cursor.classList.add('expanded');
      arrowSvg.style.opacity = '1';
    };
    
    // Function to shrink cursor
    const shrinkCursor = () => {
      cursor.classList.remove('expanded');
      arrowSvg.style.opacity = '0';
    };
    
    // Track hover events using mouseover/mouseout on document
    document.addEventListener('mouseover', (e) => {
      let target = e.target;
      
      // Check if current element or any parent is clickable
      while (target && target !== document) {
        if (isClickable(target)) {
          expandCursor();
          return;
        }
        target = target.parentElement;
      }
      
      shrinkCursor();
    });
    
    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    // Show cursor when entering the window
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
    
    // Start the animation
    updateCursor();
    
    // Add this to help debug what's happening
    console.log('Custom cursor initialized');
  });