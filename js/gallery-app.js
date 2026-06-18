// ============================================================
// MOSES SCULPTURES — Gallery E-Commerce Application
// Manages: Category view → Product view → Detail modal
//          Customization panel → Cart → Checkout
// ============================================================
'use strict';

// ── STATE ───────────────────────────────────────────────────
const GS = {
  view: 'categories',        // 'categories' | 'products'
  selectedCategory: null,
  selectedProduct: null,
  productImageIndex: 0,
  customizations: {
    size: 'medium',
    finish: 'raw-steel',
    color: 'none',
    engraving: '',
    quantity: 1,
    specialInstructions: ''
  },
  cart: [],                  // [{product, customizations, price, qty}]
  submitting: false
};

// ── PRICE CALCULATOR ────────────────────────────────────────
function calcPrice(product, c) {
  if (!product) return 0;
  const sz   = PRICE_CONFIG.size[c.size]       || PRICE_CONFIG.size.medium;
  const fn   = PRICE_CONFIG.finish[c.finish]   || PRICE_CONFIG.finish['raw-steel'];
  const col  = PRICE_CONFIG.color[c.color]     || PRICE_CONFIG.color.none;
  const engr = c.engraving && c.engraving.trim().length > 0 ? PRICE_CONFIG.engraving.extra : 0;

  const sizedPrice  = product.basePrice * sz.multiplier;
  const withFinish  = sizedPrice * (1 + fn.pct);
  const withColor   = withFinish + col.extra;
  const withEngrave = withColor + engr;
  const total       = Math.round(withEngrave) * (c.quantity || 1);
  return total;
}

function getPriceBreakdown(product, c) {
  const sz   = PRICE_CONFIG.size[c.size]       || PRICE_CONFIG.size.medium;
  const fn   = PRICE_CONFIG.finish[c.finish]   || PRICE_CONFIG.finish['raw-steel'];
  const col  = PRICE_CONFIG.color[c.color]     || PRICE_CONFIG.color.none;
  const engr = c.engraving && c.engraving.trim().length > 0 ? PRICE_CONFIG.engraving.extra : 0;

  const base  = product.basePrice;
  const sized = Math.round(base * sz.multiplier);
  const finP  = Math.round(sized * fn.pct);
  const lines = [
    { label: `Base price (${sz.label})`, amount: sized }
  ];
  if (finP > 0) lines.push({ label: `${fn.label} finish`, amount: finP });
  if (col.extra > 0) lines.push({ label: col.label, amount: col.extra });
  if (engr > 0) lines.push({ label: 'Engraving', amount: engr });
  const unitTotal = Math.round(sized + finP + col.extra + engr);
  if (c.quantity > 1) {
    lines.push({ label: `Quantity ×${c.quantity}`, amount: null, isMultiplier: true });
  }
  return { lines, unitTotal, total: unitTotal * (c.quantity || 1) };
}

// ── FORMAT ──────────────────────────────────────────────────
function kes(n) {
  return 'KES ' + Number(n).toLocaleString('en-KE');
}

// ── TOAST NOTIFICATIONS ─────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `gallery-toast gallery-toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('gallery-toast--show'));
  setTimeout(() => {
    t.classList.remove('gallery-toast--show');
    setTimeout(() => t.remove(), 400);
  }, 2800);
}

// ── CATEGORY VIEW ───────────────────────────────────────────
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = '';

  SCULPTURE_CATALOG.categories.forEach((cat, i) => {
    const count = getProductsByCategory(cat.id).length;
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.setAttribute('data-cat-id', cat.id);
    card.style.animationDelay = `${i * 80}ms`;
    card.innerHTML = `
      <div class="cat-card-accent" style="background: linear-gradient(135deg, ${cat.accentColor}22, ${cat.accentColor}08)"></div>
      <div class="cat-card-emoji">${cat.emoji}</div>
      <div class="cat-card-body">
        <h3 class="cat-card-name">${cat.name}</h3>
        <p class="cat-card-tagline">${cat.tagline}</p>
        <p class="cat-card-desc">${cat.description}</p>
        <div class="cat-card-footer">
          <span class="cat-card-count">${count} piece${count !== 1 ? 's' : ''}</span>
          <span class="cat-card-cta">Explore →</span>
        </div>
      </div>
      <div class="cat-card-border" style="--accent: ${cat.accentColor}"></div>
    `;
    card.addEventListener('click', () => showProductsView(cat.id));
    grid.appendChild(card);
  });

  // Update header
  setHeroContent('Our Collections',
    'Six categories of handcrafted metal sculpture — each an expression of Africa\'s wildlife and Moses\'s 18 years of mastery.',
    'Collections');
}

