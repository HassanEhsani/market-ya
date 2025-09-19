import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(t('fetchError'), err));
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch = selectedCategory
        ? product.category === selectedCategory
        : true;
      return nameMatch && categoryMatch;
    });

  const categories = ['electronics', 'clothing', 'food'];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{t('marketTitle')}</h1>
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{ padding: '0.5rem', marginTop: '1rem' }}
        >
          <option value="fa">فارسی</option>
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="tg">Тоҷикӣ</option>
        </select>
      </header>

      <input
        type="text"
        placeholder={t('searchProduct')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '2rem' }}
      />

      <h2>{t('categories')}</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: selectedCategory === '' ? '#0077cc' : '#eee',
            color: selectedCategory === '' ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {t('all')}
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === cat ? '#0077cc' : '#eee',
              color: selectedCategory === cat ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      <h2>{t('productList')}</h2>
      {filteredProducts.length === 0 ? (
        <p>{t('noProductsFound')}</p>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3>{product.name}</h3>
            <p>
              💰 {t('price')}: {product.price.toLocaleString()}
            </p>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '150px', borderRadius: '6px' }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
