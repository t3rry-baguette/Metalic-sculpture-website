# 🚀 Quick Start - Jua Kali Backend

## Installation (2 minutes)

### Windows
1. Open Command Prompt in the `backend` folder
2. Double-click `setup.bat` OR run:
   ```
   npm install
   ```

### Mac/Linux
1. Open Terminal in the `backend` folder
2. Run:
   ```
   bash setup.sh
   ```
   OR manually:
   ```
   npm install
   ```

## Start Server (1 minute)

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║  Jua Kali Sculptures Backend Server        ║
║  Listening on http://localhost:3000        ║
║  Admin Dashboard: http://localhost:3000/   ║
╚════════════════════════════════════════════╝
```

## Access the System

| Purpose | URL |
|---------|-----|
| 👤 Admin Dashboard | http://localhost:3000/ |
| 📋 Example Order Form | http://localhost:3000/order-form.html |
| ✅ Health Check | http://localhost:3000/api/health |

## Admin Dashboard Features

### Orders Tab
- 📊 See all customer orders in real-time
- 🔍 Search by name or phone
- 🏷️ Filter by status (Pending, Completed, Cancelled)
- ✅ Mark orders as Complete
- ❌ Cancel or Delete orders
- 🔄 Auto-refreshes every 30 seconds

### Products Tab
- 📦 View all available sculptures
- 🎨 Edit or delete products
- ➕ Add new products via API

### API Docs Tab
- 📖 Complete API reference
- 🔌 Endpoint examples
- 💡 Code samples

## How It Works

### Frontend Places Order
```javascript
// Your website's contact form
fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'John Doe',
    phone: '+254712345678',
    product: 'Lion Sculpture',
    message: 'Custom finish'
  })
})
.then(res => res.json())
.then(order => console.log('Order #' + order.id + ' placed!'));
```

### Admin Sees Order Immediately
Order appears in admin dashboard → Admin clicks "Mark Complete" → Order status updated in database

## File Structure

```
backend/
├── server.js              ← Main Express server (handles all API requests)
├── database.js            ← SQLite setup (creates tables automatically)
├── package.json           ← Dependencies (express, sqlite3, cors)
├── sculptures.db          ← Database file (auto-created)
├── public/
│   ├── admin.html         ← Admin dashboard (open in browser)
│   ├── admin.js           ← Dashboard logic (order management)
│   └── order-form.html    ← Example order form (test frontend)
├── README.md              ← Full documentation
├── API_REFERENCE.md       ← Quick API reference
├── setup.bat              ← Windows setup script
└── setup.sh               ← Mac/Linux setup script
```

## Sample Data

**5 Default Products:**
- Lion Sculpture - KES 25,000
- Elephant Sculpture - KES 35,000
- Giraffe Sculpture - KES 22,000
- Rhino Sculpture - KES 28,000
- Bird Sculpture - KES 12,000

These are automatically added on first run.

## 3 Main API Routes

### 1. Products (`/api/products`)
```
GET    /api/products         ← Get all sculptures
POST   /api/products         ← Add new sculpture
PUT    /api/products/:id     ← Update sculpture
DELETE /api/products/:id     ← Remove sculpture
```

### 2. Orders (`/api/orders`)
```
GET    /api/orders           ← Get all orders (admin)
POST   /api/orders           ← Place new order (frontend)
PUT    /api/orders/:id       ← Update order status
DELETE /api/orders/:id       ← Delete order
```

### 3. Utility (`/api/...`)
```
GET    /api/health           ← Server status
GET    /api/stats            ← Database statistics
```

## Test with Example Form

1. Go to: http://localhost:3000/order-form.html
2. Fill in customer details
3. Click "Place Order"
4. Check Admin Dashboard (http://localhost:3000/) → See new order
5. Click "Mark Complete" to update status

## Database

- **Type:** SQLite (embedded database)
- **File:** `backend/sculptures.db`
- **Auto-creation:** Yes ✓
- **Sample data:** Yes ✓
- **Backup:** Copy `sculptures.db` file

## Troubleshooting

### "Port already in use"
```bash
# Use different port - edit server.js:
const PORT = 3001;  // Change from 3000 to 3001
```

### "Cannot find module"
```bash
npm install
```

### "Database is locked"
Restart server (Ctrl+C, then npm start)

### Server not starting
1. Check Node.js is installed: `node --version`
2. Check port 3000 is free
3. Check file permissions
4. Try: `npm install` again

## Development Mode

Auto-reload when you edit files:
```bash
npm run dev
```

## Next Steps

1. ✅ Test with example order form
2. 📝 Integrate API into your website
3. 🎨 Add more sculptures via admin dashboard
4. 🔐 Add password protection (add auth.js)
5. 📧 Add email notifications (add mailer.js)
6. 💳 Add payment integration (Stripe/M-Pesa)

## Database Backup

```bash
# Copy database
cp backend/sculptures.db backend/sculptures.db.backup

# Or on Windows
copy backend\sculptures.db backend\sculptures.db.backup
```

## Useful Commands

```bash
npm start              # Start server
npm run dev           # Start with auto-reload
npm install           # Install dependencies
ls backend/           # View files (Mac/Linux)
dir backend\          # View files (Windows)
```

## Support Resources

- **Full Docs:** `backend/README.md`
- **API Reference:** `backend/API_REFERENCE.md`
- **Admin Dashboard:** Built-in help at `/api` tab
- **Example Code:** `backend/public/order-form.html`

---

**You now have a complete backend system!** 🎉

Integrate the API into your main website and start accepting orders.
