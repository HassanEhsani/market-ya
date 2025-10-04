const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 4000;
const SECRET = 'yandex-secret-key';

app.use(cors());
app.use(express.json());

/* 🛒 سبد خرید */
app.get('/carts', (req, res) => {
  const { userId } = req.query;
  const cart = db.prepare('SELECT * FROM carts WHERE userId = ?').get(userId);
  res.json(cart ? [cart] : []);
});

app.post('/carts', (req, res) => {
  const { userId, items } = req.body;
  db.prepare('INSERT INTO carts (userId, items) VALUES (?, ?)').run(userId, JSON.stringify(items));
  res.json({ success: true });
});

app.patch('/carts/:id', (req, res) => {
  const { id } = req.params;
  const { items } = req.body;
  db.prepare('UPDATE carts SET items = ? WHERE id = ?').run(JSON.stringify(items), id);
  res.json({ success: true });
});

/* ❤️ علاقه‌مندی‌ها */
app.get('/favorites', (req, res) => {
  const { userId } = req.query;
  const fav = db.prepare('SELECT * FROM favorites WHERE userId = ?').get(userId);
  res.json(fav ? [fav] : []);
});

app.post('/favorites', (req, res) => {
  const { userId, items } = req.body;
  db.prepare('INSERT INTO favorites (userId, items) VALUES (?, ?)').run(userId, JSON.stringify(items));
  res.json({ success: true });
});

app.patch('/favorites/:id', (req, res) => {
  const { id } = req.params;
  const { items } = req.body;
  db.prepare('UPDATE favorites SET items = ? WHERE id = ?').run(JSON.stringify(items), id);
  res.json({ success: true });
});

/* 📦 محصولات */
app.get('/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

app.post('/products', (req, res) => {
  const { name, price, image, category } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'نام و قیمت الزامی هستند' });

  db.prepare(`
    INSERT INTO products (name, price, image, category)
    VALUES (?, ?, ?, ?)
  `).run(name, price, image, category);
  res.json({ success: true });
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, image, category } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'نام و قیمت الزامی هستند' });

  db.prepare(`
    UPDATE products
    SET name = ?, price = ?, image = ?, category = ?
    WHERE id = ?
  `).run(name, price, image, category, id);
  res.json({ success: true });
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ success: true });
});

/* 🎯 دسته‌بندی‌ها */
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'نام دسته‌بندی الزامی است' });

  db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
  res.json({ success: true });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  res.json({ success: true });
});

/* 🎞️ اسلایدر */
app.get('/slider', (req, res) => {
  const slides = db.prepare('SELECT * FROM slider').all();
  res.json(slides);
});

app.post('/slider', (req, res) => {
  const { image, end } = req.body;
  if (!image || !end) return res.status(400).json({ error: 'تصویر و تاریخ پایان الزامی هستند' });

  db.prepare('INSERT INTO slider (image, end) VALUES (?, ?)').run(image, end);
  res.json({ success: true });
});

/* 👤 کاربران */
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) return res.status(400).json({ error: 'نام کاربری قبلاً ثبت شده' });

  const hashed = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed);
  res.json({ success: true });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(400).json({ error: 'کاربر یافت نشد' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'رمز عبور اشتباه است' });

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

/* 🚀 اجرای سرور */
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
