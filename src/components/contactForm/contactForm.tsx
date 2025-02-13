'use client';

import api from '@/utils/api';
import {showToast} from "react-next-toast";

export default function ContactForm() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const message = formData.get('message') as string;

        if (!name || !email || !message) {
            showToast('Будь ласка, заповніть обов\'язкові поля: Ім\'я, Email та Повідомлення.','error');
            return;
        }

        try {
            const response = await api.postData('forms/contact_us', {
                name,
                email,
                phone,
                message,
            });

            if (response.success) {
                showToast('Запит успішно відправлено!','success');
                form.reset();
            } else {
                showToast(response.message || 'Помилка при відправці форми.', 'error');
            }
        } catch (error) {
            showToast('Сталася помилка при відправці форми.', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Ім'я:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                />
            </div>
            <div>
                <label htmlFor="phone">Телефон:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                />
            </div>
            <div>
                <label htmlFor="message">Повідомлення:</label>
                <textarea
                    id="message"
                    name="message"
                    required
                />
            </div>
            <button type="submit">Відправити</button>
        </form>
    );
}