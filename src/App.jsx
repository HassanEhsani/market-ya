import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import ManageSlider from './pages/ManageSlider';
import ManageProducts from './pages/ManageProducts';
import ManageCategories from './pages/ManageCategories';
import Favorites from './pages/Favorites';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(false);
  const [textAlignClass, setTextAlignClass] = useState('align-left');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const align = i18n.language === 'fa' || i18n.language === 'ar' ? 'align-right' : 'align-left';
    setTextAlignClass(align);
  }, [i18n.language]);

  useEffect(() => {
  fetch('http://localhost:4000/products')
    .then(res => res.json())
    .then(data => {
      // ۱. ببین rawCategories چی پر می‌شه
      const rawCategories = [...new Set(data.map(p => p.category))];
      console.log('🔍 rawCategories from server:', rawCategories);

      // ۲. اگر دسته‌ها توی سرور به انگلیسی هستن، باید customOrder هم انگلیسی باشه
      //      یا برای تست مستقیم از rawCategories استفاده کن
      // const sorted = rawCategories;
      const customOrder = ['electronics', 'clothing', 'food'];
      const sorted = customOrder.filter(cat => rawCategories.includes(cat));
      console.log('🔍 sorted categories to show:', sorted);

      setCategories(sorted);
    })
    .catch(err => console.error('خطا در دریافت دسته‌بندی‌ها:', err));
}, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const handleAddToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    alert(`✅ "${product.name}" ${t('addToCart')}`);
  };

  const handleSearch = () => {
    console.log('🔍 جستجو شد:', searchTerm);
  };

  return (
    <div className={`layout ${textAlignClass}`}>
      <Header
        loggedIn={loggedIn}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        onSearch={handleSearch}
      />

      <main className="site-main">
        {location.pathname === '/home' ? (
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        ) : (
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to={loggedIn ? "/products" : "/login"} />} />
              <Route path="/login" element={<LoginRegister onLogin={() => setLoggedIn(true)} />} />
              <Route path="/products" element={<ProductList onAddToCart={handleAddToCart} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/slider" element={<ManageSlider />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <p>© 2025 Yandex Market Clone</p>
      </footer>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
