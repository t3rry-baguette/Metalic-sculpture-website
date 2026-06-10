# Jua Kali Sculptures - Backend System

A complete full-stack backend system for managing products and orders for a Jua Kali (metalwork) sculptures e-commerce website.

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ installed
- npm (comes with Node.js)

### Installation

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the system:**
   - Admin Dashboard: http://localhost:3000/
   - Order Form: http://localhost:3000/order-form.html
   - API Health Check: http://localhost:3000/api/health

## 📁 Project Structure

```
backend/
├── package.json                 # Project dependencies
├── server.js                    # Main Express server
├── database.js                  # SQLite database setup
├── sculptures.db               # SQLite database file (auto-created)
└── public/
    ├── admin.html              # Admin dashboard
    ├── admin.js                # Admin dashboard logic
    └── order-form.html         # Example frontend order form
```

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerName TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Products

#### GET /api/products
Retrieve all products

**Response:**
```json
[
  {
    "id": 1,
    "name": "Lion Sculpture",
    "description": "Handcrafted metal lion",
    "price": 25000,
    "image": "/images/lion.svg",
    "createdAt": "2024-06-09T10:00:00Z"
  }
]
```

#### GET /api/products/:id
Retrieve a single product

**Response:**
```json
{
  "id": 1,
  "name": "Lion Sculpture",
  "description": "Handcrafted metal lion",
  "price": 25000,
  "image": "/images/lion.svg",
  "createdAt": "2024-06-09T10:00:00Z"
}
```

#### POST /api/products
Create a new product

**Request Body:**
```json
{
  "name": "Custom Zebra",
  "description": "Hand-welded zebra sculpture",
  "price": 32000,
  "image": "/images/zebra.svg"
}
```

**Response:**
```json
{
  "id": 6,
  "name": "Custom Zebra",
  "description": "Hand-welded zebra sculpture",
  "price": 32000,
  "image": "/images/zebra.svg"
}
```

#### PUT /api/products/:id
Update a product

**Request Body:**
```json
{
  "name": "Updated Lion",
  "price": 26000
}
```

#### DELETE /api/products/:id
Delete a product

### Orders

#### GET /api/orders
Retrieve all orders

**Response:**
```json
[
  {
    "id": 1,
    "customerName": "John Doe",
    "phone": "+254712345678",
    "product": "Lion Sculpture",
    "message": "Make it extra large",
    "status": "pending",
    "createdAt": "2024-06-09T10:30:00Z"
  }
]
```

#### GET /api/orders/:id
Retrieve a single order

#### POST /api/orders
Create a new order

**Request Body:**
```json
{
  "customerName": "John Doe",
  "phone": "+254712345678",
  "product": "Lion Sculpture",
  "message": "Please add custom finish"
}
```

**Response:**
```json
{
  "id": 1,
  "customerName": "John Doe",
  "phone": "+254712345678",
  "product": "Lion Sculpture",
  "message": "Please add custom finish",
  "status": "pending",
  "createdAt": "2024-06-09T10:30:00Z"
}
```

#### PUT /api/orders/:id
Update order status

**Request Body:**
```json
{
  "status": "completed"
}
```

Valid statuses: `pending`, `completed`, `cancelled`

#### DELETE /api/orders/:id
Delete an order

### Utility Endpoints

#### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "message": "Jua Kali Sculptures API is running"
}
```

#### GET /api/stats
Get database statistics

**Response:**
```json
{
  "products": 5,
  "orders": 12,
  "timestamp": "2024-06-09T10:30:00Z"
}
```

## 💻 Using cURL for Testing

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phone": "+254712345678",
    "product": "Lion Sculpture",
    "message": "Make it extra large"
  }'
```

### Get All Orders
```bash
curl http://localhost:3000/api/orders
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Giraffe",
    "description": "Tall elegant giraffe",
    "price": 28000,
    "image": "/images/giraffe.svg"
  }'
```

### Get All Products
```bash
curl http://localhost:3000/api/products
```

## 🖥️ Admin Dashboard Features

The admin dashboard at `http://localhost:3000/` provides:

- **📊 Statistics Dashboard**
  - Total orders count
  - Pending orders count
  - Completed orders count
  - Total products count

- **📦 Orders Tab**
  - View all orders in card layout
  - Search by customer name or phone
  - Filter by status (pending/completed/cancelled)
  - Mark orders as complete
  - Cancel orders
  - Delete orders
  - Auto-refresh every 30 seconds

- **🎨 Products Tab**
  - View all available products
  - Edit product details
  - Delete products

- **🔌 API Documentation Tab**
  - Complete API endpoint reference
  - Example requests and responses

## 📝 Example Frontend Integration

To integrate the order form in your main website:

```html
<!-- Contact form section -->
<form id="contactForm">
  <input type="text" id="customerName" placeholder="Your Name" required>
  <input type="tel" id="phone" placeholder="Your Phone" required>
  <select id="product" required>
    <option value="">Select Product</option>
    <option value="Lion Sculpture">Lion Sculpture</option>
    <option value="Elephant Sculpture">Elephant Sculpture</option>
  </select>
  <textarea id="message" placeholder="Message"></textarea>
  <button type="submit">Place Order</button>
</form>

<script>
  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: document.getElementById('customerName').value,
        phone: document.getElementById('phone').value,
        product: document.getElementById('product').value,
        message: document.getElementById('message').value
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      alert(`Order #${data.id} placed successfully!`);
    } else {
      alert(`Error: ${data.error}`);
    }
  });
</script>
```

## 🔐 Security Notes

- **CORS enabled** for frontend requests
- **Input validation** on all endpoints
- **SQL injection protection** using parameterized queries
- **Status validation** for order updates
- For production, consider:
  - Adding authentication (JWT tokens)
  - Rate limiting
  - Input sanitization
  - HTTPS/SSL
  - Database backups

## 🚀 Expanding the System

### Add Product Categories
```sql
ALTER TABLE products ADD COLUMN category TEXT;
```

### Add Order Tracking
```sql
ALTER TABLE orders ADD COLUMN updatedAt DATETIME;
ALTER TABLE orders ADD COLUMN notes TEXT;
```

### Add Customer Management
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Add Payment Integration
- Stripe
- PayPal
- M-Pesa (for Kenyan market)

### Add Email Notifications
```javascript
const nodemailer = require('nodemailer');
// Send confirmation emails on order placement
```

### Add Image Upload
```javascript
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
```

## 📊 Monitoring

Monitor active connections and database size:

```bash
# Check database file size
ls -lh backend/sculptures.db

# Monitor server logs for errors
npm run dev
```

## 🐛 Troubleshooting

### Port already in use
If port 3000 is already used, modify in `server.js`:
```javascript
const PORT = 3001; // Change to different port
```

### Database locked error
SQLite can have concurrency issues. For high-traffic scenarios, consider migrating to PostgreSQL or MySQL.

### CORS errors in frontend
Ensure CORS middleware is loaded before routes:
```javascript
app.use(cors());
```

## 📄 License

MIT License

## 👨‍💼 Support

For questions or issues with the backend system, check:
1. The API documentation in the admin dashboard
2. Server console logs for error messages
3. The example order form for frontend integration patterns

---

**Last Updated:** June 2024
**Version:** 1.0.0
