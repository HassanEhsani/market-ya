import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Favorites.css'; // اگه نداری بسازش

export default function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const userId = localStorage.getItem('userId');

  // دریافت محصولات برای match کردن با productId
  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // دریافت علاقه‌مندی‌ها از سرور
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

        let updatedItems;
        if (existingItem) {
          updatedItems = cart.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [...cart.items, { productId: product.id, quantity: 1 }];
        }

        fetch(`http://localhost:4000/carts/${cart.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedItems })
        }).then(() => {
          alert(`✅ "${product.name}" ${t('addToCart')}`);
        });
      });
  };

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
              <button onClick={() => handleAddToCart(product)}>🛒 {t('addToCart')}</button>
            </div>
          );
        })
      )}
    </div>
  );
}
