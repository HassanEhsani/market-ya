import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/dashboard')
      .then((res) => res.json())
      .then((data) => setSaved(data))
      .catch((err) => console.error('خطا در دریافت داشبورد:', err));
  }, []);

  return (
    <div>
      <h2>📦 {t('dashboard')}</h2>
      {saved.length === 0 ? (
        <p>{t('dashboardEmpty')}</p>
      ) : (
        saved.map((item, index) => (
          <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{item.name}</h3>
            <p>{t('price')}: {item.price.toLocaleString()} ₽</p>
          </div>
        ))
      )}
    </div>
  );
}
