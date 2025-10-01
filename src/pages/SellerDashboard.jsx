import React from 'react';
import SellerProductForm from '../components/seller/SellerProductForm';
import SellerProductList from '../components/seller/SellerProductList';
import './SellerDashboard.css'; // اختیاری برای استایل صفحه

export default function SellerDashboard() {
  return (
    <div className="seller-dashboard">
      <h1>داشبورد فروشنده</h1>
      <p>در این بخش می‌تونی محصولات خودت رو برای فروش ثبت کنی.</p>

      {/* فرم ثبت محصول */}
      <SellerProductForm />

      {/* لیست محصولات ثبت‌شده */}
      <SellerProductList />
    </div>
  );
}
