// src/app/blog/[id]/page.tsx

import React from 'react';
import Link from 'next/link';
import styles from './SingleBlogPage.module.css';
import api from '@/utils/api';

const SingleBlogPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const blog = await api.getData(`blog/${id}`);
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{blog.title}</h1>
            <img
                src={`${blog.photo}`}
                alt={blog.title}
                className={styles.image}
            />
            <p className={styles.body}>{blog.content}</p>
            <Link href="/blog" className={styles.backLink}>
                Назад до всіх новин
            </Link>
        </div>
    );
};

export default SingleBlogPage;
