
import React from 'react';
import './PreventionPage.css';

const PreventionPage: React.FC = () => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            fullName: formData.get('fullName') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            email: formData.get('email') as string,
            telegramUser: formData.get('telegramUser') as string,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/prevention/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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
        <div>
            <header>
                <h1>Послуги профілактичного обслуговування</h1>
            </header>

            <section id="introduction">
                <h2>Вступ до профілактичного обслуговування</h2>
                <p>
                    Профілактичне обслуговування є необхідним для підтримки вашого автомобіля в оптимальному стані. Регулярні перевірки та обслуговування подовжують термін служби вашого автомобіля, запобігають дорогим ремонтам і забезпечують вашу безпеку на дорозі. Виявлення потенційних проблем на ранніх стадіях дозволяє уникнути поломок і підтримувати оптимальну продуктивність.
                </p>
            </section>

            <section id="why-choose-us">
                <h2>Чому обрати нас?</h2>
                <ul>
                    <li><strong>Досвідчені та сертифіковані техніки:</strong> Наша команда має високий рівень кваліфікації та сертифікацію для виконання всіх необхідних робіт із обслуговування вашого автомобіля.</li>
                    <li><strong>Якісні запчастини та рідини:</strong> Ми використовуємо лише найкращі запчастини та рідини, щоб ваш автомобіль працював бездоганно.</li>
                    <li><strong>Швидке та надійне обслуговування:</strong> Ми цінуємо ваш час і надаємо швидке та надійне обслуговування.</li>
                    <li><strong>Доступні ціни:</strong> Отримуйте високоякісне обслуговування за доступними цінами.</li>
                </ul>
            </section>

            <section id="maintenance-schedule">
                <h2>Рекомендації щодо графіка обслуговування</h2>
                <p>Дотримуйтесь цих рекомендацій, щоб ваш автомобіль залишався в хорошому стані:</p>
                <ul>
                    <li><strong>Заміна олії:</strong> Кожні 5000 миль</li>
                    <li><strong>Заміна трансмісійної рідини:</strong> Кожні 30 000 миль</li>
                    <li><strong>Перевірка гальм:</strong> Кожні 10 000 миль</li>
                    <li><strong>Перевертання шин:</strong> Кожні 7 500 миль</li>
                </ul>
                <p>Завантажте наш <a href="maintenance-checklist.pdf" download>Чек-лист для обслуговування</a> для роздрукованого графіка.</p>
            </section>

            <section id="contact-form">
                <h2>Запишіться на обслуговування</h2>
                <form id="serviceForm" onSubmit={handleSubmit}>
                    <label htmlFor="fullName">Повне ім'я:</label>
                    <input type="text" id="fullName" name="fullName" required />

                    <label htmlFor="phoneNumber">Номер телефону:</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" required />

                    <label htmlFor="email">Електронна пошта:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="telegramUser">Користувач Telegram (необов'язково):</label>
                    <input type="text" id="telegramUser" name="telegramUser" />

                    <button type="submit">Відправити</button>
                </form>
            </section>
        </div>
    );
};

export default PreventionPage;