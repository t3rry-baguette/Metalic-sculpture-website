const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// PRODUCTS API ENDPOINTS
// ============================================

/**
 * GET /api/products
 * Return all products from database
 */
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(rows);
  });
});

/**
 * GET /api/products/:id
 * Return a single product by ID
 */
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching product:', err.message);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

/**
 * POST /api/products
 * Add new product to database
 */
app.post('/api/products', (req, res) => {
  const { name, description, price, image } = req.body;

  // Validation
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  db.run(
    'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
    [name, description || null, price, image || null],
    function(err) {
      if (err) {
        console.error('Error inserting product:', err.message);
        return res.status(500).json({ error: 'Failed to create product' });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        description,
        price,
        image
      });
    }
  );
});

/**
 * PUT /api/products/:id
 * Update product details
 */
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
    [name, description, price, image, id],
    function(err) {
      if (err) {
        console.error('Error updating product:', err.message);
        return res.status(500).json({ error: 'Failed to update product' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

/**
 * DELETE /api/products/:id
 * Delete a product
 */
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting product:', err.message);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// ============================================
// ORDERS API ENDPOINTS
// ============================================

/**
 * GET /api/orders
 * Return all orders (admin use)
 */
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching orders:', err.message);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    res.json(rows);
  });
});

/**
 * GET /api/orders/:id
 * Return a single order by ID
 */
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching order:', err.message);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(row);
  });
});

/**
 * POST /api/orders
 * Create a new order from frontend
 */
app.post('/api/orders', (req, res) => {
  const { customerName, phone, product, message } = req.body;

  // Validation
  if (!customerName || !phone || !product) {
    return res.status(400).json({ 
      error: 'Customer name, phone, and product are required' 
    });
  }

  db.run(
    'INSERT INTO orders (customerName, phone, product, message, status) VALUES (?, ?, ?, ?, ?)',
    [customerName, phone, product, message || '', 'pending'],
    function(err) {
      if (err) {
        console.error('Error inserting order:', err.message);
        return res.status(500).json({ error: 'Failed to create order' });
      }
      res.status(201).json({
        id: this.lastID,
        customerName,
        phone,
        product,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }
  );
});

/**
 * PUT /api/orders/:id
 * Update order status (pending/completed)
 */
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validation
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (!['pending', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be pending, completed, or cancelled' 
    });
  }

  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        console.error('Error updating order:', err.message);
        return res.status(500).json({ error: 'Failed to update order' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order status updated successfully', status });
    }
  );
});

/**
 * DELETE /api/orders/:id
 * Delete an order
 */
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting order:', err.message);
      return res.status(500).json({ error: 'Failed to delete order' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  });
});

// ============================================
// HEALTH CHECK & INFO
// ============================================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jua Kali Sculptures API is running' });
});

/**
 * GET /api/stats
 * Get database statistics
 */
app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as productCount FROM products', (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
    db.get('SELECT COUNT(*) as orderCount FROM orders', (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }
      res.json({
        products: products.productCount,
        orders: orders.orderCount,
        timestamp: new Date().toISOString()
      });
    });
  });
});

// ============================================
// ROOT ROUTE
// ============================================

/**
 * GET /
 * Serve admin dashboard
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Jua Kali Sculptures Backend Server        ║
║  Listening on http://localhost:${PORT}     ║
║  Admin Dashboard: http://localhost:${PORT}/ ║
║  API Docs: http://localhost:${PORT}/api     ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
