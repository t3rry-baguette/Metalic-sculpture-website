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
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
  loadProducts();
  loadStats();

  // Auto-refresh every 30 seconds
  setInterval(() => {
    loadStats();
    if (document.getElementById('orders').classList.contains('active')) {
      loadOrders();
    }
  }, 30000);

  // Filter and search listeners
  document.getElementById('searchFilter').addEventListener('input', filterOrders);
  document.getElementById('statusFilter').addEventListener('change', filterOrders);
});

// ============================================
// LOAD STATISTICS
// ============================================

async function loadStats() {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();

    document.getElementById('totalProducts').textContent = data.products;

    // Get order stats
    const ordersResponse = await fetch('/api/orders');
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
    const response = await fetch('/api/orders');
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

  container.innerHTML = orders.map(order => `
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
          <a href="tel:${order.phone}" style="color: #2a5298; text-decoration: none;">
            ${escapeHtml(order.phone)}
          </a>
        </div>
      </div>

      <div class="order-field">
        <div class="field-label">Product</div>
        <div class="field-value">${escapeHtml(order.product)}</div>
      </div>

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
  `).join('');
}

function filterOrders() {
  const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;

  const filtered = allOrders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.phone.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  renderOrders(filtered);
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

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
      method: 'DELETE'
    });

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

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-header">${escapeHtml(product.name)}</div>
      <div class="product-desc">${escapeHtml(product.description || 'No description')}</div>
      <div class="product-price">KES ${product.price.toLocaleString()}</div>
      
      <div class="product-actions">
        <button onclick="editProduct(${product.id})" style="background: #2a5298; color: white;">
          ✎ Edit
        </button>
        <button onclick="deleteProduct(${product.id})" style="background: #dc3545; color: white;">
          🗑 Delete
        </button>
      </div>
    </div>
  `).join('');
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });

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

function editProduct(productId) {
  alert('Edit functionality can be implemented. Product ID: ' + productId);
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
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
