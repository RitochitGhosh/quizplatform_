import { Navbar } from '@/components/navbar';
import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'MogojDholai | Live Quiz Standings',
    description: 'Live scoring and standings for MogojDholai',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full text-zinc-900">
                <Providers>
                    <div className="min-h-screen">
                        <Navbar />
                        {children}
                        <SiteFooter />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
