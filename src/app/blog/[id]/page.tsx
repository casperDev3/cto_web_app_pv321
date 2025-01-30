// src/app/blog/[id]/page.tsx

import React from 'react';
import Link from 'next/link';
import styles from './SingleBlogPage.module.css';

// Інтерфейс для посту
interface Post {
    id: number;
    title: string;
    body: string;
}

// Серверний компонент для окремої сторінки посту
const SingleBlogPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;

    // Отримання даних зі стороннього API на сервері
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        // Кешування даних для оптимізації (можна змінити за потреби)
        cache: 'no-store',
    });

    if (!res.ok) {
        return (
            <div className={styles.container}>
                <h1 className={styles.error}>Помилка</h1>
                <p>Не вдалося завантажити пост.</p>
                <Link href="/blog" className={styles.backLink}>
                    Назад до всіх новин
                </Link>
            </div>
        );
    }

    const blog: Post = await res.json();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{blog.title}</h1>
            <img
                src={`https://picsum.photos/800/500?random=${blog.id}`}
                alt={blog.title}
                className={styles.image}
            />
            <p className={styles.body}>{blog.body}</p>
            <Link href="/blog" className={styles.backLink}>
                Назад до всіх новин
            </Link>
        </div>
    );
};

export default SingleBlogPage;
