
import React from "react";
import {Link, Spacer, Image} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import type {IconProps} from "@iconify/react";

type SocialIconProps = Omit<IconProps, "icon">;

const socialItems = [
  {
    name: "Twitter",
    href: "https://x.com/TheCode0X?t=SBLPtfNcKtlKW_7cBweKSA&s=09",
    icon: (props: SocialIconProps) => <Icon {...props} icon="ri:twitter-x-fill"  />,
  },
  {
    name: "Telegram",
    href: "https://t.me/CodeToken_Official",
    icon: (props: SocialIconProps) => <Icon {...props} icon="basil:telegram-outline" /> ,
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/kdPXK5eR9D",
    icon: (props: SocialIconProps) => <Icon {...props} icon="pajamas:discord" />,
  },
  {
    name: "GitHub",
    href: "#",
    icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:github" />,
  },
];

export default function Footer() {
  return (
    <footer className="mt-6 flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex justify-center gap-x-4">
          {socialItems.map((item) => (
            <Link key={item.name} isExternal className="text-default-400" href={item.href} target="_blank">
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="w-8 h-8" />
            </Link>
          ))}
        </div>
        <Spacer y={4} />
        <p className="mt-1 text-center text-small text-default-400">
          All right reserved – copyright&copy;2024 – $CODE
        </p>
      </div>
    </footer>
  );
}
