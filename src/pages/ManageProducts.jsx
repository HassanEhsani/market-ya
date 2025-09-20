import { useEffect, useState } from 'react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('خطا در دریافت محصولات', err));
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <h2>🛠 مدیریت محصولات</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          >
            <h4>{product.name}</h4>
            <p>💰 قیمت: {product.price.toLocaleString()} تومان</p>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '6px',
                  marginTop: '0.5rem',
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
