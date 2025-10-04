import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LoginRegister.css';

export default function LoginRegister({ onLogin }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'fa' || i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isRegister ? 'register' : 'login';
      const res = await fetch(`http://localhost:4000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || '❌ خطا در ارتباط با سرور');

      if (isRegister) {
        alert(t('registerSuccess'));
        setIsRegister(false);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        onLogin();
        navigate('/products');

        // دریافت یا ساخت سبد خرید بعد از ورود موفق
        fetch(`http://localhost:4000/carts?userId=${data.userId}`)
          .then(res => res.json())
          .then(cart => {
            if (cart.length === 0) {
              fetch('http://localhost:4000/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: data.userId, items: [] })
              });
            }
          });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page">
      <h2>{isRegister ? t('register') : t('login')}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder={t('username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? t('register') : t('login')}</button>
      </form>
      <button className="toggle-btn" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? t('goToLogin') : t('goToRegister')}
      </button>
    </div>
  );
}
