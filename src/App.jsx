import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import ProductList from './pages/ProductList';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
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
        <header className="site-header">
          <h1>{t('title')}</h1>

          {loggedIn && (
            <nav>
              <Link to="/products">{t('products')}</Link> |{' '}
              <Link to="/dashboard">{t('dashboard')}</Link> |{' '}
              <Link to="/cart">{t('cart')}</Link> |{' '}
              <button onClick={handleLogout}>{t('logout')}</button>
            </nav>
          )}

          <div className="lang-buttons">
            <button onClick={() => changeLanguage('ru')}>RU</button>
            <button onClick={() => changeLanguage('en')}>EN</button>
            <button onClick={() => changeLanguage('fa')}>FA</button>
            <button onClick={() => changeLanguage('tg')}>TG</button>
          </div>
        </header>

        <main className="site-main">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to={loggedIn ? "/products" : "/login"} />} />
              <Route path="/login" element={<LoginRegister onLogin={() => setLoggedIn(true)} />} />
              <Route path="/products" element={loggedIn ? <ProductList onAddToCart={handleAddToCart} /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/cart" element={loggedIn ? <Cart /> : <Navigate to="/login" />} />
              <Route path="/admin" element={<AdminPanel />} />
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
