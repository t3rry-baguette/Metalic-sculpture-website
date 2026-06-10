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

  // ============================================
  // DYNAMIC PRODUCT LOADING
  // ============================================
  loadDynamicProducts();
});

/**
 * Load products from API and render them dynamically
 */
async function loadDynamicProducts() {
  try {
    // Check if we're on a page that displays products
    const masonryGrid = document.querySelector('.masonry-grid');
    if (!masonryGrid) return; // Not on a product display page
    
    console.log('🔄 Loading products from API...');
    const products = await fetchAllProducts();
    
    if (products.length === 0) {
      console.warn('⚠️  No products found');
      return;
    }
    
    // Get the category from the page URL or default to 'all'
    const currentPage = window.location.pathname;
    const categories = {
      'lion': 'Lion',
      'elephant': 'Elephant',
      'giraffe': 'Giraffe',
      'rhino': 'Rhino',
      'bird': 'Bird'
    };
    
    // For now, dynamically create product items based on product names
    const productElements = products.map(product => {
      const productName = product.name.toLowerCase();
      let category = 'custom'; // default category
      
      for (const [key, value] of Object.entries(categories)) {
        if (productName.includes(key) || productName.includes(value.toLowerCase())) {
          category = key;
          break;
        }
      }
      
      return createProductElement(product, category);
    });
    
    // Clear existing hardcoded items and add API-loaded items
    const existingItems = masonryGrid.querySelectorAll('.masonry-item');
    existingItems.forEach(item => item.remove());
    
    productElements.forEach(el => masonryGrid.appendChild(el));
    console.log(`✓ ${products.length} products loaded and rendered`);
    
    // Re-initialize event listeners on new elements
    initializeProductEventListeners();
    
  } catch (error) {
    console.error('❌ Error loading dynamic products:', error);
  }
}

/**
 * Create a product element from product data
 */
function createProductElement(product, category = 'custom') {
  const item = document.createElement('div');
  item.className = 'masonry-item';
  item.setAttribute('data-category', category);
  item.setAttribute('data-product-id', product.id);
  item.id = `product-${product.id}`;
  
  // Determine icon based on category
  const categoryIcons = {
    'lion': '🦁',
    'elephant': '🐘',
    'giraffe': '🦒',
    'rhino': '🦏',
    'bird': '🦅',
    'custom': '🎨'
  };
  
  const icon = categoryIcons[category] || '🎨';
  
  item.innerHTML = `
    <div style="background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%); display: flex; align-items: center; justify-content: center; min-height: 250px; font-size: 4rem; border-radius: 8px;">
      ${icon}
    </div>
    <div class="overlay">
      <div class="overlay-content">
        <h3>${product.name}</h3>
        <p style="font-size: 0.9em; margin-top: 0.5rem; color: rgba(255,255,255,0.8);">${formatPrice(product.price)}</p>
        <button class="btn btn-primary" onclick="openOrderForm('${product.id}', '${product.name}')" style="margin-top: 0.5rem; font-size: 0.85em; padding: 8px 16px;">Order Now</button>
      </div>
    </div>
  `;
  
  return item;
}

/**
 * Initialize event listeners on product elements
 */
function initializeProductEventListeners() {
  // Add click listeners to masonry items for lightbox
  document.querySelectorAll('.masonry-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function(e) {
      // Don't trigger lightbox if clicking the Order Now button
      if (e.target.closest('button')) return;
      
      const productId = this.getAttribute('data-product-id');
      const productName = this.querySelector('h3').textContent;
      console.log(`📷 Opening lightbox for ${productName}`);
    });
  });
}

/**
 * Open order form modal with product selected
 */
function openOrderForm(productId, productName) {
  console.log(`🛒 Opening order form for product: ${productName}`);
  
  // Check if modal already exists
  let modal = document.getElementById('orderModal');
  
  if (!modal) {
    // Create modal if it doesn't exist
    modal = document.createElement('div');
    modal.id = 'orderModal';
    modal.className = 'order-modal';
    modal.innerHTML = `
      <div class="order-modal-content">
        <button class="modal-close" onclick="closeOrderForm()">✕</button>
        <h2>Place Your Order</h2>
        <form id="orderForm" onsubmit="submitOrder(event)">
          <div class="form-group">
            <label for="productSelect">Product *</label>
            <input type="text" id="productSelect" readonly style="background: #f0f0f0;">
          </div>
          
          <div class="form-group">
            <label for="customerName">Your Name *</label>
            <input type="text" id="customerName" placeholder="Enter your full name" required>
          </div>
          
          <div class="form-group">
            <label for="customerPhone">Phone Number *</label>
            <input type="tel" id="customerPhone" placeholder="e.g., +254 700 000 000" required>
          </div>
          
          <div class="form-group">
            <label for="customerMessage">Additional Message</label>
            <textarea id="customerMessage" placeholder="Any special requests or customizations?" rows="4"></textarea>
          </div>
          
          <div style="margin-top: 2rem;">
            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">Submit Order</button>
            <button type="button" class="btn" onclick="closeOrderForm()" style="width: 100%; padding: 12px; margin-top: 0.5rem; background: #ccc; color: #333;">Cancel</button>
          </div>
        </form>
      </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .order-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }
      
      .order-modal.active {
        display: flex;
      }
      
      .order-modal-content {
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        position: relative;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      }
      
      .order-modal-content h2 {
        margin-top: 0;
        color: #1e3c72;
        margin-bottom: 2rem;
      }
      
      .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      }
      
      .modal-close:hover {
        color: #000;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #333;
      }
      
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        font-family: inherit;
      }
      
      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #2a5298;
        box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.1);
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }
  
  // Populate product and show modal
  document.getElementById('productSelect').value = productName;
  modal.setAttribute('data-product-id', productId);
  modal.classList.add('active');
}

/**
 * Close the order form modal
 */
function closeOrderForm() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.remove('active');
    // Reset form
    document.getElementById('orderForm').reset();
  }
}

/**
 * Submit the order form
 */
async function submitOrder(event) {
  event.preventDefault();
  
  const modal = document.getElementById('orderModal');
  const productId = modal.getAttribute('data-product-id');
  const productName = document.getElementById('productSelect').value;
  const customerName = document.getElementById('customerName').value;
  const customerPhone = document.getElementById('customerPhone').value;
  const customerMessage = document.getElementById('customerMessage').value;
  
  // Validation
  if (!customerName || !customerPhone) {
    alert('Please fill in all required fields');
    return;
  }
  
  try {
    console.log('🔄 Submitting order...');
    const order = await createOrder(customerName, customerPhone, productName, customerMessage);
    
    console.log('✓ Order submitted successfully:', order);
    alert(`✓ Order submitted successfully!\n\nOrder #${order.id}\nWe'll contact you at ${customerPhone} to confirm the details.`);
    
    closeOrderForm();
  } catch (error) {
    console.error('❌ Error submitting order:', error);
    alert(`❌ Error submitting order: ${error.message}`);
  }
}
