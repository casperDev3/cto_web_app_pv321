"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { baseUrl } from "@/constants";
import styles from "@/app/team/TeamPage.module.css";

interface Teammate {
    id: number;
    name: string;
    position: string;
    description: string;
    photo: string;
    age: number;
    rating: number;
}

const TeamPage = () => {
    const [teammates, setTeammates] = useState<Teammate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch(`${baseUrl}/team/`);
                if (!res.ok) {
                    throw new Error('Не вдалося завантажити дані команди');
                }
                const data = await res.json();
                setTeammates(data.data);
            } catch (err: any) {
                setError(err.message || 'Невідома помилка');
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = (field: string) => {
        const sortedTeammates = [...teammates].sort((a, b) => {
            if (field === "name") {
                return a.name.localeCompare(b.name);
            }
            if (field === "rating") {
                return b.rating - a.rating; // Спочатку високий рейтинг
            }
            return 0;
        });
        setTeammates(sortedTeammates);
    };

    const handleShare = useCallback((teammate: Teammate) => {
        if (navigator.share) {
            navigator.share({
                title: teammate.name,
                text: teammate.description.slice(0, 70) + '...',
                url: `${window.location.origin}/team/${teammate.id}`,
            })
                .then(() => console.log('Поділилися!'))
                .catch((error) => console.error('Помилка при діленні:', error));
        } else {
            alert('На жаль, ваш браузер не підтримує функцію спільного доступу.');
        }
    }, []);

    const handleRemove = async (teammate: Teammate) => {
        try {
            const res = await fetch(`${baseUrl}/team/${teammate.id}`, { method: 'DELETE' });
            if (res.ok) {
                setTeammates(teammates.filter(t => t.id !== teammate.id));
                alert('Члена команди видалено!');
            } else {
                throw new Error('Не вдалося видалити члена команди');
            }
        } catch (err: any) {
            setError(err.message || 'Невідома помилка');
        }
    };

    // Фільтрація за пошуковим запитом
    const filteredTeammates = teammates.filter(teammate =>
        teammate.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className={styles.container}><p>Завантаження...</p></div>;
    }

    if (error) {
        return <div className={styles.container}><p>Помилка: {error}</p></div>;
    }

    return (
        <div className={styles.container}>
            <div>
                <h1 className={styles.header}>Команда</h1>
                <img
                    src={`https://picsum.photos/600/400?random`}
                    className={styles.image}
                />
                <p>Це наша команда відданих своїй справі фахівців.</p>
            </div>

            {/* Пошук */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Пошук по імені"
                className="mb-4 p-2 border rounded-md"
            />

            {/* Кнопки сортування */}
            <div>
                <button onClick={() => handleSort("name")}>Сортувати за іменем</button>
                <button onClick={() => handleSort("rating")}>Сортувати за рейтингом</button>
            </div>

            {/* Кнопка додавання співробітника */}
            <Link href="/team/add" className="mb-4 inline-block bg-green-500 text-white py-2 px-4 rounded-md">
                Додати члена команди
            </Link>

            <div className={styles.grid}>
                {filteredTeammates.map((teammate) => (
                    <div key={teammate.id} className={styles.card}>
                        <img
                            src={teammate.photo || `https://picsum.photos/600/400?random=${teammate.id}`}
                            alt={teammate.name}
                            className={styles.image}
                        />

                        <h2 className={styles.title}>{teammate.name}</h2>
                        <p>{teammate.position}</p>
                        <p className={styles.text}>{teammate.description.slice(0, 70)}...</p>

                        <div className={styles.buttons}>
                            <Link href={`/team/${teammate.id}`} className={styles.viewBtn}>Переглянути</Link>
                            <button onClick={() => handleShare(teammate)} className={styles.shareBtn}>Поділитись</button>
                            <button onClick={() => handleRemove(teammate)} className={styles.removeBtn}>Видалити</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPage;
