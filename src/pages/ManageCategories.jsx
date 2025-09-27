import { useState, useEffect } from 'react';
import './ManageCategories.css';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  // بارگذاری لیست دسته‌ها
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('http://localhost:4000/categories');
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('❌ خطا در دریافت دسته‌ها:', err);
    }
  }

  // افزودن دسته جدید
  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      const res = await fetch('http://localhost:4000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed })
      });
      if (!res.ok) throw new Error('Save failed');
      await res.json();
      setName('');
      fetchCategories();
    } catch (err) {
      console.error('❌ خطا در افزودن دسته:', err);
    }
  }

  // حذف دسته
  async function handleDelete(id) {
    if (!window.confirm('آیا از حذف این دسته اطمینان دارید؟')) return;

    try {
      const res = await fetch(`http://localhost:4000/categories/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchCategories();
    } catch (err) {
      console.error('❌ خطا در حذف دسته:', err);
    }
  }

  return (
    <div className="manage-categories" style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      <h2>📂 مدیریت دسته‌بندی‌ها</h2>

      <form
        onSubmit={handleAdd}
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
      >
        <input
          type="text"
          placeholder="نام دسته‌بندی"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit">➕ افزودن</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(cat => (
          <li
            key={cat.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
              color: '#333',
              backgroundColor: '#f9f9f9'
            }}
          >
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              style={{
                padding: '0.2rem 0.6rem',
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
