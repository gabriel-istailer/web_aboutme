import './layout.css';

import Link from "next/link"

export default function formLayout({ children }) {
    return (
        <div className="formLayout">
            <header className="formLayout-header">

                <nav className="formLayout-header-nav flex-center">
                    <Link className="formLayout-header-nav-title font-LilyScriptOne" href='/'>AboutMe</Link>
                </nav>

                <section className="formLayout-header-section flex-center">
                    <div className="formLayout-background overflow-hidden flex-center">
                        {children}
                    </div>
                </section>

            </header>
        </div>
    );
}