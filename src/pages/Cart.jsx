import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Cart.css'; // اگه نداری بسازش

export default function Cart() {
  const { t } = useTranslation();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const handleRemove = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <div className="cart-page">
      <h2>🛒 {t('cart')}</h2>
      {cart.length === 0 ? (
        <p>{t('cartEmpty')}</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} className="cart-item">
            <h3>{item.name}</h3>
            <p>💰 {t('price')}: {item.price.toLocaleString()} تومان</p>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="cart-image"
              />
            )}
            <button onClick={() => handleRemove(index)}>❌ {t('remove')}</button>
          </div>
        ))
      )}
    </div>
  );
}
