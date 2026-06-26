document.addEventListener('DOMContentLoaded', () => {
  // Trigger initial load entrance animations
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      // Toggle icon representation if needed
      const icon = menuBtn.querySelector('svg');
      if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        } else {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        }
      }
    });

    // Close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('svg');
        if (icon) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
      });
    });
  }

  // ==========================================================================
  // NAVBAR SCROLL EFFECT
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const logoText = document.getElementById('logo-text');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.remove('bg-transparent', 'py-6');
      navbar.classList.add('bg-brand-dark/95', 'backdrop-blur-md', 'py-4', 'shadow-lg');
    } else {
      navbar.classList.remove('bg-brand-dark/95', 'backdrop-blur-md', 'py-4', 'shadow-lg');
      navbar.classList.add('bg-transparent', 'py-6');
    }
  }

  window.addEventListener('scroll', updateNavbar);
  updateNavbar(); // Initialize on page load

  // ==========================================================================
  // IMAGE ERROR FALLBACK SYSTEM
  // ==========================================================================
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    // Skip lightbox image placeholder
    if (img.id === 'lightbox-img') {
      return;
    }

    // Skip if image already has inline opacity fallback onerror handler
    const onerrorAttr = img.getAttribute('onerror');
    if (onerrorAttr && String(onerrorAttr).includes('opacity')) {
      return;
    }

    // Save the original source to display as filename if error occurs
    const src = img.getAttribute('src');
    const filename = src ? src.substring(src.lastIndexOf('/') + 1) : 'placeholder.jpg';

    // Check if image is already broken (from cache or fast load)
    if (img.naturalWidth === 0 && img.complete) {
      replaceWithFallback(img, filename);
    }

    // Attach error listener
    img.addEventListener('error', () => {
      replaceWithFallback(img, filename);
    });
  });

  function replaceWithFallback(imgElement, filename) {
    const parent = imgElement.parentElement;
    if (!parent) return;

    // Ensure parent is relative to prevent absolute children from collapsing
    parent.classList.add('relative');

    // Create a styled fallback div
    const fallback = document.createElement('div');
    // Set to absolute inset-0 to fill the aspect-ratio container perfectly
    fallback.className = 'img-fallback-container absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 cursor-default select-none';
    
    // Add custom rounded classes if the original image had them
    const originalClasses = imgElement.className.split(' ');
    originalClasses.forEach(cls => {
      if (cls.startsWith('rounded') || cls.startsWith('shadow') || cls.startsWith('h-') || cls.startsWith('w-')) {
        fallback.classList.add(cls);
      }
    });

    fallback.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center p-2">
        <svg class="w-8 h-8 mb-2 text-brand-yellow/80 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span class="text-xs font-bold text-brand-yellow tracking-wider uppercase">No Image</span>
        <span class="text-[10px] text-white/70 mt-1 font-medium">Belum Ada Dokumentasi</span>
        <span class="text-[9px] text-white/40 font-mono mt-0.5 max-w-[90%] truncate">${filename}</span>
      </div>
    `;

    // Keep data attributes for lightbox if it was a gallery image
    if (imgElement.classList.contains('gallery-trigger')) {
      fallback.classList.add('gallery-trigger', 'cursor-pointer');
      const srcAttr = imgElement.getAttribute('src');
      fallback.setAttribute('data-fullsrc', srcAttr || '');
      fallback.setAttribute('data-caption', imgElement.getAttribute('data-caption') || 'Dokumentasi KKN Desa Mekarsari');
      
      // Hook up lightbox event to the fallback
      fallback.addEventListener('click', () => {
        openLightbox(srcAttr || '', imgElement.getAttribute('data-caption') || 'Dokumentasi KKN Desa Mekarsari');
      });
    }

    parent.replaceChild(fallback, imgElement);
  }

  // ==========================================================================
  // SCROLL SPIES (NAVBAR & TIMELINE MONTHS)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const monthBlocks = document.querySelectorAll('.month-block');
  const monthButtons = document.querySelectorAll('.month-btn');

  function scrollSpy() {
    const scrollPos = window.scrollY + 120; // threshold offset

    // 1. Navbar Active State
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // 2. Timeline Month Sticky Navigation Active State
    const scrollPosTimeline = window.scrollY + 180; // threshold offset for active month transitions
    monthBlocks.forEach(block => {
      const blockTop = block.getBoundingClientRect().top + window.scrollY;
      const blockHeight = block.offsetHeight;
      const monthId = block.getAttribute('id');

      if (scrollPosTimeline >= blockTop && scrollPosTimeline < blockTop + blockHeight) {
        monthButtons.forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('data-target') === monthId) {
            btn.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Trigger initially

  // ==========================================================================
  // CUSTOM LUXURIOUS SMOOTH SCROLL WITH CUBIC EASING
  // ==========================================================================
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    // cubic easing function (easeInOutCubic)
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
  }

  // Intercept all menu links, CTA buttons, and month buttons
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"], .month-btn');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      let targetSelector;
      if (this.tagName === 'A') {
        targetSelector = this.getAttribute('href');
      } else {
        targetSelector = '#' + this.getAttribute('data-target');
      }
      
      if (targetSelector === '#') return;
      
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        const yOffset = -90; // offset spacing for fixed navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const targetY = elementPosition + window.pageYOffset + yOffset;
        
        // Calculate distance to adjust scroll duration dynamically
        const startY = window.pageYOffset;
        const scrollDistance = Math.abs(targetY - startY);
        
        // Dynamic duration (min: 800ms, max: 1500ms)
        // Prevents long distance jumps from feeling too fast/jarring
        const duration = Math.min(1500, Math.max(800, scrollDistance * 0.25 + 650));
        
        smoothScrollTo(targetY, duration);
      }
    });
  });

  // ==========================================================================
  // INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
  // ==========================================================================
  const observerOptions = {
    root: null, // Viewport
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before full entrance
    threshold: 0.15 // 15% of element visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Once revealed, no need to track it further
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select all components that have animate reveals
  const elementsToReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  elementsToReveal.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================================================
  // LIGHTBOX INTERACTION LOGIC
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
    }, 300);
  }

  // Hook up event triggers to all gallery images
  const galleryTriggers = document.querySelectorAll('.gallery-trigger');
  galleryTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const img = e.currentTarget.tagName === 'IMG' ? e.currentTarget : e.currentTarget.querySelector('img');
      const src = img ? img.getAttribute('src') : e.currentTarget.getAttribute('data-fullsrc');
      const caption = img ? img.getAttribute('data-caption') : e.currentTarget.getAttribute('data-caption');
      
      if (src) {
        openLightbox(src, caption || 'Dokumentasi KKN Desa Mekarsari');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-wrap')) {
        closeLightbox();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
