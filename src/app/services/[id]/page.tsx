"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/app/services/[id]/SingleServicesPage.module.css";

interface Service {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
}

const ServicePage = () => {
    const { id } = useParams();
    const router = useRouter();

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedService, setEditedService] = useState<Service | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await api.getData(`services/${id}`);
                if (!data || typeof data !== "object") {
                    throw new Error("Невірний формат відповіді");
                }
                setService(data);
                setEditedService(data); // Заполняем форму редактирования текущими данными
            } catch (err: any) {
                setError(err.message || "Помилка завантаження сервісу");
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedService) {
            setEditedService({ ...editedService, [e.target.name]: e.target.value });
        }
    };

    const handleUpdate = async () => {
        try {
            await api.putData(`services/${id}`, editedService);
            toast.success("Сервіс оновлено успішно!");
            window.location.href = `/services/${id}`; // Перезагрузка страницы
        } catch (err: any) {
            console.error("Update error:", err);
            toast.error(err.message || "Помилка при оновленні сервісу");
        }
    };




    const handleDelete = async () => {
        if (!confirm("Ви впевнені, що хочете видалити цей сервіс?")) return;
        try {
            await api.deleteData("services", Number(id));
            toast.success("Сервіс видалено!");
            router.push("/services"); // Перенаправление назад
        } catch (err: any) {
            toast.error(err.message || "Помилка при видаленні сервісу");
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error}</p>;
    if (!service) return <p>Сервіс не знайдено</p>;

    return (
        <div className={styles.container}>
            {isEditing ? (
                <div className={styles.editForm}>
                    <h2>Редагувати сервіс</h2>
                    <input type="text" name="name" value={editedService?.name} onChange={handleEditChange} />
                    <textarea name="description" value={editedService?.description} onChange={handleEditChange} />
                    <input type="number" name="price" value={editedService?.price} onChange={handleEditChange} />
                    <input type="text" name="category" value={editedService?.category} onChange={handleEditChange} />
                    <button type="button" onClick={handleUpdate}>Зберегти</button>
                    <button type="button" className={styles.cancel} onClick={() => setIsEditing(false)}>Скасувати</button>
                </div>
            ) : (
                <div className={styles.serviceDetails}>
                    <h1>{service.name}</h1>
                    <p><strong>Опис:</strong> {service.description}</p>
                    <p><strong>Ціна:</strong> {service.price} грн</p>
                    <p><strong>Категорія:</strong> {service.category}</p>
                    <button type="button" onClick={() => setIsEditing(true)}>Редагувати</button>
                    <button type="button" className={styles.delete} onClick={handleDelete}>Видалити</button>
                </div>
            )}
        </div>
    );
};

export default ServicePage;
