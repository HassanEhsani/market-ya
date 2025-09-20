import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({
  loggedIn,
  handleLogout,
  changeLanguage,
  currentLanguage,
  searchTerm,
  setSearchTerm,
  categories,
  showDropdown,
  setShowDropdown
}) {
  const { t } = useTranslation();

  return (
    <header className="ym-header">
      <div className="ym-header-top">
        {/* لوگو سمت چپ */}
        <div className="ym-logo">
          <Link to="/home">
            <img src="/logo.png" alt="Yandex Market Clone" />
          </Link>
        </div>

        {/* نوار جستجو وسط */}
        <div className="ym-center">
          <div className="ym-category-dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)}>
              📂 {t('categories')}
            </button>
            {showDropdown && (
              <ul className="ym-dropdown-list">
                {categories.map((cat, index) => (
                  <li key={index}>{t(cat)}</li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchProduct')}
            className="ym-search-input"
          />
        </div>

        {/* منوهای کاربری سمت راست */}
        <div className="ym-user-menu">
          <Link to="/cart">🛒 {t('cart')}</Link>
          <Link to="/favorites">❤️ {t('favorites')}</Link>
          <Link to="/dashboard">📦 {t('dashboard')}</Link>
          {loggedIn ? (
            <button onClick={handleLogout}>🚪 {t('logout')}</button>
          ) : (
            <Link to="/login">👤 {t('login')}</Link>
          )}
        </div>
      </div>

      {/* بنر تبلیغاتی */}
      <div className="ym-banner">
        <img
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2ZzZ3Z5dWZzZ3Z5dWZzZ3Z5dWZzZ3Z5/giphy.gif"
          alt="Promo Banner"
        />
      </div>

      {/* دکمه‌های زبان
      <div className="ym-lang-buttons">
        <button onClick={() => changeLanguage('ru')} className={currentLanguage === 'ru' ? 'active' : ''}>RU</button>
        <button onClick={() => changeLanguage('en')} className={currentLanguage === 'en' ? 'active' : ''}>EN</button>
        <button onClick={() => changeLanguage('fa')} className={currentLanguage === 'fa' ? 'active' : ''}>FA</button>
        <button onClick={() => changeLanguage('tg')} className={currentLanguage === 'tg' ? 'active' : ''}>TG</button>
      </div> */}
    </header>
  );
}
