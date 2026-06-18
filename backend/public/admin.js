// ============================================
// AUTHENTICATION UTILITIES
// ============================================

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`
  };
}

function getJsonHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

function handleAuthError(response) {
  if (response.status === 401) {
    console.warn('Unauthorized or session expired. Redirecting to login...');
    handleLogout();
    return true;
  }
  return false;
}

// Check if token exists and verify
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  const overlay = document.getElementById('loginOverlay');

  if (token) {
    overlay.style.display = 'none';
    initializeDashboard();
  } else {
    overlay.style.display = 'flex';
  }
});

function initializeDashboard() {
  loadOrders();
  loadProducts();
  loadStats();

  // Auto-refresh every 30 seconds
  setInterval(() => {
    if (localStorage.getItem('adminToken')) {
      loadStats();
      if (document.getElementById('orders').classList.contains('active')) {
        loadOrders();
      }
    }
  }, 30000);

  // Filter and search listeners
  document.getElementById('searchFilter').addEventListener('input', filterOrders);
  document.getElementById('statusFilter').addEventListener('change', filterOrders);
}

// Handle Login
async function handleLoginSubmit(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('loginErrorMessage');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('adminToken', data.token);
      document.getElementById('loginOverlay').style.display = 'none';
      errorMsg.style.display = 'none';
      
      // Clear forms
      document.getElementById('loginForm').reset();
      
      // Load app
      initializeDashboard();
    } else {
      errorMsg.textContent = data.error || 'Authentication failed';
      errorMsg.style.display = 'block';
    }
  } catch (error) {
    console.error('Error logging in:', error);
    errorMsg.textContent = 'Server connection failed';
    errorMsg.style.display = 'block';
  }
}

// Handle Logout
function handleLogout() {
  localStorage.removeItem('adminToken');
  document.getElementById('loginOverlay').style.display = 'flex';
  
  // Clear statistical summaries
  document.getElementById('totalProducts').textContent = '0';
  document.getElementById('totalOrders').textContent = '0';
  document.getElementById('pendingOrders').textContent = '0';
  document.getElementById('completedOrders').textContent = '0';
}

// ============================================
// TAB NAVIGATION
// ============================================

function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Remove active from all buttons
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Show selected tab
  document.getElementById(tabName).classList.add('active');

  // Add active to clicked button
  event.target.classList.add('active');

  // Load content for selected tab
  if (tabName === 'orders') {
    loadOrders();
  } else if (tabName === 'products') {
    loadProducts();
  }
}

// ============================================
// LOAD STATISTICS
// ============================================

async function loadStats() {
  try {
    const response = await fetch('/api/stats', {
      headers: getAuthHeaders()
    });

    if (handleAuthError(response)) return;

    const data = await response.json();
    document.getElementById('totalProducts').textContent = data.products;

    // Get order stats
    const ordersResponse = await fetch('/api/orders', {
      headers: getAuthHeaders()
    });

    if (handleAuthError(ordersResponse)) return;

    const orders = await ordersResponse.json();
    document.getElementById('totalOrders').textContent = orders.length;

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;

    document.getElementById('pendingOrders').textContent = pendingCount;
    document.getElementById('completedOrders').textContent = completedCount;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

let allOrders = [];

async function loadOrders() {
  try {
    const response = await fetch('/api/orders', {
      headers: getAuthHeaders()
    });

    if (handleAuthError(response)) return;

    allOrders = await response.json();
    renderOrders(allOrders);
    showMessage('ordersMessage', '');
  } catch (error) {
    console.error('Error loading orders:', error);
    showMessage('ordersMessage', 'Error loading orders', 'error');
  }
}

function renderOrders(orders) {
  const container = document.getElementById('ordersContainer');

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h2>No Orders Yet</h2>
        <p>Orders will appear here once customers place them</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    // Formatting optional columns
    const emailHtml = order.email ? `
      <div class="order-field">
        <div class="field-label">Email</div>
        <div class="field-value">
          <a href="mailto:${order.email}" style="color: var(--copper); text-decoration: none;">
            ${escapeHtml(order.email)}
          </a>
        </div>
      </div>
    ` : '';

    const locationHtml = order.deliveryLocation ? `
      <div class="order-field">
        <div class="field-label">Delivery Location</div>
        <div class="field-value">${escapeHtml(order.deliveryLocation)}</div>
      </div>
    ` : '';

    const priceHtml = order.totalPrice ? `
      <div class="order-field">
        <div class="field-label">Total Price</div>
        <div class="field-value" style="font-weight: 600; color: var(--copper);">
          KES ${order.totalPrice.toLocaleString()}
        </div>
      </div>
    ` : '';

    let customizationsHtml = '';
    if (order.customizations) {
      try {
        const items = JSON.parse(order.customizations);
        if (Array.isArray(items) && items.length > 0) {
          customizationsHtml = `
            <div class="order-field">
              <div class="field-label">Customizations</div>
              <div class="field-value">
                ${items.map(item => `<span class="customization-tag">${escapeHtml(item)}</span>`).join('')}
              </div>
            </div>
          `;
        }
      } catch (e) {
        customizationsHtml = `
          <div class="order-field">
            <div class="field-label">Customizations</div>
            <div class="field-value">${escapeHtml(order.customizations)}</div>
          </div>
        `;
      }
    }

    return `
      <div class="order-card ${order.status}">
        <div class="order-header">
          <div class="order-id">Order #${order.id}</div>
          <span class="status-badge ${order.status}">${order.status}</span>
        </div>

        <div class="order-field">
          <div class="field-label">Customer Name</div>
          <div class="field-value">${escapeHtml(order.customerName)}</div>
        </div>

        <div class="order-field">
          <div class="field-label">Phone</div>
          <div class="field-value">
            <a href="tel:${order.phone}" style="color: var(--copper); text-decoration: none; font-weight: 600;">
              ${escapeHtml(order.phone)}
            </a>
          </div>
        </div>

        ${emailHtml}

        <div class="order-field">
          <div class="field-label">Product</div>
          <div class="field-value">${escapeHtml(order.product)}</div>
        </div>

        ${priceHtml}
        ${locationHtml}
        ${customizationsHtml}

        <div class="order-field">
          <div class="field-label">Message</div>
          <div class="field-value">${escapeHtml(order.message || '(No message)')}</div>
        </div>

        <div class="order-field">
          <div class="field-label">Date</div>
          <div class="field-value">${formatDate(order.createdAt)}</div>
        </div>

        <div class="order-actions">
          ${order.status !== 'completed' ? `
            <button class="btn btn-complete" onclick="updateOrderStatus(${order.id}, 'completed')">
              ✓ Mark Complete
            </button>
          ` : ''}
          
          ${order.status !== 'cancelled' ? `
            <button class="btn btn-cancel" onclick="updateOrderStatus(${order.id}, 'cancelled')">
              ✗ Cancel
            </button>
          ` : ''}
          
          ${order.status === 'cancelled' ? `
            <button class="btn btn-pending" onclick="updateOrderStatus(${order.id}, 'pending')">
              ↺ Restore
            </button>
          ` : ''}
          
          <button class="btn btn-delete" onclick="deleteOrder(${order.id})">
            🗑 Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterOrders() {
  const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;

  const filtered = allOrders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.phone.toLowerCase().includes(searchTerm) ||
      (order.email && order.email.toLowerCase().includes(searchTerm)) ||
      order.product.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  renderOrders(filtered);
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: getJsonHeaders(),
      body: JSON.stringify({ status: newStatus })
    });

    if (handleAuthError(response)) return;

    if (response.ok) {
      showMessage('ordersMessage', `Order #${orderId} marked as ${newStatus}`, 'success');
      loadOrders();
      loadStats();
    } else {
      const error = await response.json();
      showMessage('ordersMessage', `Error: ${error.error}`, 'error');
    }
  } catch (error) {
    console.error('Error updating order:', error);
    showMessage('ordersMessage', 'Error updating order', 'error');
  }
}

