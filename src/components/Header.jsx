import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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
  setShowDropdown,
  onSearch
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCategoryClick = cat => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
    setShowDropdown(false);
  };

  return (
    <header className="ym-header">
      <div className="ym-header-top">
        {/* لوگو */}
        <div className="ym-logo">
          <Link to="/home">
            <img src="/logo.png" alt="Yandex Market Clone" />
          </Link>
        </div>

        {/* دسته‌بندی کشویی و جستجو */}
        <div className="ym-center">
          <div className="ym-category-dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)}>
              📂 {t('categories')}
            </button>
            {showDropdown && (
              <ul className="ym-dropdown-list">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <button onClick={() => handleCategoryClick(cat)}>
                      {t(cat)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="ym-search-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t('searchProduct')}
              className="ym-search-input"
            />
            <button className="ym-search-btn" onClick={onSearch}>
              🔍
            </button>
          </div>
        </div>

        {/* منوهای کاربری */}
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
    </header>
);
}
