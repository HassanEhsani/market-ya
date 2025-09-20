import { useEffect, useState } from 'react';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('خطا در دریافت دسته‌بندی‌ها', err));
  }, []);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const newItem = { id: Date.now().toString(), name: newCategory };

    fetch('http://localhost:4000/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
      .then(() => {
        setCategories([...categories, newItem]);
        setNewCategory('');
      })
      .catch((err) => console.error('خطا در افزودن دسته‌بندی', err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/categories/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setCategories(categories.filter((cat) => cat.id !== id));
      })
      .catch((err) => console.error('خطا در حذف دسته‌بندی', err));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>📂 مدیریت دسته‌بندی‌ها</h2>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="نام دسته‌بندی جدید"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
        />
        <button
          onClick={handleAddCategory}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0077cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ➕ افزودن دسته‌بندی
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{
              backgroundColor: '#f9f9f9',
              padding: '0.5rem 1rem',
              marginBottom: '0.5rem',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              style={{
                backgroundColor: '#cc0000',
                color: 'white',
                border: 'none',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ❌ حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
