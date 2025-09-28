import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({
  loggedIn,
  handleLogout,
  searchTerm,
  setSearchTerm,
  categories,
  showDropdown,
  setShowDropdown,
  onSearch
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
    setShowDropdown(false);
  };

  return (
    <header className="ym-header">
      <div className="ym-header-top">
        <div className="ym-logo">
          <Link to="/home">
            <img src="/logo.png" alt="Yandex Market Clone" />
          </Link>
        </div>

        <div className="ym-center">
          <div className="ym-category-dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)}>
              📂 {t('categories')}
            </button>
            {showDropdown && (
              <ul className="category-dropdown">
                {categories.map((cat, index) => (
                  <li key={index} onClick={() => handleCategoryClick(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            )}

          </div>

          <div className="ym-search-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchProduct')}
              className="ym-search-input"
            />
            <button className="ym-search-btn" onClick={onSearch}>
              🔍
            </button>
          </div>
        </div>

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

    </header>
  );
}
