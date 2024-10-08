import React from "react";
import { Image } from "@nextui-org/react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { WalletConnectButton } from "@/components/button/ConnectWallet";

export default function Header() {
  return (
    <Navbar classNames={{
      base: "py-4",
      wrapper: ["px-3", "lg:px-6"]
    }}>
      <NavbarBrand>
        <Image className="max-h-[60px]" src="/logo.png" alt="Code"/>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <WalletConnectButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
