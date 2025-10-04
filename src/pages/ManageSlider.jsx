import { useEffect, useState } from 'react';
import './ManageSlider.css';

export default function ManageSlider() {
    const [sliderItems, setSliderItems] = useState([]);
    const [form, setForm] = useState({
        image: '',
        start: '',
        end: ''
    });
    const [preview, setPreview] = useState('');

    useEffect(() => {
        fetch('http://localhost:4000/slider')
            .then(res => res.json())
            .then(data => setSliderItems(data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, image: reader.result });
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAddSlider = () => {
        if (!form.image || !form.start || !form.end) {
            alert('لطفاً همه فیلدها را پر کنید');
            return;
        }

        fetch('http://localhost:4000/slider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, id: Date.now().toString() })
        }).then(() => {
            alert('✅ اسلاید اضافه شد');
            setForm({ image: '', start: '', end: '' });
            setPreview('');
            window.location.reload();
        });
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:4000/slider/${id}`, {
            method: 'DELETE'
        }).then(() => {
            alert('❌ اسلاید حذف شد');
            window.location.reload();
        });
    };

    const now = new Date();
    const activeSlides = sliderItems.filter(slide => new Date(slide.end) > now);
    const expiredSlides = sliderItems.filter(slide => new Date(slide.end) <= now);

    return (
        <div className="slider-admin">
            <h2>🎞 مدیریت اسلایدهای تبلیغاتی</h2>
            <p>📏 سایز تصویر اسلایدر باید <strong>1200x400px</strong> باشد (حداکثر حجم <strong>300KB</strong>)</p>

            <div className="slider-form">
                <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#333'
                }}>
                    📷 تصویر اسلایدر
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
                        سایز استاندارد: <strong>1200 × 400 پیکسل</strong>
                        | حداکثر حجم: <strong>300KB</strong>
                    </span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginBottom: '1rem' }}
                />
                {preview && (
                    <img
                        src={preview}
                        alt="پیش‌نمایش"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            borderRadius: '8px',
                            marginTop: '1rem',
                            border: '1px solid #ccc'
                        }}
                    />
                )}

                <input
                    type="datetime-local"
                    name="start"
                    value={form.start}
                    onChange={handleChange}
                />

                <input
                    type="datetime-local"
                    name="end"
                    value={form.end}
                    onChange={handleChange}
                />

                <button onClick={handleAddSlider}>➕ افزودن اسلاید</button>
            </div>


            <h3>🟢 اسلایدهای فعال</h3>
            <ul>
                {activeSlides.map(slide => (
                    <li key={slide.id}>
                        پایان: {new Date(slide.end).toLocaleString()}
                        <button onClick={() => handleDelete(slide.id)}>🗑 حذف</button>
                    </li>
                ))}
            </ul>

            <h3>🔴 اسلایدهای منقضی‌شده</h3>
            <ul>
                {expiredSlides.map(slide => (
                    <li key={slide.id}>
                        پایان: {new Date(slide.end).toLocaleString()}
                        <button onClick={() => handleDelete(slide.id)}>🗑 حذف</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
