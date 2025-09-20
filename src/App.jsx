import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import ProductList from './pages/ProductList';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ManageSlider from './pages/ManageSlider';
import ManageProducts from './pages/ManageProducts';
import ManageCategories from './pages/ManageCategories';



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
      .then((res) => res.json())
      .then((data) => {
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };

  const handleAddToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    alert(`✅ "${product.name}" ${t('addToCart')}`);
  };

  return (
    <BrowserRouter>
      <div className={`layout ${textAlignClass}`}>
        <Header
          loggedIn={loggedIn}
          handleLogout={handleLogout}
          // changeLanguage={changeLanguage}
          // currentLanguage={i18n.language}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />

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
              <Route path="/admin/slider" element={<ManageSlider />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/categories" element={<ManageCategories />} />

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
