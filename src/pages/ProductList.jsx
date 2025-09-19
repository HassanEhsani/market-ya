import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProductList({ onAddToCart }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('خطا در دریافت محصولات:', err));
  }, []);

  const handleSaveToDashboard = (product) => {
    fetch('http://localhost:4000/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('خطا در ذخیره‌سازی');
        }
        return res.json();
      })
      .then(() => {
        alert(`✅ "${product.name}" با موفقیت در داشبورد ذخیره شد`);
      })
      .catch((err) => {
        console.error('❌ خطا:', err);
        alert('❌ ذخیره‌سازی ناموفق بود');
      });
  };

  return (
    <div>
      <h2>🛍 {t('products')}</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '200px',
              borderRadius: '6px',
              backgroundColor: '#fff',
              textAlign: 'center',
            }}
          >
            <img
              src={product.image || 'https://via.placeholder.com/200x150?text=No+Image'}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '150px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '0.5rem',
              }}
            />
            <p style={{ fontSize: '0.85rem', color: '#444', fontWeight: 'bold' }}>
              📷 لطفاً عکس محصول را آپلود کنید<br />
              <span style={{ fontSize: '0.75rem', color: '#666' }}>
                (سایز پیشنهادی: 200×150 پیکسل)
              </span>
            </p>
            <h3>{product.name}</h3>
            <p>💰 {t('price')}: {product.price.toLocaleString()} ₽</p>
            <button onClick={() => onAddToCart(product)}>➕ {t('addToCart')}</button>
            <button onClick={() => handleSaveToDashboard(product)}>📌 {t('dashboard')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
