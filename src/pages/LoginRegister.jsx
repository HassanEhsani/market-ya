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
      const res = await fetch('http://localhost:4000/users');
      if (!res.ok) throw new Error('❌ مسیر کاربران یافت نشد');

      const users = await res.json();

      if (isRegister) {
        const exists = users.find((u) => u.username === username);
        if (exists) throw new Error('❌ نام کاربری قبلاً ثبت شده');

        await fetch('http://localhost:4000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        alert(t('registerSuccess'));
        setIsRegister(false);
      } else {
        const user = users.find((u) => u.username === username && u.password === password);
        if (!user) throw new Error('❌ نام کاربری یا رمز عبور اشتباه است');

        localStorage.setItem('token', user.id);
        localStorage.setItem('userId', user.id);
        onLogin();
        navigate('/products');

        // دریافت یا ساخت سبد خرید بعد از ورود موفق
        fetch(`http://localhost:4000/carts?userId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.length === 0) {
              fetch('http://localhost:4000/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  items: []
                })
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
