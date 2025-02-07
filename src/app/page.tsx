'use client';
// import Link from 'next/link';


export default function Home() {
    return (
        <>
            <h1>Home Page</h1>
            <ul>
                <li>
                    <a href={'/blog'}>Blog</a>
                    <a href={'/team'}>Team</a>
                </li>
            </ul>
        </>
    );
}
