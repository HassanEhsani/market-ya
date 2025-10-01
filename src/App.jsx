import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import LoginRegister from './pages/LoginRegister';
import ProductList from './pages/ProductList';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import ManageSlider from './pages/ManageSlider';
import ManageProducts from './pages/ManageProducts';
import ManageCategories from './pages/ManageCategories';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Header from './components/Header';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import SellerDashboard from './pages/SellerDashboard';
import ProductMarketplace from './pages/ProductMarketplace';

function App() {
  const { t, i18n } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [textAlignClass, setTextAlignClass] = useState('align-left');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // بررسی وضعیت ورود
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  // تنظیم جهت متن بر اساس زبان
  useEffect(() => {
    const align = ['fa', 'ar'].includes(i18n.language) ? 'align-right' : 'align-left';
    setTextAlignClass(align);
  }, [i18n.language]);

  // خواندن محصولات و استخراج دسته‌ها
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:4000/products');
        const data = await res.json();
        const rawCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(rawCategories);
      } catch (err) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const handleAddToCart = product => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    alert(`✅ "${product.name}" ${t('addToCart')}`);
  };

  const handleSearch = () => {
    console.log('🔍 جستجو شد:', searchTerm);
    // اینجا می‌توانید navigate یا اعمال فیلتر واقعی کنید
  };

  const location = useLocation();

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
              <Route path="/" element={<Navigate to={loggedIn ? '/products' : '/login'} />} />
              <Route path="/login" element={<LoginRegister onLogin={() => setLoggedIn(true)} />} />
              <Route
                path="/products"
                element={loggedIn
                  ? <ProductList onAddToCart={handleAddToCart} />
                  : <Navigate to="/login" />
                }
              />
              <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/cart" element={loggedIn ? <Cart /> : <Navigate to="/login" />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/slider" element={<ManageSlider />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/market" element={<ProductMarketplace />} />
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
