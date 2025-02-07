"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/app/team/[id]/TeammatePage.module.css";
import Link from "next/link";
import { baseUrl } from "@/constants";

interface Teammate {
    id: number;
    name: string;
    position: string;
    description: string;
    photo: string;
    age: number;
    rating: number;
}

const TeammatePage = () => {
    const { id } = useParams();
    const [teammate, setTeammate] = useState<Teammate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeammate = async () => {
            try {
                const res = await fetch(`${baseUrl}/team/${id}`);
                if (!res.ok) {
                    throw new Error('Не вдалося завантажити дані співробітника');
                }
                const data = await res.json();
                setTeammate(data.data);
            } catch (err: any) {
                setError(err.message || 'Невідома помилка');
            } finally {
                setLoading(false);
            }
        };
        fetchTeammate();
    }, [id]);

    if (loading) {
        return <div className={styles.container}><p>Завантаження...</p></div>;
    }

    if (error) {
        return <div className={styles.container}><p>Помилка: {error}</p></div>;
    }

    if (!teammate) {
        return <div className={styles.container}><p>Співробітника не знайдено</p></div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>{teammate.name}</h1>
            <img
                src={teammate.photo || `https://picsum.photos/800/500?random=${teammate.id}`}
                alt={teammate.name}
                className={styles.image}
            />
            <p className={styles.position}>{teammate.position}</p>
            <p className={styles.body}>{teammate.description}</p>
            <p className={styles.additionalInfo}>Вік: {teammate.age} років</p>
            <p className={styles.additionalInfo}>Рейтинг: {teammate.rating}/5</p>
            <div className={styles.buttons}>
                <Link href="/team" className={styles.backLink}>
                    Назад до команди
                </Link>
            </div>
        </div>
    );
};

export default TeammatePage;
