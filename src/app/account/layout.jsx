'use client';

import './layout.css';

import Link from 'next/link';

export default function AccountLayout({ children }) {
    return (
        <html lang="pt-br">
            <head>
                <title>AboutMe | Account</title>
            </head>
            <body>
                <div className="AccountLayout">
                    <nav className="account-nav flex-center smooth-animation">
                        <Link className='account-nav-title font-LilyScriptOne smooth-animation' href='/'>AboutMe</Link>
                    </nav>
                    {children}
                </div>
            </body>
        </html>
    );
}