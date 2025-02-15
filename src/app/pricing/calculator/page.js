"use client";

import React, { useState, useEffect } from 'react';

// Тут ви можете підключити API-утиліти, якщо вони є, наприклад:
// import api from "@/utils/api";

const PricingCalculator = () => {
    // Стан для збереження даних про товари та послуги
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    // Стан для збереження вибраних значень
    const [selectedProducts, setSelectedProducts] = useState({});
    const [selectedServices, setSelectedServices] = useState({});
    // Стан для промокоду
    const [discountCode, setDiscountCode] = useState('');
    // Стан для збереження результату розрахунку
    const [result, setResult] = useState(null);
    // Стан для індикації завантаження
    const [loading, setLoading] = useState(false);

    // useEffect для завантаження даних з бекенду
    useEffect(() => {
        async function fetchData() {
            try {
                // Базова URL-адреса бекенду, зчитана із змінної оточення
                const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

                // Отримання даних про товари
                const prodRes = await fetch(`${baseApiUrl}/api/products/`);
                const prodData = await prodRes.json();
                setProducts(prodData);

                // Отримання даних про послуги
                const servRes = await fetch(`${baseApiUrl}/api/services/`);
                const servData = await servRes.json();
                setServices(servData);
            } catch (error) {
                console.error('Error fetching products or services:', error);
            }
        }
        fetchData();
    }, []);

    // Обробка зміни кількості для товарів
    const handleProductChange = (id, quantity) => {
        setSelectedProducts(prev => ({
            ...prev,
            [id]: quantity,
        }));
    };

    // Обробка зміни опцій для послуг (наприклад, вибір premium-опції)
    const handleServiceChange = (id, option, checked) => {
        setSelectedServices(prev => {
            const currentOptions = prev[id] || [];
            const newOptions = checked
                ? [...currentOptions, option]
                : currentOptions.filter(opt => opt !== option);
            return { ...prev, [id]: newOptions };
        });
    };

    // Обробка кнопки розрахунку ціни
    const handleCalculate = async () => {
        const payload = {
            products: Object.keys(selectedProducts).map(id => ({
                id: parseInt(id),
                quantity: parseInt(selectedProducts[id]),
            })),
            services: Object.keys(selectedServices).map(id => ({
                id: parseInt(id),
                options: selectedServices[id],
            })),
            discount_code: discountCode,
        };

        try {
            setLoading(true);
            const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            // Відправка POST-запиту до API для розрахунку ціни
            const res = await fetch(`${baseApiUrl}/api/v1/pricing/calculate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error('Error calculating price:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Калькулятор цін</h1>

            <section>
                <h2>Товари</h2>
                {products.length ? (
                    products.map(product => (
                        <div key={product.id} style={{ marginBottom: '1rem' }}>
                            <strong>{product.name}</strong> - {product.price} грн
                            <input
                                type="number"
                                min="0"
                                placeholder="Кількість"
                                style={{ marginLeft: '1rem' }}
                                onChange={e => handleProductChange(product.id, e.target.value)}
                            />
                        </div>
                    ))
                ) : (
                    <p>Завантаження товарів...</p>
                )}
            </section>

            <section>
                <h2>Послуги</h2>
                {services.length ? (
                    services.map(service => (
                        <div key={service.id} style={{ marginBottom: '1rem' }}>
                            <strong>{service.name}</strong> - {service.price} грн
                            <label style={{ marginLeft: '1rem' }}>
                                <input
                                    type="checkbox"
                                    onChange={e => handleServiceChange(service.id, 'premium', e.target.checked)}
                                />
                                Premium опція (+50 грн)
                            </label>
                        </div>
                    ))
                ) : (
                    <p>Завантаження послуг...</p>
                )}
            </section>

            <section>
                <h2>Промокод</h2>
                <input
                    type="text"
                    placeholder="Введіть промокод"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                />
            </section>

            <button onClick={handleCalculate} disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Розрахунок...' : 'Порахувати ціну'}
            </button>

            {result && (
                <section style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                    <h2>Результат розрахунку</h2>
                    <p>Загальна ціна: {result.total_price} грн</p>
                    <p>Знижка: {result.discount_applied} грн</p>
                    <p>Фінальна ціна: {result.final_price} грн</p>
                </section>
            )}
        </div>
    );
};

export default PricingCalculator;
