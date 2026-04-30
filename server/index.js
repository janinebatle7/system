const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'kakanin_secret_key';

// MySQL Connection (Using mock for now, but configured for real MySQL)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kakanin_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    // In a production environment, we would handle this better
    return;
  }
  console.log('Connected to MySQL Database');
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
});

// --- PRODUCT ROUTES ---

app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- ORDER ROUTES ---

app.post('/api/orders', authenticateToken, (req, res) => {
  const { total_amount, items } = req.body;
  const userId = req.user.id;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)', [userId, total_amount], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      const orderId = result.insertId;
      const orderItems = items.map(item => [orderId, item.id, item.quantity, item.price]);

      db.query('INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ?', [orderItems], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          res.json({ message: 'Order placed successfully', orderId });
        });
      });
    });
  });
});

// --- RESERVATION ROUTES ---

app.post('/api/reservations', authenticateToken, (req, res) => {
  const { reservation_date, reservation_time, pax, special_requests } = req.body;
  const userId = req.user.id;

  const query = 'INSERT INTO reservations (user_id, reservation_date, reservation_time, pax, special_requests) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [userId, reservation_date, reservation_time, pax, special_requests], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Reservation created successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