async function deleteOrder(orderId) {
  if (!confirm('Are you sure you want to delete this order?')) {
    return;
  }

  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (handleAuthError(response)) return;

    if (response.ok) {
      showMessage('ordersMessage', `Order #${orderId} deleted`, 'success');
      loadOrders();
      loadStats();
    } else {
      const error = await response.json();
      showMessage('ordersMessage', `Error: ${error.error}`, 'error');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    showMessage('ordersMessage', 'Error deleting order', 'error');
  }
}

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

let allProducts = [];

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    allProducts = await response.json();
    renderProducts(allProducts);
    showMessage('productsMessage', '');
  } catch (error) {
    console.error('Error loading products:', error);
    showMessage('productsMessage', 'Error loading products', 'error');
  }
}

function renderProducts(products) {
  const container = document.getElementById('productsContainer');

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h2>No Products Yet</h2>
        <p>Add your first product to get started</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const defaultImage = `<span style="font-size: 3rem;">🎨</span>`;
    const imageTag = product.image ? `<img src="${product.image}" alt="${escapeHtml(product.name)}">` : defaultImage;

    return `
      <div class="product-card">
        <div class="product-image-container">
          ${imageTag}
        </div>
        <div class="product-header">${escapeHtml(product.name)}</div>
        <div class="product-desc">${escapeHtml(product.description || 'No description')}</div>
        <div class="product-price">KES ${product.price.toLocaleString()}</div>
        
        <div class="product-actions">
          <button onclick="editProduct(${product.id})" style="background: var(--copper); color: white;">
            ✎ Edit
          </button>
          <button onclick="deleteProduct(${product.id})" style="background: var(--gunmetal); color: white;">
            🗑 Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Add Product functions
function openAddProductModal() {
  document.getElementById('addProductForm').reset();
  document.getElementById('addProductImage').value = '';
  document.getElementById('addProductPreview').style.display = 'none';
  document.getElementById('addUploadStatus').textContent = '';
  document.getElementById('addProductModalBackdrop').style.display = 'flex';
}

function closeAddProductModal() {
  document.getElementById('addProductModalBackdrop').style.display = 'none';
}

async function submitProductAdd(event) {
  event.preventDefault();
  
  const name = document.getElementById('addProductName').value;
  const description = document.getElementById('addProductDesc').value;
  const price = document.getElementById('addProductPrice').value;
  const image = document.getElementById('addProductImage').value;

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify({ name, description, price: parseInt(price), image })
    });

    if (handleAuthError(response)) return;

    if (response.ok) {
      showMessage('productsMessage', 'Product created successfully', 'success');
      closeAddProductModal();
      loadProducts();
      loadStats();
    } else {
      const error = await response.json();
      showMessage('productsMessage', `Error: ${error.error}`, 'error');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    showMessage('productsMessage', 'Error adding product', 'error');
  }
}

// AJAX Image Upload
async function handleImageUpload(event, type) {
  const fileInput = event.target;
  const file = fileInput.files[0];
  if (!file) return;

  const statusId = type === 'add' ? 'addUploadStatus' : 'editUploadStatus';
  const previewId = type === 'add' ? 'addProductPreview' : 'editProductPreview';
  const hiddenInputId = type === 'add' ? 'addProductImage' : 'editProductImage';

  const statusEl = document.getElementById(statusId);
  const previewEl = document.getElementById(previewId);
  const hiddenInput = document.getElementById(hiddenInputId);

  statusEl.textContent = '⏳ Uploading image...';
  statusEl.style.color = 'var(--gunmetal)';

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (handleAuthError(response)) return;

    const data = await response.json();

    if (response.ok) {
      hiddenInput.value = data.imageUrl;
      previewEl.src = data.imageUrl;
      previewEl.style.display = 'block';
      statusEl.textContent = '✓ Image uploaded successfully';
      statusEl.style.color = '#28a745';
    } else {
      statusEl.textContent = `❌ Upload failed: ${data.error}`;
      statusEl.style.color = '#dc3545';
      hiddenInput.value = '';
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    statusEl.textContent = '❌ Upload failed due to connection error';
    statusEl.style.color = '#dc3545';
    hiddenInput.value = '';
  }
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (handleAuthError(response)) return;

    if (response.ok) {
      showMessage('productsMessage', `Product deleted`, 'success');
      loadProducts();
      loadStats();
    } else {
      const error = await response.json();
      showMessage('productsMessage', `Error: ${error.error}`, 'error');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    showMessage('productsMessage', 'Error deleting product', 'error');
  }
}

async function editProduct(productId) {
  try {
    // Fetch the product details
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
      showMessage('productsMessage', 'Error loading product details', 'error');
      return;
    }

    const product = await response.json();

    // Populate form with product data
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDesc').value = product.description || '';
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductImage').value = product.image || '';
    document.getElementById('editProductForm').dataset.productId = productId;

    // Reset upload status and preview
    const previewEl = document.getElementById('editProductPreview');
    const statusEl = document.getElementById('editUploadStatus');
    document.getElementById('editProductImageFile').value = '';
    
    if (product.image) {
      previewEl.src = product.image;
      previewEl.style.display = 'block';
      statusEl.textContent = '✓ Current image loaded';
      statusEl.style.color = 'var(--gunmetal)';
    } else {
      previewEl.style.display = 'none';
      statusEl.textContent = '';
    }

    // Show modal
    document.getElementById('editProductModalBackdrop').style.display = 'flex';
  } catch (error) {
    console.error('Error opening edit modal:', error);
    showMessage('productsMessage', 'Error loading product', 'error');
  }
}

function closeEditModal() {
  const backdrop = document.getElementById('editProductModalBackdrop');
  if (backdrop) {
    backdrop.style.display = 'none';
  }
}

async function submitProductEdit(event) {
  event.preventDefault();

  const productId = document.getElementById('editProductForm').dataset.productId;
  const name = document.getElementById('editProductName').value;
  const description = document.getElementById('editProductDesc').value;
  const price = document.getElementById('editProductPrice').value;
  const image = document.getElementById('editProductImage').value;

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: getJsonHeaders(),
      body: JSON.stringify({ name, description, price: parseInt(price), image })
    });

    if (handleAuthError(response)) return;

    if (response.ok) {
      showMessage('productsMessage', `Product updated successfully`, 'success');
      closeEditModal();
      loadProducts();
      loadStats();
    } else {
      const error = await response.json();
      showMessage('productsMessage', `Error: ${error.error}`, 'error');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    showMessage('productsMessage', 'Error updating product', 'error');
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showMessage(elementId, message, type = '') {
  const element = document.getElementById(elementId);
  if (!message) {
    element.innerHTML = '';
    return;
  }

  const className = type ? ` ${type}` : '';
  element.innerHTML = `<div class="${className}">${escapeHtml(message)}</div>`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
