"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from "@/utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/app/services/ServicesPage.module.css";

interface Service {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
}

const ServicePage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newService, setNewService] = useState({
        name: "",
        description: "",
        price: 0,
        category: ""
    });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.getData("services");
                if (!Array.isArray(data)) {
                    throw new Error("Invalid response format");
                }
                setServices(data);
            } catch (err: any) {
                setError(err.message || 'Невідома помилка');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const createdService = await api.postData("services", {
                ...newService,
                // price: newService.price,
            });

            setServices([...services, createdService]);
            toast.success("Сервіс додано успішно!");
            setShowForm(false);
            setNewService({ name: "", description: "", price: 0, category: "" });
        } catch (err: any) {
            console.error("Submit error:", err); // Логируем ошибку
            toast.error(err.message || "Помилка при створенні сервісу");
        }
    };

    if (loading) {
        return <div className={styles.container}><p>Завантаження...</p></div>;
    }

    if (error) {
        return <div className={styles.container}><p>Помилка: {error}</p></div>;
    }

    const filteredServices = services.filter(service =>
        service && // Проверка, что service определен
        service.name?.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory ? service.category === selectedCategory : true) &&
        (minPrice !== "" ? service.price >= minPrice : true) &&
        (maxPrice !== "" ? service.price <= maxPrice : true)
    );

    return (
        <div className={styles.container}>
            <input type="text" placeholder="Пошук" value={search} onChange={e => setSearch(e.target.value)} />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">Усі категорії</option>
                {[...new Set(services.map(s => s.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <input type="number" placeholder="Мін. ціна" value={minPrice} onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : "")} />
            <input type="number" placeholder="Макс. ціна" value={maxPrice} onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : "")} />

            <button onClick={() => setShowForm(!showForm)}>Додати сервіс</button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Назва" value={newService.name} onChange={handleInputChange} required />
                    <input type="text" name="description" placeholder="Опис" value={newService.description} onChange={handleInputChange} required />
                    <input type="number" name="price" placeholder="Ціна" value={newService.price} onChange={handleInputChange} required />
                    <input type="text" name="category" placeholder="Категорія" value={newService.category} onChange={handleInputChange} required />
                    <button type="submit">Створити</button>
                </form>
            )}

            <ul>
                {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                        service.id ? (
                            <li key={service.id}>
                                <Link href={`/services/${service.id}`}>
                                    <h3>{service.name}</h3>
                                </Link>
                                <p>Ціна: {service.price} грн</p>
                            </li>
                        ) : null
                    ))
                ) : (
                    <p>Сервіси не знайдені</p>
                )}
            </ul>

        </div>
    );
};

export default ServicePage;
