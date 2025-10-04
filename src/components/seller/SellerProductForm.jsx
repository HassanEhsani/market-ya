import React, { useState, useEffect } from 'react';
import './SellerProductForm.css';

export default function SellerProductForm() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageFile: null,
    imagePreview: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:5174/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('خطا در دریافت دسته‌بندی‌ها:', err));
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!product.name.trim()) newErrors.name = 'نام محصول الزامی است';
    if (!product.price.trim()) newErrors.price = 'قیمت الزامی است';
    if (!product.description.trim()) newErrors.description = 'توضیحات الزامی است';
    if (!product.category) newErrors.category = 'دسته‌بندی الزامی است';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const saved = localStorage.getItem('sellerProducts');
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [...existing, product];
    localStorage.setItem('sellerProducts', JSON.stringify(updated));

    console.log('محصول ثبت شد:', product);
    setErrors({});
    setSuccessMessage('✅ محصول با موفقیت ذخیره شد!');
    setProduct({
      name: '',
      price: '',
      description: '',
      imageFile: null,
      imagePreview: '',
      category: '',
    });
  };

  return (
    <form className="seller-form" onSubmit={handleSubmit}>
      <h2>افزودن محصول توسط فروشنده</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <input
        name="name"
        placeholder="نام محصول"
        value={product.name}
        onChange={handleChange}
      />
      {errors.name && <div className="error-message">{errors.name}</div>}

      <input
        name="price"
        placeholder="قیمت"
        value={product.price}
        onChange={handleChange}
      />
      {errors.price && <div className="error-message">{errors.price}</div>}

      <textarea
        name="description"
        placeholder="توضیحات"
        value={product.description}
        onChange={handleChange}
      />
      {errors.description && <div className="error-message">{errors.description}</div>}

      {categories.length === 0 ? (
        <div className="error-message">هیچ دسته‌بندی‌ای توسط ادمین ثبت نشده!</div>
      ) : (
        <>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>

          {errors.category && <div className="error-message">{errors.category}</div>}
        </>
      )}

      <input type="file" accept="image/*" onChange={handleImageChange} />
      {product.imagePreview && (
        <img
          src={product.imagePreview}
          alt="پیش‌نمایش محصول"
          style={{ width: '150px', marginTop: '1rem', borderRadius: '6px' }}
        />
      )}

      <button type="submit">ثبت محصول</button>
    </form>
  );
}
