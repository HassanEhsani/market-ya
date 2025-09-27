import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    preview: '',
    category: ''
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // دریافت محصولات و دسته‌ها
  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('http://localhost:4000/products'),
          fetch('http://localhost:4000/categories')
        ]);
        if (!prodRes.ok || !catRes.ok) throw new Error();
        const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error(t('fetchError'), err);
      }
    }
    fetchData();
  }, [t]);
  useEffect(() => {
  async function loadCategories() {
    try {
      const res = await fetch('http://localhost:4000/categories');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('❌ خطا در دریافت دسته‌ها:', err);
    }
  }
  loadCategories();
}, []);

  // تغییر مقادیر فرم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // بارگذاری و پیش‌نمایش تصویر
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({
        ...prev,
        image: reader.result,
        preview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // ذخیره (افزودن یا ویرایش) محصول
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      image: form.image,
      category: form.category
    };

    try {
      const url = editId
        ? `http://localhost:4000/products/${editId}`
        : 'http://localhost:4000/products';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(t('saveError'));
      await res.json();

      alert(
        `${t('product')} "${payload.name}" ${
          editId ? t('updated') : t('added')
        } ${t('successfully')}`
      );
      // ریست فرم و ریفرش لیست
      setForm({ name: '', price: '', image: '', preview: '', category: '' });
      setEditId(null);
      const fresh = await fetch('http://localhost:4000/products').then(r => r.json());
      setProducts(fresh);
    } catch (err) {
      console.error(t('saveError'), err);
      alert(t('operationFailed'));
    }
  };

  // پر کردن فرم برای ویرایش
  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: String(p.price),
      image: p.image,
      preview: p.image,
      category: p.category || ''
    });
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // حذف محصول
  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      const res = await fetch(`http://localhost:4000/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(t('deleteError'));
      alert(t('productDeleted'));
      const fresh = await fetch('http://localhost:4000/products').then(r => r.json());
      setProducts(fresh);
    } catch (err) {
      console.error(t('deleteError'), err);
      alert(t('deleteFailed'));
    }
  };

  // فیلتر و مرتب‌سازی
  const filtered = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));

  return (
    <div className="admin-panel" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h2>🎛 {t('adminPanel')}</h2>

      <nav style={{ margin: '1rem 0' }}>
        <Link to="/admin" style={{ marginRight: '1rem' }}>
          🛠 {t('manageProducts')}
        </Link>
        <Link to="/admin/slider" style={{ marginRight: '1rem' }}>
          🎞 {t('manageSlider')}
        </Link>
        {/* <Link to="/admin/categories">
          📂 {t('manageCategories')}
        </Link> */}
        <Link to="/admin/categories">📂 {t('manageCategories')}</Link>
      </nav>

      <section style={{ marginBottom: '2rem' }}>
        <h3>{editId ? t('editProduct') : t('addProduct')}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            name="name"
            type="text"
            placeholder={t('productName')}
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder={t('price')}
            value={form.price}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name || cat}>
                {cat.name || cat}
              </option>
            ))}
          </select>
          <label>{t('uploadImageHint')}</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.preview && (
            <img
              src={form.preview}
              alt={t('imagePreview')}
              style={{ width: 200, borderRadius: 6, border: '1px solid #ccc' }}
            />
          )}
          <button type="submit">
            {editId ? t('saveChanges') : t('addProduct')}
          </button>
        </form>
      </section>

      <hr />

      <section>
        <h3>📦 {t('productList')}</h3>
        <input
          type="text"
          placeholder={t('searchProduct')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '2rem' }}
        >
          <option value="asc">{t('sortAsc')}</option>
          <option value="desc">{t('sortDesc')}</option>
        </select>

        {filtered.map(p => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              marginBottom: '1rem',
              background: '#f9f9f9',
              borderRadius: 6
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={p.image || 'https://via.placeholder.com/40'}
                alt={p.name}
                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
              />
              <div>
                <h4 style={{ margin: 0 }}>{p.name}</h4>
                <p style={{ margin: 0 }}>
                  💰 {t('price')}: {p.price.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleEdit(p)}>✏️ {t('edit')}</button>
              <button onClick={() => handleDelete(p.id)}>❌ {t('delete')}</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
