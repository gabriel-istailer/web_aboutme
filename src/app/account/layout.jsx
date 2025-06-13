'use client';

import './layout.css';

export default function AccountLayout({ children }) {
    return (
        <html lang="pt-br">
            <head>
                <title>AboutMe | Account</title>
            </head>
            <body>
                <div className="AccountLayout">
                    {children}
                </div>
            </body>
        </html>
    );
}