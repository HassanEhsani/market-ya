import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Cart.css';

export default function Cart() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const userId = localStorage.getItem('userId');

  // دریافت محصولات برای match کردن با productId
  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // دریافت سبد خرید از سرور
  useEffect(() => {
    fetch(`http://localhost:4000/carts?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setCartItems(data[0].items);
        }
      });
  }, [userId]);

  // حذف آیتم از سبد خرید در سرور
  const handleRemove = (productId) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);

    fetch(`http://localhost:4000/carts?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const cartId = data[0].id;
          fetch(`http://localhost:4000/carts/${cartId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updatedItems })
          });
        }
      });
  };

  return (
    <div className="cart-page">
      <h2>🛒 {t('cart')}</h2>
      {cartItems.length === 0 ? (
        <p>{t('cartEmpty')}</p>
      ) : (
        cartItems.map((item, index) => {
          const product = products.find(p => p.id === item.productId);
          return (
            <div key={index} className="cart-item">
              <h3>{product?.name || 'محصول ناشناس'}</h3>
              <p>💰 {t('price')}: {product?.price?.toLocaleString() || '---'} تومان</p>
              <p>📦 تعداد: {item.quantity}</p>
              {product?.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-image"
                />
              )}
              <button onClick={() => handleRemove(item.productId)}>❌ {t('remove')}</button>
            </div>
          );
        })
      )}
    </div>
  );
}
