import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng); // ذخیره زبان انتخاب‌شده
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="lang-select" style={{ marginRight: '0.5rem' }}>
        انتخاب زبان:
      </label>
      <select
        id="lang-select"
        onChange={(e) => changeLanguage(e.target.value)}
        defaultValue={i18n.language}
      >
        <option value="fa">فارسی</option>
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="tg">Тоҷикӣ</option>
      </select>
    </div>
  );
}
