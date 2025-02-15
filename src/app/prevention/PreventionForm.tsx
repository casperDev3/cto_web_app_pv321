
import React, { useState } from 'react';

const PreventionForm: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        telegramUser: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/prevention/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Дані успішно відправлено!');
            } else {
                alert('Помилка при відправці даних.');
            }
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fullName">ПІБ:</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="phoneNumber">Номер телефону:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="telegramUser">Telegram (необов'язково):</label>
                <input
                    type="text"
                    id="telegramUser"
                    name="telegramUser"
                    value={formData.telegramUser}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Відправити</button>
        </form>
    );
};

export default PreventionForm;