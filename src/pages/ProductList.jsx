import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export default function ProductList({ onAddToCart }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category')?.trim();

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('خطا در دریافت محصولات:', err));
  }, []);

  const handleSaveToDashboard = product => {
    fetch('http://localhost:4000/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then(res => {
        if (!res.ok) throw new Error('خطا در ذخیره‌سازی');
        return res.json();
      })
      .then(() => {
        alert(`✅ "${product.name}" با موفقیت در داشبورد ذخیره شد`);
      })
      .catch(err => {
        console.error('❌ خطا:', err);
        alert('❌ ذخیره‌سازی ناموفق بود');
      });
  };

  const filteredProducts = category
    ? products.filter(p => p.category?.trim() === category)
    : products;

  return (
    <div className="product-list">
      <h2>🛍 {t('products')}</h2>
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={product.image || 'https://via.placeholder.com/200x150?text=No+Image'}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>💰 {t('price')}: {product.price.toLocaleString()} ₽</p>
            <button onClick={() => onAddToCart(product)}>
              ➕ {t('addToCart')}
            </button>
            <button onClick={() => handleSaveToDashboard(product)}>
              📌 {t('dashboard')}
            </button>
          </div>
        ))}
      </div>
    </div>
);
}
