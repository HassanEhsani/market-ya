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

  const handleAddToCart = (product) => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const updatedCart = [...cart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`✅ "${product.name}" ${t('addToCart')}`);
  };

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
    <div className="home-container">
      <header className="home-header">
        <h1>{t('marketTitle')}</h1>
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
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
        className="search-input"
      />

      <h2>{t('categories')}</h2>
      <div className="category-buttons">
        <button
          onClick={() => setSelectedCategory('')}
          className={selectedCategory === '' ? 'active-category' : ''}
        >
          {t('all')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'active-category' : ''}
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
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>💰 {t('price')}: {product.price.toLocaleString()}</p>
            {product.image && (
              <img src={product.image} alt={product.name} />
            )}
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product)}
            >
              {t('addToCart')}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
