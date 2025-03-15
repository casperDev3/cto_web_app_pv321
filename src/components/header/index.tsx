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
                            <a href="http://127.0.0.1:8000/api/general-info/"> Create General info</a>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;
