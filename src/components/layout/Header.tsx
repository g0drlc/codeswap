"use client";
import React from "react";
import { Image, Button } from "@nextui-org/react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { WalletConnectButton } from "@/components/button/ConnectWallet";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Navbar classNames={{
      base: "py-4 backdrop-blur-xl bg-white/90 dark:bg-zinc-900/70 border-b border-gray-200 dark:border-white/10 shadow-md",
      wrapper: ["px-3", "lg:px-6"]
    }}>
      <NavbarBrand>
        <div className="relative">
          <Image 
            className={`max-h-[60px] ${mounted && theme === 'light' ? 'brightness-0' : ''} transition-all duration-300`}
            src="/logo.png" 
            alt="Code"
          />
        </div>
      </NavbarBrand>
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          {mounted && (
            <Button
              isIconOnly
              variant="light"
              className="min-w-0"
              onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Icon 
                icon={theme === "dark" ? "solar:sun-bold" : "solar:moon-bold"} 
                className="w-5 h-5"
              />
            </Button>
          )}
        </NavbarItem>
        <NavbarItem>
          <WalletConnectButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
