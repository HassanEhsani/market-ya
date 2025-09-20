import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:4000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(t('fetchError'), err));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      price: parseInt(price),
      image,
    };

    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:4000/products/${editId}`
      : 'http://localhost:4000/products';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error(t('saveError'));
        return res.json();
      })
      .then(() => {
        alert(
          `${t('product')} "${name}" ${editId ? t('updated') : t('added')} ${t('successfully')}`
        );
        setName('');
        setPrice('');
        setImage('');
        setPreview('');
        setEditId(null);
        fetchProducts();
      })
      .catch((err) => {
        console.error(t('saveError'), err);
        alert(t('operationFailed'));
      });
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
    setPreview(product.image);
    setEditId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm(t('confirmDelete'))) return;

    fetch(`http://localhost:4000/products/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error(t('deleteError'));
        alert(t('productDeleted'));
        fetchProducts();
      })
      .catch((err) => {
        console.error(t('deleteError'), err);
        alert(t('deleteFailed'));
      });
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>🎛 {t('adminPanel')}</h2>

      {/* لینک‌های مدیریت */}
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
        <li><Link to="/admin/products">🛠 مدیریت محصولات</Link></li>
        <li><Link to="/admin/slider">🎞 مدیریت اسلایدر</Link></li>
        <li><Link to="/admin/categories">📂 مدیریت دسته‌بندی‌ها</Link></li>
      </ul>

      {/* فرم افزودن یا ویرایش محصول */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('productName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <input
          type="number"
          placeholder={t('price')}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <label style={{ fontSize: '0.9rem', color: '#555' }}>
          📷 {t('uploadImageHint')}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginBottom: '1rem' }}
        />
        {preview && (
          <img
            src={preview}
            alt={t('imagePreview')}
            style={{
              width: '200px',
              height: 'auto',
              marginBottom: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
        )}
        <button
          type="submit"
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#0077cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {editId ? t('saveChanges') : t('addProduct')}
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      {/* لیست محصولات */}
      <h3>📦 {t('productList')}</h3>

      <input
        type="text"
        placeholder={t('searchProduct')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '2rem' }}
      >
        <option value="asc">{t('sortAsc')}</option>
        <option value="desc">{t('sortDesc')}</option>
      </select>

      {filteredProducts.map((product) => (
        <div
          key={product.id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={product.image || 'https://via.placeholder.com/40x40?text=No+Image'}
              alt={product.name}
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
            <div>
              <h4 style={{ margin: 0 }}>{product.name}</h4>
              <p style={{ margin: '4px 0' }}>
                💰 {t('price')}: {product.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => handleEdit(product)}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: '#ffaa00',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ✏️ {t('edit')}
            </button>
            <button
              onClick={() => handleDelete(product.id)}              >
                ❌ {t('delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
  );
}
