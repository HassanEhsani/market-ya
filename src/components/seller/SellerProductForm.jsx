import React, { useState } from 'react';
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

  const [successMessage, setSuccessMessage] = useState('');

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

    if (!product.category) {
      alert('لطفاً دسته‌بندی محصول را انتخاب کن!');
      return;
    }

    const saved = localStorage.getItem('sellerProducts');
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [...existing, product];
    localStorage.setItem('sellerProducts', JSON.stringify(updated));
    console.log('محصول ثبت شد:', product);

    // پیام موفقیت
    setSuccessMessage('✅ محصول با موفقیت ذخیره شد!');

    // ریست فرم
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
      <input
        name="price"
        placeholder="قیمت"
        value={product.price}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="توضیحات"
        value={product.description}
        onChange={handleChange}
      />

      <select
        name="category"
        value={product.category}
        onChange={handleChange}
      >
        <option value="">انتخاب دسته‌بندی</option>
        <option value="لوازم جانبی">لوازم جانبی</option>
        <option value="الکترونیک">الکترونیک</option>
        <option value="کتاب">کتاب</option>
      </select>

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
