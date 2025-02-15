import Link from "next/link";

const Header = () => {
    return (
        <>
            <header>
                <h2>Header</h2>
                <nav>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/blog">Blog</a>
                        </li>
                        <li>
                            <a href="/contact">Contact</a>
                        </li>
                        <li>
                            <Link href="/Contact_info">General Information</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;
