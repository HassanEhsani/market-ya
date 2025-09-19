import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import ProductList from './pages/ProductList';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import Header from './components/Header'; // هدر جداگانه
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [textAlignClass, setTextAlignClass] = useState('align-left');

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    alert(`✅ "${product.name}" ${t('addToCart')}`);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const align = i18n.language === 'fa' || i18n.language === 'ar' ? 'align-right' : 'align-left';
    setTextAlignClass(align);
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <div className={`layout ${textAlignClass}`}>
        <Header /> {/* هدر جدید جایگزین شده */}

        <main className="site-main">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to={loggedIn ? "/products" : "/login"} />} />
              <Route path="/login" element={<LoginRegister onLogin={() => setLoggedIn(true)} />} />
              <Route path="/products" element={loggedIn ? <ProductList onAddToCart={handleAddToCart} /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/cart" element={loggedIn ? <Cart /> : <Navigate to="/login" />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </div>
        </main>

        <footer className="site-footer">
          <p>© 2025 Yandex Market Clone</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
