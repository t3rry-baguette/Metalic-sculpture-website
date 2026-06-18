require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_everson_gallery_key_2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MosesSculpturesAdmin2026!';

// Hash initial administrator password
const hashedAdminPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

// Create public/uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ============================================
// MULTER SETUP FOR FILE UPLOADS
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'sculpture-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.'));
    }
  }
});

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(uploadDir));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ error: 'Malformed token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// ============================================
// AUTHENTICATION API ENDPOINTS
// ============================================

/**
 * POST /api/login
 * Admin login route
 */
pp.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, message: 'Authentication successful' });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
});

// ============================================
// PRODUCTS API ENDPOINTS
// ============================================

/**
 * GET /api/products
 * Return all products from database (Public)
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
 * Return a single product by ID (Public)
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
 * Add new product to database (Protected)
 */
app.post('/api/products', authenticateAdmin, (req, res) => {
  const { name, description, price, image } = req.body;

  // Validation
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  db.run(
    'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
    [name, description || null, price, image || null],
    function (err) {
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
 * Update product details (Protected)
 */
app.put('/api/products/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
    [name, description, price, image, id],
    function (err) {
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
 * Delete a product (Protected)
 */
app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
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
// UPLOAD API ENDPOINT
// ============================================

/**
 * POST /api/upload
 * Upload product image (Protected)
 */
app.post('/api/upload', authenticateAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl: fileUrl, message: 'Image uploaded successfully' });
  });
});

// ============================================
// ORDERS API ENDPOINTS
// ============================================

/**
 * GET /api/orders
 * Return all orders (Protected - admin use)
 */
app.get('/api/orders', authenticateAdmin, (req, res) => {
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
 * Return a single order by ID (Protected)
 */
app.get('/api/orders/:id', authenticateAdmin, (req, res) => {
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
 * Create a new order from frontend (Public)
 */
app.post('/api/orders', (req, res) => {
  const { customerName, phone, product, message, customizations, totalPrice, email, deliveryLocation } = req.body;

  // Validation
  if (!customerName || !phone || !product) {
    return res.status(400).json({
      error: 'Customer name, phone, and product are required'
    });
  }

  const customizationsStr = customizations ? JSON.stringify(customizations) : null;

  db.run(
    `INSERT INTO orders 
      (customerName, phone, product, message, status, customizations, totalPrice, email, deliveryLocation) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [customerName, phone, product, message || '', 'pending', customizationsStr, totalPrice || null, email || null, deliveryLocation || null],
    function (err) {
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
        customizations,
        totalPrice,
        email,
        deliveryLocation,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }
  );
});

/**
 * PUT /api/orders/:id
 * Update order status (Protected - admin use)
 */
app.put('/api/orders/:id', authenticateAdmin, (req, res) => {
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
    function (err) {
      if (err) {
        console.error('Error updating order:', err.message);
        return res.status(500).json({ error: 'Failed to update order' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Order status updated successfully', status });
    }
  );
});

/**
 * DELETE /api/orders/:id
 * Delete an order (Protected)
 */
app.delete('/api/orders/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM orders WHERE id = ?', [id], function (err) {
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
 * Health check endpoint (Public)
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jua Kali Sculptures API is running' });
});

/**
 * GET /api/stats
 * Get database statistics (Protected)
 */
app.get('/api/stats', authenticateAdmin, (req, res) => {
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
