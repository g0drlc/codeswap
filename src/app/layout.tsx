import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/providers";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RubicSwap",
  description: "Cross-chain swap bridge powered by Rubic aggregator",
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
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <div className="h-full relative z-10">
          <Provider>
            {children}
          </Provider>
        </div>
      </body>
    </html>
  );
}
