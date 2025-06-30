import type { Metadata } from 'next';
import { Funnel_Display, Funnel_Sans } from 'next/font/google';
import './globals.css';

const funnelDisplay = Funnel_Display({
    variable: '--font-funnel-display',
    subsets: ['latin'],
});

const funnelSans = Funnel_Sans({
    variable: '--font-funnel-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Dignify',
    description: 'An app for caretakers',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${funnelSans.variable} ${funnelDisplay.variable} font-sans antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
