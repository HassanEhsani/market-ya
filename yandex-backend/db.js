const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'yandex.db');
const db = new Database(dbPath);

// محصولات
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
    category TEXT
  )
`).run();

// سبد خرید
db.prepare(`
  CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    items TEXT NOT NULL
  )
`).run();

// علاقه‌مندی‌ها
db.prepare(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    items TEXT NOT NULL
  )
`).run();

// اسلایدر
db.prepare(`
  CREATE TABLE IF NOT EXISTS slider (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT,
    end TEXT
  )
`).run();

// کاربران
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  )
`).run();

// دسته‌بندی‌ها
db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

module.exports = db;
