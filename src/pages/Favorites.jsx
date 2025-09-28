import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Favorites.css';

export default function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const userId = localStorage.getItem('userId');

  // دریافت محصولات
  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // دریافت علاقه‌مندی‌ها
  useEffect(() => {
    fetch(`http://localhost:4000/favorites?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setFavorites(data[0].items);
        }
      });
  }, [userId]);

  // افزودن به سبد خرید
  const handleAddToCart = (product) => {
    fetch(`http://localhost:4000/carts?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        const cart = data[0];
        const existingItem = cart.items.find(item => item.productId === product.id);

        const updatedItems = existingItem
          ? cart.items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...cart.items, { productId: product.id, quantity: 1 }];

        fetch(`http://localhost:4000/carts/${cart.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedItems })
        }).then(() => {
          alert(`✅ "${product.name}" ${t('addToCart')}`);
        });
      });
  };

  // حذف از علاقه‌مندی‌ها
  async function handleRemove(productId) {
    try {
      const updatedItems = favorites.filter(item => item.productId !== productId);

      const res = await fetch(`http://localhost:4000/favorites/8725`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });

      if (!res.ok) throw new Error('خطا در حذف');
      const data = await res.json();
      setFavorites(data.items);
    } catch (err) {
      console.error('❌ حذف ناموفق:', err);
    }
  }

  return (
    <div className="favorites-page">
      <h2>❤️ {t('favorites')}</h2>
      {favorites.length === 0 ? (
        <p>{t('favoritesEmpty')}</p>
      ) : (
        favorites.map((item, index) => {
          const product = products.find(p => p.id === item.productId);
          return (
            <div key={index} className="favorite-item">
              <h3>{product?.name || 'محصول ناشناس'}</h3>
              <p>💰 {t('price')}: {product?.price?.toLocaleString() || '---'} تومان</p>
              {product?.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="favorite-image"
                />
              )}
              <div className="favorite-actions">
                <button onClick={() => handleAddToCart(product)}>🛒 {t('addToCart')}</button>
                <button onClick={() => handleRemove(product.id)}>❌ {t('remove')}</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