function showProductsView(categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) return;
  GS.selectedCategory = cat;
  GS.view = 'products';

  const vCat  = document.getElementById('view-categories');
  const vProd = document.getElementById('view-products');

  vCat.classList.remove('gv--active');
  vCat.classList.add('gv--exit');
  setTimeout(() => {
    vCat.style.display = 'none';
    vCat.classList.remove('gv--exit');
    renderProducts(cat);
    vProd.style.display = 'block';
    requestAnimationFrame(() => vProd.classList.add('gv--active'));
  }, 280);

  setHeroContent(cat.name, cat.description, `Collections / ${cat.name}`);
  window.scrollTo({ top: document.getElementById('gallery-app').offsetTop - 80, behavior: 'smooth' });
}

function showCategoriesView() {
  GS.view = 'categories';
  GS.selectedCategory = null;

  const vCat  = document.getElementById('view-categories');
  const vProd = document.getElementById('view-products');

  vProd.classList.remove('gv--active');
  vProd.classList.add('gv--exit');
  setTimeout(() => {
    vProd.style.display = 'none';
    vProd.classList.remove('gv--exit');
    vCat.style.display = 'block';
    requestAnimationFrame(() => vCat.classList.add('gv--active'));
  }, 280);

  setHeroContent('Our Collections',
    'Six categories of handcrafted metal sculpture — each an expression of Africa\'s wildlife and Moses\'s 18 years of mastery.',
    'Collections');
  window.scrollTo({ top: document.getElementById('gallery-app').offsetTop - 80, behavior: 'smooth' });
}

function setHeroContent(title, subtitle, breadcrumb) {
  const t = document.getElementById('gallery-hero-title');
  const s = document.getElementById('gallery-hero-subtitle');
  const b = document.getElementById('gallery-breadcrumb');
  if (t) t.textContent = title;
  if (s) s.textContent = subtitle;
  if (b) b.textContent = breadcrumb;
}

// ── PRODUCTS VIEW ───────────────────────────────────────────
function renderProducts(cat) {
  const grid = document.getElementById('products-grid');
  const catLabel = document.getElementById('products-cat-label');
  if (!grid) return;

  if (catLabel) {
    catLabel.textContent = cat.name;
    catLabel.style.setProperty('--cat-accent', cat.accentColor);
  }

  const products = getProductsByCategory(cat.id);
  grid.innerHTML = '';

  products.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = 'prod-card' + (product.featured ? ' prod-card--featured' : '');
    card.style.animationDelay = `${i * 90}ms`;
    card.innerHTML = `
      ${product.featured ? '<div class="prod-card-badge">Featured</div>' : ''}
      <div class="prod-card-art">
        ${product.getSvg()}
      </div>
      <div class="prod-card-info">
        <h3 class="prod-card-name">${product.name}</h3>
        <p class="prod-card-tagline">${product.tagline}</p>
        <div class="prod-card-price-row">
          <span class="prod-card-price">From ${kes(product.basePrice)}</span>
          <button class="prod-card-btn" data-pid="${product.id}">Customise →</button>
        </div>
      </div>
    `;
    card.querySelector('.prod-card-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openProductModal(product.id);
    });
    card.addEventListener('click', () => openProductModal(product.id));
    grid.appendChild(card);
  });
}

// ── PRODUCT MODAL ───────────────────────────────────────────
function openProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return;
  GS.selectedProduct = product;

  // Reset customizations
  GS.customizations = {
    size: 'medium', finish: 'raw-steel',
    color: 'none', engraving: '', quantity: 1, specialInstructions: ''
  };

  const modal = document.getElementById('product-modal');

  // Populate modal
  document.getElementById('modal-product-name').textContent = product.name;
  document.getElementById('modal-product-desc').textContent = product.description;
  document.getElementById('modal-product-base').textContent = `From ${kes(product.basePrice)}`;

  const cat = getCategoryById(product.categoryId);
  document.getElementById('modal-cat-tag').textContent = cat ? cat.name : '';

  // Render art
  document.getElementById('modal-art').innerHTML = product.getSvg();

  // Render customization options
  renderCustomOptions();
  updatePriceDisplay();

  // WhatsApp quick quote link
  updateWhatsAppLink(product);

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modal.classList.add('pm--open'));
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  modal.classList.remove('pm--open');
  setTimeout(() => {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    GS.selectedProduct = null;
  }, 320);
}

