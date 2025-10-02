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
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/slider')
      .then(res => res.json())
      .then(setSliderItems);
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
      const rawItems = favorites.items;
      const parsedItems = Array.isArray(rawItems) ? rawItems : JSON.parse(rawItems || '[]');

      const alreadyExists = parsedItems.find(item => item.productId === product.id);
      if (alreadyExists) return alert('✅ قبلاً در علاقه‌مندی‌ها بوده');

      const updatedItems = [...parsedItems, { productId: product.id }];

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

        <h2>{t('productList')}</h2>
        {filteredProducts.length === 0 ? (
          <p>{t('noProductsFound')}</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">بدون عکس</div>
                )}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description || 'بدون توضیحات'}</p>
                  <p className="product-price">{product.price.toLocaleString()} ₽</p>
                  <div className="product-actions">
                    <button className="favorite-btn" onClick={() => handleAddToFavorites(product)}>❤️</button>
                    <button className="cart-btn" onClick={() => handleAddToCart(product)}>🛒</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
