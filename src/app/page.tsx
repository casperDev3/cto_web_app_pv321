'use client';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <h1>Home Page</h1>
            <ul>
                <li>
                    <a href={'/blog'}>Blog</a>
                    <br />
                    <a href={'/contact_us'}>Contact Us Form</a>
                </li>
                <li>
                    <Link href={'/reviews'}>Reviews</Link>
                </li>
                <li>
                    <Link href={'/prevention'}>Prevention Services</Link>
                </li>
            </ul>
        </>
    );
}
