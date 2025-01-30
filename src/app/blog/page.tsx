'use client';

import Link from 'next/link';

const BlogPage = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const news = await res.json();
    return (
        <div>
            <h1>Всі новини</h1>
            <ul>
                {/* @ts-ignore */}
                {news.map((article) => (
                    <li key={article.id}>
                        <Link href={`/blog/${article.id}`}>
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BlogPage;
