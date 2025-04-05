'use client';

import "./globals.css";
import "./fonts.css";

import { useEffect } from "react";

export default function RootLayout({ children }) {

    useEffect(() => {
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('show-animation');
                } else {
                    entry.target.classList.remove('show-animation');
                }
            });
        });

        const observeElements = () => {
            const elements = document.querySelectorAll('.smooth-animation');
            elements.forEach(element => visibilityObserver.observe(element));
        };

        observeElements();

        const mutationObserver = new MutationObserver(() => {
            observeElements();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            mutationObserver.disconnect();
            visibilityObserver.disconnect();
        };
    }, []);

    return (
        <html lang="pt-br">
            <head>
                <title>AboutMe</title>
                <meta name="description" content="A website about telling and sharing your story and biography."/>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
