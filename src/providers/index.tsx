"use client";
import React from "react";
import dynamic from "next/dynamic";

const ThemeProvider = dynamic(() => import("@/providers/themeProvider"), { ssr: false });
const JotaiProvider = dynamic(() => import("@/providers/jotaiProvider"), { ssr: false });
const NotificationProvider = dynamic(() => import("@/providers/notificationProvider"), { ssr: false });
import { NextUIProvider } from "@nextui-org/react";
import { Providers as WagmiProvider } from "@/providers/wagmiProvider";


const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider>
      <NextUIProvider>
        <JotaiProvider>
          <NotificationProvider>
            <WagmiProvider>
              {children}
            </WagmiProvider>
          </NotificationProvider>
        </JotaiProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
};

export default ThemeClient;
