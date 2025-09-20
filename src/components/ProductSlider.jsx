import Slider from 'react-slick';
import { useEffect, useState } from 'react';
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
    rtl: true // حرکت از راست به چپ
  };

  return (
    <div className="product-slider">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="slider-item">
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>{product.price.toLocaleString()} ₽</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}
