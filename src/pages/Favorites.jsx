import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Favorites.css';

export default function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [favoritesId, setFavoritesId] = useState(null);
  const userId = localStorage.getItem('userId');

  // دریافت محصولات
  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  // دریافت علاقه‌مندی‌ها
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:4000/favorites?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const rawItems = data[0].items;
          const parsedItems = Array.isArray(rawItems)
            ? rawItems
            : JSON.parse(rawItems || '[]');

          setFavorites(parsedItems);
          setFavoritesId(data[0].id); // ذخیره آیدی علاقه‌مندی‌ها
        }
      });
  }, [userId]);

  // افزودن به سبد خرید
  const handleAddToCart = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return alert('❌ محصول یافت نشد');

    const res = await fetch(`http://localhost:4000/carts?userId=${userId}`);
    const data = await res.json();

    let cartId;
    let items = [];

    if (data.length === 0) {
      await fetch('http://localhost:4000/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: [] })
      });

      const newRes = await fetch(`http://localhost:4000/carts?userId=${userId}`);
      const newData = await newRes.json();
      cartId = newData[0].id;
    } else {
      cartId = data[0].id;
      const rawItems = data[0].items;
      items = Array.isArray(rawItems) ? rawItems : JSON.parse(rawItems || '[]');
    }

    const existingItem = items.find(item => item.productId === product.id);
    const updatedItems = existingItem
      ? items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...items, { productId: product.id, quantity: 1 }];

    await fetch(`http://localhost:4000/carts/${cartId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updatedItems })
    });

    alert(`✅ "${product.name}" ${t('addToCart')}`);
  };

  // حذف از علاقه‌مندی‌ها با انیمیشن
  async function handleRemove(productId) {
    const confirm = window.confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟');
    if (!confirm || !favoritesId) return;

    setRemovingId(productId);

    setTimeout(async () => {
      try {
        const updatedItems = favorites.filter(item => item.productId !== productId);

        await fetch(`http://localhost:4000/favorites/${favoritesId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedItems })
        });

        setFavorites(updatedItems);
        setRemovingId(null);
      } catch (err) {
        console.error('❌ حذف ناموفق:', err);
        setRemovingId(null);
      }
    }, 400);
  }

  return (
    <div className="favorites-page">
      <h2>❤️ {t('favorites')}</h2>
      {favorites.length === 0 ? (
        <p>{t('favoritesEmpty')}</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item, index) => {
            const product = products.find(p => p.id === item.productId);
            return (
              <div key={index} className={`favorite-item ${removingId === product?.id ? 'removing' : ''}`}>
                <img src={product?.image} alt={product?.name} className="favorite-image" />
                <h3>{product?.name || 'محصول ناشناس'}</h3>
                <p>💰 {t('price')}: {product?.price?.toLocaleString()} ₽</p>
                <div className="favorite-actions">
                  <button onClick={() => handleAddToCart(item.productId)}>🛒 {t('addToCart')}</button>
                  <button onClick={() => handleRemove(product.id)}>❌ {t('Del')}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
