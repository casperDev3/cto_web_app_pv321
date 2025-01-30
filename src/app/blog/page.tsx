"use client";

import Link from 'next/link';
import styles from './BlogPage.module.css';
import { useCallback, useEffect, useState } from 'react';

interface Post {
    id: number;
    title: string;
    body: string;
}

const BlogPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('https://jsonplaceholder.typicode.com/posts');
                if (!res.ok) {
                    throw new Error('Не вдалося завантажити пости');
                }
                const data: Post[] = await res.json();
                setPosts(data);
            } catch (err: any) {
                setError(err.message || 'Невідома помилка');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleShare = useCallback((post: Post) => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.body.slice(0, 70) + '...',
                url: `${window.location.origin}/blog/${post.id}`,
            })
                .then(() => console.log('Поділилися!'))
                .catch((error) => console.error('Помилка при діленні:', error));
        } else {
            alert('На жаль, ваш браузер не підтримує функцію спільного доступу.');
        }
    }, []);

    if (loading) {
        return <div className={styles.container}><p>Завантаження...</p></div>;
    }

    if (error) {
        return <div className={styles.container}><p>Помилка: {error}</p></div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Всі новини</h1>

            <div className={styles.grid}>
                {posts.map((post) => (
                    <div key={post.id} className={styles.card}>
                        {/* Зображення з сервісу picsum.photos */}
                        <img
                            src={`https://picsum.photos/600/400?random=${post.id}`}
                            alt={post.title}
                            className={styles.image}
                        />

                        <h2 className={styles.title}>{post.title}</h2>
                        <p className={styles.text}>
                            {post.body.slice(0, 70)}...
                        </p>

                        <div className={styles.buttons}>
                            <Link href={`/blog/${post.id}`} className={styles.viewBtn}>
                                Переглянути
                            </Link>
                            <button
                                type="button"
                                className={styles.shareBtn}
                                onClick={() => handleShare(post)}
                            >
                                Поділитись
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
