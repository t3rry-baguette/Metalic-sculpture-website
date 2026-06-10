document.addEventListener('DOMContentLoaded', function() {
  // ============================================
  // YEAR IN FOOTER
  // ============================================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // NAVIGATION TOGGLE (MOBILE)
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    
    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // ============================================
  // STICKY HEADER WITH GLASS EFFECT
  // ============================================
  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, false);

  // ============================================
  // SMOOTH SCROLL FOR INTERNAL LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // ANIMATED COUNTERS
  // ============================================
  const animateCounter = (element, target) => {
    const increment = target / 50;
    let current = 0;
    
    const updateCount = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target;
      }
    };
    
    updateCount();
  };

  // ============================================
  // INTERSECTION OBSERVER FOR REVEAL & COUNTERS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');
  const statElements = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class for fade-in
        entry.target.classList.add('visible');
        
        // Animate counters when stats section comes into view
        if (entry.target.classList.contains('stats-section') && !statsAnimated) {
          statsAnimated = true;
          statElements.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            animateCounter(stat, target);
          });
        }
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // GALLERY FILTERING
  // ============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter items
      masonryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ============================================
  // LIGHTBOX
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lbImage = lightbox?.querySelector('.lb-image');
  const lbCaption = lightbox?.querySelector('.lb-caption');
  const lbClose = lightbox?.querySelector('.lb-close');

  function openLightbox(src, caption) {
    if (!lightbox) return;
    lbImage.src = src;
    lbCaption.textContent = caption;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    lbCaption.textContent = '';
    document.body.style.overflow = '';
  }

  // Gallery and card images
  document.querySelectorAll('.gallery-item img, .card img, .masonry-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const src = img.src;
      const caption = img.dataset.caption || img.alt || '';
      openLightbox(src, caption);
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // ============================================
  // CONTACT FORM
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for reaching out! We will contact you soon to discuss your sculpture commission.');
      contactForm.reset();
    });
  }

  // ============================================
  // PARALLAX EFFECT ON HERO (Optional subtle effect)
  // ============================================
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
  }

  // ============================================
  // SMOOTH REVEAL ON PAGE LOAD
  // ============================================
  window.addEventListener('load', () => {
    document.querySelectorAll('.slide-up').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 150);
    });
  });
});
