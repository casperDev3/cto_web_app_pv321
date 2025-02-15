import Link from "next/link";
import "./header.css"
const Header = () => {
    return (
            <header>
                <Link id="title" href="/">
                    <h2>STO</h2>
                </Link>
                <nav>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/blog">Blog</Link>
                        </li>
                        <li>
                            <Link href="/contact_us">Contact us</Link>
                        </li>
                        <li>
                            <Link href="/services">Service</Link>
                        </li>
                    </ul>
                </nav>
            </header>
    );
}

export default Header;
