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
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(t('fetchError'), err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/slider')
      .then((res) => res.json())
      .then((data) => setSliderItems(data))
      .catch((err) => console.error('خطا در دریافت اسلایدها', err));
  }, []);

  const now = new Date();
  const activeSlides = sliderItems.filter(slide => new Date(slide.end) > now);

  const handleAddToCart = (product) => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const updatedCart = [...cart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`✅ "${product.name}" ${t('addToCart')}`);
  };

  const filteredProducts = products.filter((product) => {
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
  centerPadding: '25%', // فضای کناری برای پیش‌نمایش
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: false,
  rtl: i18n.language === 'fa' || i18n.language === 'ar'
};





  return (
    <>
      {/* اسلایدر تبلیغاتی تمام‌عرض */}
      <div className="slider-wrapper">
        <Slider {...sliderSettings}>
          {activeSlides.map((slide) => (
            <div key={slide.id} className="slider-item">
              <img src={slide.image} alt="اسلاید تبلیغاتی" />
            </div>
          ))}
        </Slider>
      </div>

      {/* محتوای اصلی داخل کانتینر محدود */}
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
    </>
  );
}
