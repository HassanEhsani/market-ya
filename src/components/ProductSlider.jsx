import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './ProductSlider.css';

export default function ProductSlider() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    rtl: true
  };

  return (
    <div className="product-slider">
      {products.length > 0 ? (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="slider-item">
              {product.image ? (
                <img src={product.image} alt={product.name} className="slider-image" />
              ) : (
                <div className="slider-image-placeholder">بدون عکس</div>
              )}
              <h4>{product.name || 'محصول ناشناس'}</h4>
              <p>{product.price ? product.price.toLocaleString() : '---'} ₽</p>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="slider-loading">در حال بارگذاری محصولات...</p>
      )}
    </div>
  );
}
