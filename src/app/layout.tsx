import type { Metadata } from "next";
import "@/app/ui/globals.css";

import { Roboto } from "next/font/google";

// Emotion cache provider (client-side only)
import Providers from "./providers";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "CodeCapsule — Learn, Save, Explore",
    description:
        "Your personal hub to learn faster, save what matters, and explore curated dev resources.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={roboto.variable}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
