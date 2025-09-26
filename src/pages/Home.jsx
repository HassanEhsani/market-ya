import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import './Home.css';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [sliderItems, setSliderItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error(t('fetchError'), err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/slider')
      .then(res => res.json())
      .then(setSliderItems)
      .catch(err => console.error('خطا در دریافت اسلایدها', err));
  }, []);

  const now = new Date();
  const activeSlides = sliderItems.filter(slide => new Date(slide.end) > now);

  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('❌ لطفاً ابتدا وارد حساب شوید');

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
      items = data[0].items;
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

  const handleAddToFavorites = async (product) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('❌ لطفاً ابتدا وارد حساب شوید');

    const res = await fetch(`http://localhost:4000/favorites?userId=${userId}`);
    const data = await res.json();

    if (data.length === 0) {
      await fetch('http://localhost:4000/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: [{ productId: product.id }]
        })
      });
    } else {
      const favorites = data[0];
      const alreadyExists = favorites.items.find(item => item.productId === product.id);
      if (alreadyExists) return alert('✅ قبلاً در علاقه‌مندی‌ها بوده');

      const updatedItems = [...favorites.items, { productId: product.id }];
      await fetch(`http://localhost:4000/favorites/${favorites.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });
    }

    alert(`✅ "${product.name}" به علاقه‌مندی‌ها اضافه شد`);
  };

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    return nameMatch && categoryMatch;
  });

  const categories = ['electronics', 'clothing', 'food'];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '20%',
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    rtl: i18n.language === 'fa' || i18n.language === 'ar'
  };

  return (
    <>
      <div className="slider-wrapper">
        <Slider {...sliderSettings}>
          {activeSlides.map(slide => (
            <div key={slide.id} className="slider-item">
              <img src={slide.image} alt="اسلاید تبلیغاتی" />
            </div>
          ))}
        </Slider>
      </div>

      <div className="home-container">
        <header className="home-header">
          <h1>{t('marketTitle')}</h1>
        </header>

        <h2>{t('categories')}</h2>
        <div className="category-buttons">
          <button
            onClick={() => setSelectedCategory('')}
            className={selectedCategory === '' ? 'active-category' : ''}
          >
            {t('all')}
          </button>
          {categories.map(cat => (
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
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <div className="product-actions">
                  <button className="favorite-btn" onClick={() => handleAddToFavorites(product)}>❤️</button>
                  <button className="cart-btn" onClick={() => handleAddToCart(product)}>🛒</button>
                </div>
                <h3>{product.name}</h3>
                <p> {t('price')}: {product.price.toLocaleString()} تومان</p>
                {product.image && (
                  <img src={product.image} alt={product.name} className="product-image" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
