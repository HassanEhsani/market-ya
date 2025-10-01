import React, { useState, useEffect } from 'react';
import './SellerProductList.css';


export default function SellerProductList() {
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});


  useEffect(() => {
    const saved = localStorage.getItem('sellerProducts');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
    localStorage.setItem('sellerProducts', JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedProduct(products[index]);
  };

  const handleUpdate = () => {
    const updated = [...products];
    updated[editingIndex] = editedProduct;
    setProducts(updated);
    localStorage.setItem('sellerProducts', JSON.stringify(updated));
    setEditingIndex(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProduct({
        ...editedProduct,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };


  return (
    <div className="seller-product-list">
      <h2>محصولات ثبت‌شده</h2>
      {products.length === 0 ? (
        <p>هنوز محصولی ثبت نشده.</p>
      ) : (
        <ul>
          {products.map((item, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <div>
                  <input
                    value={editedProduct.name}
                    onChange={(e) =>
                      setEditedProduct({ ...editedProduct, name: e.target.value })
                    }
                  />
                  <input
                    value={editedProduct.price}
                    onChange={(e) =>
                      setEditedProduct({ ...editedProduct, price: e.target.value })
                    }
                  />
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {editedProduct.imagePreview && (
                    <img src={editedProduct.imagePreview} alt="پیش‌نمایش" width="100" />
                  )}
                  <button className="save-btn" onClick={handleUpdate}>ذخیره تغییرات</button>
                </div>
              ) : (
                <div>
                  <strong>{item.name}</strong> - {item.price} تومان
                  <br />
                  <img src={item.imagePreview} alt={item.name} width="100" />
                  <br />
                  <button className="edit-btn" onClick={() => handleEdit(index)}>ویرایش</button>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>حذف</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
