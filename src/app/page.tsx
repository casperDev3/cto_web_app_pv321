'use client';
import Link from 'next/link';

export default function Home() {
    const userNickNamePin = "Mechanik"; // Дефолт профиль для кнопки

    return (
        <>
            <h1>Home Page</h1>
            <ul>
                <li>
                    <a href={'/blog'}>Blog</a>
                </li>
                <li>
                    <Link href={`/profile/${userNickNamePin}`}>Profile</Link>
                </li>
            </ul>
        </>
    );
}
