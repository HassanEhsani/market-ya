import React, { useEffect, useState } from 'react';

export default function ProductMarketplace() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sellerProducts');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="product-marketplace">
      <h1>محصولات موجود برای فروش</h1>
      {products.length === 0 ? (
        <p>هنوز محصولی ثبت نشده.</p>
      ) : (
        <div className="product-grid">
          {products.map((item, index) => (
            <div key={index} className="product-card">
              <img src={item.imagePreview} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>{item.price} تومان</strong>
              <div className="product-actions">
                <button title="افزودن به علاقه‌مندی‌ها">❤️</button>
                <button title="افزودن به سبد خرید">🛒</button>
              </div>
              <span className="product-category">دسته‌بندی: {item.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
