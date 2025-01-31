"use client";

import Link from 'next/link';
import styles from './BlogPage.module.css';
import {useCallback, useEffect, useState} from 'react';
import api from "@/utils/api";

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    photo: string;
}

const CATEGORIES = ['Технології', 'Здоров’я', 'Мистецтво', 'Бізнес', 'Наука'];

const BlogPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await api.getData("blog");
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
                text: post.content.slice(0, 70) + '...',
                url: `${window.location.origin}/blog/${post.id}?title=${post.title}`,
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

    console.log("__posts", posts);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory ? post.category === selectedCategory : true)
    );

    const mainPost = filteredPosts[0];
    const otherPosts = filteredPosts.slice(1);

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Всі новини</h1>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.search}
                    placeholder="Пошук..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className={styles.categoryFilter}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Усі категорії</option>
                    {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {mainPost && (
                <div className={styles.mainPost}>
                    <img
                        src={`${mainPost.photo}`}
                        alt={mainPost.title}
                        className={styles.image}
                    />
                    <h2 className={styles.title}>{mainPost.title}</h2>
                    <p className={styles.text}>{mainPost.content.slice(0, 100)}...</p>
                    <Link href={`/blog/${mainPost.id}`} className={styles.viewBtn}>
                        Читати далі
                    </Link>
                </div>
            )}

            <div className={styles.grid}>
                {otherPosts.map((post) => (
                    <div key={post.id} className={styles.card}>
                        <img
                            src={`${post.photo}`}
                            alt={post.title}
                            className={styles.image}
                        />
                        <span className={styles.category}>{post.category}</span>
                        <h2 className={styles.title}>{post.title}</h2>
                        <p className={styles.text}>{post.content.slice(0, 70)}...</p>
                        <div className={styles.buttons}>
                            <Link href={`/blog/${post.id}?title=${post.title}`} className={styles.viewBtn}>
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