function renderCustomOptions() {
  renderPills('size-opts', PRICE_CONFIG.size, GS.customizations.size, (val) => {
    GS.customizations.size = val;
    updatePriceDisplay();
  });
  renderPills('finish-opts', PRICE_CONFIG.finish, GS.customizations.finish, (val) => {
    GS.customizations.finish = val;
    updatePriceDisplay();
    updateFinishSwatch();
  });
  renderPills('color-opts', PRICE_CONFIG.color, GS.customizations.color, (val) => {
    GS.customizations.color = val;
    updatePriceDisplay();
  });

  // Engraving
  const engInput = document.getElementById('engrave-input');
  if (engInput) {
    engInput.value = GS.customizations.engraving;
    engInput.addEventListener('input', () => {
      GS.customizations.engraving = engInput.value;
      updatePriceDisplay();
    });
  }

  // Quantity
  updateQtyDisplay();
  document.getElementById('qty-minus').onclick = () => {
    if (GS.customizations.quantity > 1) {
      GS.customizations.quantity--;
      updateQtyDisplay();
      updatePriceDisplay();
    }
  };
  document.getElementById('qty-plus').onclick = () => {
    if (GS.customizations.quantity < 20) {
      GS.customizations.quantity++;
      updateQtyDisplay();
      updatePriceDisplay();
    }
  };

  // Special instructions
  const siInput = document.getElementById('special-instructions');
  if (siInput) {
    siInput.value = '';
    siInput.addEventListener('input', () => {
      GS.customizations.specialInstructions = siInput.value;
    });
  }
}

function renderPills(containerId, config, selected, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  Object.entries(config).forEach(([key, opt]) => {
    const btn = document.createElement('button');
    btn.className = 'opt-pill' + (key === selected ? ' opt-pill--active' : '');
    btn.type = 'button';

    let extra = '';
    if (opt.multiplier !== undefined) {
      extra = opt.multiplier === 1 ? '' : (opt.multiplier < 1 ? ` (–${Math.round((1-opt.multiplier)*100)}%)` : ` (+${Math.round((opt.multiplier-1)*100)}%)`);
    } else if (opt.pct !== undefined && opt.pct > 0) {
      extra = ` (+${Math.round(opt.pct*100)}%)`;
    } else if (opt.extra !== undefined && opt.extra > 0) {
      extra = ` (+${kes(opt.extra)})`;
    }

    btn.innerHTML = `
      <span class="pill-label">${opt.label}</span>
      ${extra ? `<span class="pill-extra">${extra}</span>` : ''}
      ${opt.note ? `<span class="pill-note">${opt.note}</span>` : ''}
      ${opt.hex ? `<span class="pill-swatch" style="background:${opt.hex}"></span>` : ''}
    `;

    btn.addEventListener('click', () => {
      container.querySelectorAll('.opt-pill').forEach(p => p.classList.remove('opt-pill--active'));
      btn.classList.add('opt-pill--active');
      onChange(key);
    });
    container.appendChild(btn);
  });
}

function updateQtyDisplay() {
  const d = document.getElementById('qty-display');
  if (d) d.textContent = GS.customizations.quantity;
}

function updateFinishSwatch() {
  const fn = PRICE_CONFIG.finish[GS.customizations.finish];
  const art = document.getElementById('modal-art');
  if (!art || !fn) return;
  // Tint the SVG slightly
  art.style.filter = GS.customizations.finish === 'matte-black'
    ? 'brightness(0.5) contrast(1.2)'
    : GS.customizations.finish === 'polished-silver'
    ? 'brightness(1.3) saturate(0)'
    : GS.customizations.finish === 'brushed-copper'
    ? 'sepia(0.6) saturate(1.5) brightness(0.9)'
    : '';
}

function updatePriceDisplay() {
  const product = GS.selectedProduct;
  if (!product) return;
  const total = calcPrice(product, GS.customizations);
  const breakdown = getPriceBreakdown(product, GS.customizations);

  // Animate the price number
  const priceEl = document.getElementById('modal-price');
  if (priceEl) {
    animatePrice(priceEl, total);
  }

  // Breakdown
  const bdEl = document.getElementById('price-breakdown');
  if (bdEl) {
    bdEl.innerHTML = breakdown.lines.map(l => `
      <div class="bd-line ${l.isMultiplier ? 'bd-line--mult' : ''}">
        <span>${l.label}</span>
        <span>${l.amount !== null ? kes(l.amount) : '×' + GS.customizations.quantity}</span>
      </div>
    `).join('') + `<div class="bd-total"><span>Total</span><span>${kes(breakdown.total)}</span></div>`;
  }

  // WhatsApp
  updateWhatsAppLink(product);
}

