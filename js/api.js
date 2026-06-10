// ============================================
// API UTILITIES MODULE
// ============================================
// Centralized API communication for all frontend pages
// Base URL: http://localhost:3000

const API_BASE_URL = 'http://localhost:3000/api';

// ============================================
// PRODUCTS API
// ============================================

/**
 * Get all products from the database
 */
async function fetchAllProducts() {
  try {
    console.log('🔄 Fetching all products from API...');
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log('✓ Products loaded successfully:', products);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    return [];
  }
}

/**
 * Get a single product by ID
 */
async function fetchProductById(productId) {
  try {
    console.log(`🔄 Fetching product ${productId}...`);
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const product = await response.json();
    console.log(`✓ Product ${productId} loaded:`, product);
    return product;
  } catch (error) {
    console.error(`❌ Error fetching product ${productId}:`, error.message);
    return null;
  }
}

/**
 * Create a new product (admin only)
 */
async function createProduct(name, description, price, image) {
  try {
    console.log('🔄 Creating new product...');
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        price: parseInt(price),
        image
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    
    const product = await response.json();
    console.log('✓ Product created successfully:', product);
    return product;
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    throw error;
  }
}

/**
 * Update an existing product (admin only)
 */
async function updateProduct(productId, name, description, price, image) {
  try {
    console.log(`🔄 Updating product ${productId}...`);
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        price: parseInt(price),
        image
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✓ Product ${productId} updated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error updating product ${productId}:`, error.message);
    throw error;
  }
}

/**
 * Delete a product (admin only)
 */
async function deleteProduct(productId) {
  try {
    console.log(`🔄 Deleting product ${productId}...`);
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✓ Product ${productId} deleted successfully:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error deleting product ${productId}:`, error.message);
    throw error;
  }
}

// ============================================
// ORDERS API
// ============================================

/**
 * Get all orders (admin only)
 */
async function fetchAllOrders() {
  try {
    console.log('🔄 Fetching all orders from API...');
    const response = await fetch(`${API_BASE_URL}/orders`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const orders = await response.json();
    console.log('✓ Orders loaded successfully:', orders);
    return orders;
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    return [];
  }
}

/**
 * Get a single order by ID
 */
async function fetchOrderById(orderId) {
  try {
    console.log(`🔄 Fetching order ${orderId}...`);
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const order = await response.json();
    console.log(`✓ Order ${orderId} loaded:`, order);
    return order;
  } catch (error) {
    console.error(`❌ Error fetching order ${orderId}:`, error.message);
    return null;
  }
}

/**
 * Create a new order (from customer)
 */
async function createOrder(customerName, phone, product, message = '') {
  try {
    console.log('🔄 Creating new order...');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerName,
        phone,
        product,
        message
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    
    const order = await response.json();
    console.log('✓ Order created successfully:', order);
    return order;
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    throw error;
  }
}

/**
 * Update order status (admin only)
 */
async function updateOrderStatus(orderId, status) {
  try {
    console.log(`🔄 Updating order ${orderId} status to ${status}...`);
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✓ Order ${orderId} updated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error updating order ${orderId}:`, error.message);
    throw error;
  }
}

/**
 * Delete an order (admin only)
 */
async function deleteOrder(orderId) {
  try {
    console.log(`🔄 Deleting order ${orderId}...`);
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✓ Order ${orderId} deleted successfully:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error deleting order ${orderId}:`, error.message);
    throw error;
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Check API health
 */
async function checkAPIHealth() {
  try {
    console.log('🔄 Checking API health...');
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✓ API is healthy:', result);
    return true;
  } catch (error) {
    console.error('❌ API health check failed:', error.message);
    return false;
  }
}

/**
 * Format price for display
 */
function formatPrice(price) {
  return `KES ${price.toLocaleString('en-US')}`;
}

/**
 * Format date for display
 */
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
