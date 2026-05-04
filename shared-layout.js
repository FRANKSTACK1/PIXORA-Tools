// shared-layout.js — inject header + footer into every page

// 1. Add Font Awesome CDN to <head>
const faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
document.head.appendChild(faLink);

// 2. Inject enhanced CSS for animations and drawer behavior
const style = document.createElement('style');
style.textContent = `
  /* Mobile Overlay Smoothness */
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    display: block !important; /* Overriding inline style to use opacity logic */
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .mobile-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }

  /* Mobile Drawer Positioning & Animation */
  .mobile-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100%;
    background: #fff;
    z-index: 999;
    display: flex !important; /* Overriding inline style to use transform logic */
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  }
  .mobile-drawer.open {
    transform: translateX(0);
  }

  /* Hamburger Micro-interaction */
  .hamburger {
    cursor: pointer;
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
    z-index: 1000;
  }
  .hamburger span {
    display: block;
    width: 25px;
    height: 3px;
    background: currentColor;
    transition: 0.3s ease;
  }
  .hamburger.active span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
  .hamburger.active span:nth-child(2) { opacity: 0; }
  .hamburger.active span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

  /* Drawer Navigation Icons & States */
  .drawer-nav a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 20px;
    text-decoration: none;
    color: #333;
    transition: background 0.2s;
  }
  .drawer-nav a:hover, .drawer-nav a.active {
    background: #f5f5f5;
    color: #007bff;
  }
  .drawer-nav i { width: 20px; text-align: center; }
  
  .drawer-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 10px;
    transition: transform 0.2s;
  }
  .drawer-close:hover { transform: scale(1.1); }
`;
document.head.appendChild(style);

const HEADER_HTML = `
<header class="header">
  <nav class="nav container" role="navigation">
    <a href="index.html" class="nav-logo">
      <div class="logo-mark"></div>
      <span class="logo-text">PIX<span>ORA</span></span>
    </a>

    <!--  <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="tools.html">Tools</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="tools.html" class="nav-cta">Open Tools</a></li>
    </ul> -->

    <button class="hamburger" aria-label="Open Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>
</header>

<div class="mobile-overlay" style="display:none"></div>
<div class="mobile-drawer" style="display:none" aria-hidden="true">
  <div class="drawer-header">
    <a href="index.html" class="nav-logo">
      <div class="logo-mark"></div>
      <span class="logo-text">PIX<span>ORA</span></span>
    </a>
    <button class="drawer-close" aria-label="Close Menu"><i class="fa-solid fa-xmark"></i></button>
  </div>
  <nav class="drawer-nav">
    <a href="index.html"><i class="fa-solid fa-house"></i> Home</a>
    <a href="tools.html"><i class="fa-solid fa-screwdriver-wrench"></i> Tools</a>
    <a href="about.html"><i class="fa-solid fa-circle-info"></i> About</a>
    <a href="contact.html"><i class="fa-solid fa-envelope"></i> Contact</a>
  </nav>
  <a href="tools.html" class="drawer-cta">Open Tools <i class="fa-solid fa-arrow-right"></i></a>
</div>
`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo" style="color:#fff">
          <div class="logo-mark"></div>
          <span class="logo-text">PIX<span>ORA</span></span>
        </a>
        <p>All-in-one image toolkit for creators. Fast, private, and 100% browser-based.</p>
      </div>
      <div class="footer-col">
        <h4>Tools</h4>
        <ul>
          <li><a href="compressor.html">Image Compressor</a></li>
          <li><a href="jpg-to-png.html">JPG → PNG</a></li>
          <li><a href="png-to-jpg.html">PNG → JPG</a></li>
          <li><a href="resize.html">Resize Image</a></li>
          <li><a href="webp.html">WebP Converter</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="tools.html">All Tools</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="privacy.html">Privacy Policy</a></li>
          <li><a href="terms.html">Terms & Conditions</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 PIXORA Tools. All rights reserved. <br>Developed by <a href="https://frankstack.com.ng" target=_blank> @FRANKSTACK </a></p>
      <div class="footer-bottom-links">
        <a href="privacy.html">Privacy</a>
        <a href="terms.html">Terms</a>
        <a href="contact.html">Contact</a>
      </div>
    </div>
  </div>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
  // inject header
  const headerPlaceholder = document.getElementById('site-header');
  if (headerPlaceholder) headerPlaceholder.outerHTML = HEADER_HTML;

  // inject footer
  const footerPlaceholder = document.getElementById('site-footer');
  if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;

  // Initialize Mobile Menu Logic
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-nav a, .drawer-cta');

  const toggleMenu = (isOpen) => {
    hamburger.classList.toggle('active', isOpen);
    drawer.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    
    // Accessibility
    hamburger.setAttribute('aria-expanded', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
    
    // Prevent scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger?.addEventListener('click', () => toggleMenu(!drawer.classList.contains('open')));
  overlay?.addEventListener('click', () => toggleMenu(false));
  closeBtn?.addEventListener('click', () => toggleMenu(false));
  
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // re-init active states
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
});