function animatePrice(el, target) {
  const current = parseInt(el.dataset.value || '0');
  el.dataset.value = target;
  const diff = target - current;
  const steps = 20;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    const v = Math.round(current + (diff * step / steps));
    el.textContent = kes(v);
    if (step >= steps) {
      el.textContent = kes(target);
      clearInterval(timer);
    }
  }, 18);
}

function updateWhatsAppLink(product) {
  const btn = document.getElementById('whatsapp-quote-btn');
  if (!btn) return;
  const c = GS.customizations;
  const sz = PRICE_CONFIG.size[c.size].label;
  const fn = PRICE_CONFIG.finish[c.finish].label;
  const col = PRICE_CONFIG.color[c.color].label;
  const price = calcPrice(product, c);
  const msg = encodeURIComponent(
    `Hello Moses Sculptures! 👋\n\nI'm interested in:\n` +
    `📦 Product: ${product.name}\n` +
    `📐 Size: ${sz}\n` +
    `✨ Finish: ${fn}\n` +
    `🎨 Color: ${col}\n` +
    (c.engraving ? `🔤 Engraving: "${c.engraving}"\n` : '') +
    `🔢 Quantity: ${c.quantity}\n` +
    `💰 Estimated Price: ${kes(price)}\n\n` +
    `Please confirm availability and payment options. Thank you!`
  );
  btn.href = `https://wa.me/254700000000?text=${msg}`;
}

// ── CART ────────────────────────────────────────────────────
function addToCart() {
  const product = GS.selectedProduct;
  if (!product) return;
  const c = { ...GS.customizations };
  const price = calcPrice(product, c);

  GS.cart.push({ product, customizations: c, price });
  updateCartBadge();
  closeProductModal();
  showToast(`✓ ${product.name} added to your order`);
}

function removeCartItem(index) {
  GS.cart.splice(index, 1);
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  const floatBtn = document.getElementById('cart-float-btn');
  if (badge) {
    badge.textContent = GS.cart.length;
    badge.style.display = GS.cart.length > 0 ? 'flex' : 'none';
  }
  if (floatBtn) {
    floatBtn.classList.toggle('cart-float-btn--active', GS.cart.length > 0);
  }
}

function openCart() {
  renderCart();
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel.setAttribute('aria-hidden', 'false');
  overlay.classList.add('cart-overlay--show');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => panel.classList.add('cp--open'));
}

