import { useEffect, useState } from 'react';
import './ManageSlider.css';

export default function ManageSlider() {
  const [products, setProducts] = useState([]);
  const [sliderItems, setSliderItems] = useState([]);
  const [form, setForm] = useState({
    productId: '',
    image: '',
    start: '',
    end: ''
  });

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => setProducts(data));

    fetch('http://localhost:4000/slider')
      .then(res => res.json())
      .then(data => setSliderItems(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSlider = () => {
    if (!form.productId || !form.image || !form.start || !form.end) {
      alert('لطفاً همه فیلدها را پر کنید');
      return;
    }

    fetch('http://localhost:4000/slider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id: Date.now().toString() })
    }).then(() => {
      alert('✅ اسلاید اضافه شد');
      setForm({ productId: '', image: '', start: '', end: '' });
      window.location.reload();
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/slider/${id}`, {
      method: 'DELETE'
    }).then(() => {
      alert('❌ اسلاید حذف شد');
      window.location.reload();
    });
  };

  const now = new Date();

  const activeSlides = sliderItems.filter(slide => new Date(slide.end) > now);
  const expiredSlides = sliderItems.filter(slide => new Date(slide.end) <= now);

  return (
    <div className="slider-admin">
      <h2>🎛 مدیریت اسلایدر</h2>
      <p>📏 سایز تصویر اسلایدر باید <strong>1200x400px</strong> باشد (حداکثر حجم <strong>300KB</strong>)</p>

      <div className="slider-form">
        <select name="productId" value={form.productId} onChange={handleChange}>
          <option value="">انتخاب محصول</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="image"
          placeholder="لینک تصویر اسلایدر"
          value={form.image}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="start"
          value={form.start}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="end"
          value={form.end}
          onChange={handleChange}
        />

        <button onClick={handleAddSlider}>➕ افزودن اسلاید</button>
      </div>

      <h3>🟢 اسلایدهای فعال</h3>
      <ul>
        {activeSlides.map(slide => (
          <li key={slide.id}>
            محصول: {products.find(p => p.id === slide.productId)?.name || 'نامشخص'} | پایان: {new Date(slide.end).toLocaleString()}
            <button onClick={() => handleDelete(slide.id)}>🗑 حذف</button>
          </li>
        ))}
      </ul>

      <h3>🔴 اسلایدهای منقضی‌شده</h3>
      <ul>
        {expiredSlides.map(slide => (
          <li key={slide.id}>
            محصول: {products.find(p => p.id === slide.productId)?.name || 'نامشخص'} | پایان: {new Date(slide.end).toLocaleString()}
            <button onClick={() => handleDelete(slide.id)}>🗑 حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
