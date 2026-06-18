const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to database file
const dbPath = path.join(__dirname, 'sculptures.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✓ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Create products table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating products table:', err.message);
    } else {
      console.log('✓ Products table ready');
      // Add sample products if table is empty
      checkAndAddSampleProducts();
    }
  });

  // Create orders table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      product TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      customizations TEXT,
      totalPrice INTEGER,
      email TEXT,
      deliveryLocation TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating orders table:', err.message);
    } else {
      console.log('✓ Orders table ready');
      // Run migration to add new columns to existing databases
      runOrdersMigration();
    }
  });
}

// Add sample products if none exist
function checkAndAddSampleProducts() {
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking products:', err.message);
      return;
    }

    if (row.count === 0) {
      const sampleProducts = [
        {
          name: 'Lion Sculpture',
          description: 'Handcrafted metal lion statue, perfect for outdoor displays',
          price: 25000,
          image: '/images/lion.svg'
        },
        {
          name: 'Elephant Sculpture',
          description: 'Majestic elephant figure, ideal for hotel lobbies',
          price: 35000,
          image: '/images/elephant.svg'
        },
        {
          name: 'Giraffe Sculpture',
          description: 'Elegant tall giraffe sculpture for modern spaces',
          price: 22000,
          image: '/images/giraffe.svg'
        },
        {
          name: 'Rhino Sculpture',
          description: 'Strong and powerful rhino statue',
          price: 28000,
          image: '/images/rhino.svg'
        },
        {
          name: 'Bird Sculpture',
          description: 'Lightweight metal bird, great for indoor/outdoor',
          price: 12000,
          image: '/images/bird.svg'
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO products (name, description, price, image)
        VALUES (?, ?, ?, ?)
      `);

      sampleProducts.forEach((product) => {
        stmt.run(product.name, product.description, product.price, product.image);
      });

      stmt.finalize(() => {
        console.log('✓ Sample products added');
      });
    }
  });
}

// Add new columns to existing orders table (safe migration)
function runOrdersMigration() {
  const newCols = [
    'customizations TEXT',
    'totalPrice INTEGER',
    'email TEXT',
    'deliveryLocation TEXT'
  ];
  newCols.forEach(col => {
    db.run(`ALTER TABLE orders ADD COLUMN ${col}`, (err) => {
      // Silently ignore "duplicate column name" — means column already exists
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Migration error (${col}):`, err.message);
      }
    });
  });
}

module.exports = db;