function closeCart() {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel.classList.remove('cp--open');
  overlay.classList.remove('cart-overlay--show');
  setTimeout(() => {
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }, 320);
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-amount');
  if (!itemsEl) return;

  if (GS.cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your order is empty.</p>
        <p>Browse our collections and add pieces to get started.</p>
      </div>`;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = GS.cart.map((item, i) => {
    const c = item.customizations;
    const sz = PRICE_CONFIG.size[c.size]?.label || c.size;
    const fn = PRICE_CONFIG.finish[c.finish]?.label || c.finish;
    return `
      <div class="cart-item">
        <div class="cart-item-art">${item.product.getSvg()}</div>
        <div class="cart-item-details">
          <div class="cart-item-header">
            <span class="cart-item-name">${item.product.name}</span>
            <button class="cart-item-remove" data-index="${i}" title="Remove">✕</button>
          </div>
          <div class="cart-item-opts">
            <span>${sz}</span>
            <span>${fn}</span>
            ${c.color !== 'none' ? `<span>${PRICE_CONFIG.color[c.color]?.label}</span>` : ''}
            ${c.engraving ? `<span>Engraving: "${c.engraving}"</span>` : ''}
            ${c.quantity > 1 ? `<span>Qty: ${c.quantity}</span>` : ''}
          </div>
          ${c.specialInstructions ? `<div class="cart-item-note">"${c.specialInstructions}"</div>` : ''}
          <div class="cart-item-price">${kes(item.price)}</div>
        </div>
      </div>`;
  }).join('');

  // Attach remove handlers
  itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeCartItem(parseInt(btn.dataset.index)));
  });

  const total = GS.cart.reduce((s, i) => s + i.price, 0);
  if (totalEl) totalEl.textContent = kes(total);
  if (footerEl) footerEl.style.display = 'block';
}

// ── CHECKOUT ────────────────────────────────────────────────
async function submitOrder() {
  if (GS.submitting) return;
  if (GS.cart.length === 0) { showToast('Add items to your order first', 'error'); return; }

  const name     = document.getElementById('checkout-name').value.trim();
  const phone    = document.getElementById('checkout-phone').value.trim();
  const email    = document.getElementById('checkout-email').value.trim();
  const location = document.getElementById('checkout-location').value.trim();

  if (!name) { showToast('Please enter your full name', 'error'); return; }
  if (!phone) { showToast('Please enter your phone number', 'error'); return; }
  if (!location) { showToast('Please enter your delivery location', 'error'); return; }

  const totalPrice = GS.cart.reduce((s, i) => s + i.price, 0);
  const productSummary = GS.cart.map(i => i.product.name).join(', ');
  const customizationsSummary = GS.cart.map(item => ({
    product: item.product.name,
    size: PRICE_CONFIG.size[item.customizations.size]?.label,
    finish: PRICE_CONFIG.finish[item.customizations.finish]?.label,
    color: PRICE_CONFIG.color[item.customizations.color]?.label,
    engraving: item.customizations.engraving || null,
    quantity: item.customizations.quantity,
    specialInstructions: item.customizations.specialInstructions || null,
    price: item.price
  }));

  const submitBtn = document.getElementById('checkout-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
  }
  GS.submitting = true;

  try {
    const resp = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        phone,
        email: email || null,
        product: productSummary,
        message: `Order contains ${GS.cart.length} item(s).`,
        customizations: customizationsSummary,
        totalPrice,
        deliveryLocation: location
      })
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || 'Server error');
    }

    const order = await resp.json();
    showOrderSuccess(order.id, name, totalPrice);
    GS.cart = [];
    updateCartBadge();

  } catch (err) {
    console.error('Order error:', err);
    showToast(`Could not submit order: ${err.message}`, 'error');
  } finally {
    GS.submitting = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Order Request';
    }
  }
}

function showOrderSuccess(orderId, name, total) {
  const cartItems = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  if (cartItems) {
    cartItems.innerHTML = `
      <div class="cart-success">
        <div class="cart-success-icon">✓</div>
        <h3>Order Confirmed!</h3>
        <p>Thank you, <strong>${name}</strong>.</p>
        <p>Your order <strong>#${orderId}</strong> has been received.</p>
        <p class="cart-success-total">Total: <strong>${kes(total)}</strong></p>
        <p class="cart-success-note">Moses will contact you within 24 hours to confirm details and payment via M-Pesa.</p>
        <button class="btn btn-primary" onclick="closeCart()" style="margin-top:1.5rem; width:100%;">Close</button>
      </div>`;
  }
  if (cartFooter) cartFooter.style.display = 'none';
  // Reset checkout form
  ['checkout-name','checkout-phone','checkout-email','checkout-location'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ── PRICE BREAKDOWN TOGGLE ───────────────────────────────────
function toggleBreakdown() {
  const bd = document.getElementById('price-breakdown');
  const toggle = document.getElementById('bd-toggle');
  if (!bd) return;
  const open = bd.style.display !== 'none';
  bd.style.display = open ? 'none' : 'block';
  if (toggle) toggle.textContent = open ? 'View price breakdown ▾' : 'Hide breakdown ▴';
}

// ── INIT ─────────────────────────────────────────────────────
function initGalleryApp() {

  // Initial render
  renderCategories();
  document.getElementById('view-categories').classList.add('gv--active');

  // Back button
  const backBtn = document.getElementById('back-to-categories');
  if (backBtn) backBtn.addEventListener('click', showCategoriesView);

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeProductModal);
  document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('product-modal')) closeProductModal();
  });

  // Add to cart
  document.getElementById('add-to-cart-btn').addEventListener('click', addToCart);

  // Cart float button
  document.getElementById('cart-float-btn').addEventListener('click', openCart);

  // Cart close
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  // Checkout submit
  document.getElementById('checkout-submit').addEventListener('click', submitOrder);

  // Price breakdown toggle
  const bdToggle = document.getElementById('bd-toggle');
  if (bdToggle) bdToggle.addEventListener('click', toggleBreakdown);

  // Keyboard: Escape closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('product-modal');
      if (modal && modal.getAttribute('aria-hidden') === 'false') {
        closeProductModal();
      } else {
        const panel = document.getElementById('cart-panel');
        if (panel && panel.getAttribute('aria-hidden') === 'false') closeCart();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initGalleryApp);
