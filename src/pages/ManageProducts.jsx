import { useState, useEffect } from 'react';

export default function ManageProducts() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);

  // گرفتن دسته‌ها از سرور
  useEffect(() => {
    fetch('http://localhost:4000/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('❌ خطا در دریافت دسته‌ها:', err));
  }, []);

  // تغییر مقادیر فرم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ارسال محصول جدید
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { ...form, price: Number(form.price) };

    try {
      const res = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('خطا در ذخیره محصول');
      await res.json();
      alert('✅ محصول با موفقیت اضافه شد');
      setForm({ name: '', price: '', image: '', category: '' });
    } catch (err) {
      console.error(err);
      alert('❌ خطا در افزودن محصول');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}
    >
      <input
        type="text"
        name="name"
        placeholder="نام محصول"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="قیمت"
        value={form.price}
        onChange={handleChange}
        required
      />

      {/* ✅ کشوی دسته‌بندی */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">-- انتخاب دسته‌بندی --</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat.name || cat}>
            {cat.name || cat}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="image"
        placeholder="آدرس تصویر"
        value={form.image}
        onChange={handleChange}
      />

      <button type="submit">➕ افزودن محصول</button>
    </form>
  );
}
