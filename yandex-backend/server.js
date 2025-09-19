const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 3001;
const SECRET = 'yandex-secret-key';

app.use(cors());
app.use(express.json());

// ✅ دریافت لیست محصولات
app.get('/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// ✅ افزودن محصول
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  db.prepare('INSERT INTO products (name, price) VALUES (?, ?)').run(name, price);
  res.json({ success: true });
});

// ✅ ویرایش محصول
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  db.prepare('UPDATE products SET name = ?, price = ? WHERE id = ?').run(name, price, id);
  res.json({ success: true });
});

// ✅ حذف محصول
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ success: true });
});

// ✅ ثبت‌نام کاربر
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) return res.status(400).json({ error: 'نام کاربری قبلاً ثبت شده' });

  const hashed = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed);
  res.json({ success: true });
});

// ✅ ورود کاربر
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(400).json({ error: 'کاربر یافت نشد' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'رمز عبور اشتباه است' });

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// ✅ اجرای سرور
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
