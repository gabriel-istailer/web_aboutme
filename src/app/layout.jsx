import "./globals.css";
import "./fonts.css";

export const metadata = {
    title: "AboutMe",
    description: "Um site sobre contar e compartilhar sua história e biografia.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <body>
                {children}
            </body>
        </html>
    );
}
