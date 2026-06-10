# Jua Kali Sculptures - API Quick Reference

## Server Details
- **URL:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/
- **Health Check:** http://localhost:3000/api/health

---

## PRODUCTS API

### Get All Products
```
GET /api/products
```

### Get Single Product
```
GET /api/products/:id
```

### Create Product
```
POST /api/products
Content-Type: application/json

{
  "name": "Lion Sculpture",
  "description": "Handcrafted metal lion",
  "price": 25000,
  "image": "/images/lion.svg"
}
```

### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 30000
}
```

### Delete Product
```
DELETE /api/products/:id
```

---

## ORDERS API

### Get All Orders
```
GET /api/orders
```

### Get Single Order
```
GET /api/orders/:id
```

### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "phone": "+254712345678",
  "product": "Lion Sculpture",
  "message": "Optional special requests"
}
```

### Update Order Status
```
PUT /api/orders/:id
Content-Type: application/json

{
  "status": "completed"
}
```

Valid statuses: `pending`, `completed`, `cancelled`

### Delete Order
```
DELETE /api/orders/:id
```

---

## UTILITY API

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Jua Kali Sculptures API is running"
}
```

### Database Stats
```
GET /api/stats
```

Response:
```json
{
  "products": 5,
  "orders": 12,
  "timestamp": "2024-06-09T10:30:00Z"
}
```

---

## EXAMPLE JavaScript Frontend Code

### Place an Order
```javascript
async function placeOrder() {
  const response = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerName: 'John Doe',
      phone: '+254712345678',
      product: 'Lion Sculpture',
      message: 'Make it 2 meters tall'
    })
  });

  const order = await response.json();
  console.log('Order placed:', order);
}
```

### Get All Products
```javascript
async function getProducts() {
  const response = await fetch('http://localhost:3000/api/products');
  const products = await response.json();
  console.log('Products:', products);
  return products;
}
```

### Update Order Status
```javascript
async function completeOrder(orderId) {
  const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'completed'
    })
  });

  const result = await response.json();
  console.log('Updated:', result);
}
```

---

## CURL Examples

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Smith",
    "phone": "+254701234567",
    "product": "Elephant Sculpture",
    "message": "Standard finish"
  }'
```

### Get Orders
```bash
curl http://localhost:3000/api/orders
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zebra Sculpture",
    "description": "Striped metal zebra",
    "price": 30000,
    "image": "/images/zebra.svg"
  }'
```

---

## Common HTTP Status Codes

- **200** - Success
- **201** - Created (POST successful)
- **400** - Bad request (validation error)
- **404** - Not found (resource doesn't exist)
- **500** - Server error

---

## Database

**File:** `backend/sculptures.db` (SQLite)

**Tables:**
- `products` - Product catalog
- `orders` - Customer orders

**Auto-populated:** Yes, sample products are added on first run

---

## Support

For issues, check:
1. Server console for error messages
2. Browser console for client-side errors
3. README.md for detailed documentation
4. Admin dashboard for API documentation tab
