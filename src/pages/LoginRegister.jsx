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
    document.documentElement.dir = ['fa', 'ar'].includes(i18n.language) ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        // ثبت‌نام: اضافه کردن کاربر جدید
        const res = await fetch('http://localhost:4000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) throw new Error('❌ ثبت‌نام ناموفق بود');
        alert(t('registerSuccess'));
        setIsRegister(false);
      } else {
        // ورود: بررسی وجود کاربر با GET
        const res = await fetch(`http://localhost:4000/users?username=${username}&password=${password}`);

        if (!res.ok) throw new Error(`❌ خطا در ارتباط با سرور: ${res.status}`);

        const users = await res.json();

        if (!Array.isArray(users)) throw new Error('❌ پاسخ سرور معتبر نیست');
        if (users.length === 0) throw new Error('❌ نام کاربری یا رمز عبور اشتباه است');

        const user = users[0];
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('userId', user.id);
        onLogin();
        navigate('/products');

        // بررسی یا ساخت سبد خرید
        const cartRes = await fetch(`http://localhost:4000/carts?userId=${user.id}`);
        if (!cartRes.ok) throw new Error('❌ خطا در دریافت سبد خرید');

        const cart = await cartRes.json();

        if (Array.isArray(cart) && cart.length === 0) {
          await fetch('http://localhost:4000/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, items: [] }),
          });
        }
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
