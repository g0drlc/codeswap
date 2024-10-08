import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/providers";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Swap",
  description: "Cross-chain swap bridge",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.png",
        href: "/favicon.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={`dark`}>
      <body
        className={`${inter.className}`}
        suppressHydrationWarning={true}
      >
        <div className="h-full">
          <Provider>
            {children}
          </Provider>
        </div>
      </body>
    </html>
  );
}
