import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Cart.css'; // 👈 اگه نداری بسازش

export default function Cart() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  const handleRemove = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <div className="cart-page">
      <h2>🛒 {t('cart')}</h2>
      {cartItems.length === 0 ? (
        <p>{t('cartEmpty')}</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <span>{item.name} - {item.price.toLocaleString()} تومان</span>
            <button onClick={() => handleRemove(index)}>❌ {t('remove')}</button>
          </div>
        ))
      )}
    </div>
  );
}
