"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from "@/utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/app/services/ServicesPage.module.css";
import { useRouter, useSearchParams } from 'next/navigation';

interface Service {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
}

const ServicePage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newService, setNewService] = useState({
        name: "",
        description: "",
        price: 0,
        category: ""
    });

    const searchParams = useSearchParams();
    const router = useRouter();

    const [search, setSearch] = useState<string>(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
    const [minPrice, setMinPrice] = useState<number | "">(searchParams.get("price_min") ? Number(searchParams.get("price_min")) : "");
    const [maxPrice, setMaxPrice] = useState<number | "">(searchParams.get("price_max") ? Number(searchParams.get("price_max")) : "");

    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                const data = await api.getData("services");
                if (!Array.isArray(data)) throw new Error("Invalid response format");
                setAllServices(data);
            } catch (err: any) {
                setError(err.message || 'Невідома помилка');
            }
        };
        fetchAllServices();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.getData(`services?${searchParams.toString()}`);
                if (!Array.isArray(data)) throw new Error("Invalid response format");
                setServices(data);
            } catch (err: any) {
                setError(err.message || 'Невідома помилка');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const createdService = await api.postData("services", {
                ...newService,
            });

            setServices([...services, createdService]);
            toast.success("Сервіс додано успішно!");
            setShowForm(false);
            setNewService({ name: "", description: "", price: 0, category: "" });
        } catch (err: any) {
            toast.error(err.message || "Помилка при створенні сервісу");
        }
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (selectedCategory) params.set("category", selectedCategory);
        if (minPrice !== "") params.set("price_min", minPrice.toString());
        if (maxPrice !== "") params.set("price_max", maxPrice.toString());

        router.push(`/services?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setMinPrice("");
        setMaxPrice("");
        router.push("/services");
    };

    const categories = [...new Set(allServices.map(s => s.category))];

    if (loading) return <div className={styles.container}><p>Завантаження...</p></div>;
    if (error) return <div className={styles.container}><p>Помилка: {error}</p></div>;

    return (
        <div className={styles.container}>
            <form onSubmit={handleFilterSubmit} className={styles.filterForm}>
                <input type="text" placeholder="Назва" value={search} onChange={e => setSearch(e.target.value)} />
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="">Усі категорії</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <input type="number" placeholder="Мін. ціна" value={minPrice} onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : "")} />
                <input type="number" placeholder="Макс. ціна" value={maxPrice} onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : "")} />
                <button type="submit">Фільтрувати</button>
                <button type="button" onClick={handleClearFilters}>Скасувати фільтрацію</button>
            </form>

            <button onClick={() => setShowForm(!showForm)}>Додати сервіс</button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Назва" value={newService.name} onChange={handleInputChange} required />
                    <input type="text" name="description" placeholder="Опис" value={newService.description} onChange={handleInputChange} required />
                    <input type="number" name="price" placeholder="Ціна" value={newService.price} onChange={handleInputChange} required />
                    <input type="text" name="category" placeholder="Категорія" value={newService.category} onChange={handleInputChange} required />
                    <button type="submit">Створити</button>
                    <button onClick={() => setShowForm(!showForm)}>Скасувати</button>
                </form>
            )}

            <ul>
                {services.length > 0 ? (
                    services.map(service => (
                        <li key={`service-${service.id}`}>
                            <Link href={`/services/${service.id}`}>
                                <h3>{service.name}</h3>
                            </Link>
                            <p>Ціна: {service.price} грн</p>
                        </li>
                    ))
                ) : (
                    <p>Сервіси не знайдені</p>
                )}
            </ul>
        </div>
    );
};

export default ServicePage;
