import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Analytics} from "@vercel/analytics/react"
import "./globals.css";
import Header from "./header.mdx"
import Footer from "./footer.mdx"

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Gordonston Art Fair",
    description: "Created by Ari Asulin",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <header><Header/></header>
        <article>{children}</article>
        <footer><Footer/></footer>
        <Analytics/>
        </body>
        </html>
    );
}
