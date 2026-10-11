"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INavbarConfig } from "./types";

interface NavLogoProps {
  config: INavbarConfig;
}

export default function NavLogo({ config }: NavLogoProps) {
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If user is already on home page, smoothly scroll to top without reloading
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center text-center px-2 overflow-hidden">
      <Link
        href="/"
        onClick={handleLogoClick}
        className="group inline-block whitespace-nowrap focus:outline-none cursor-pointer"
        title="A R Green Garden - Home"
      >
        {config.logoType === "IMAGE" && config.logoImage ? (
          <img
            src={config.logoImage}
            alt={config.logoText || "A R Green Garden Logo"}
            style={{ height: `${config.logoHeight || 28}px` }}
            className="object-contain max-w-[200px] sm:max-w-[280px] inline-block transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span
            className="font-display font-extralight text-base sm:text-xl md:text-[22px] lg:text-[25px] uppercase transition-colors tracking-[0.16em] sm:tracking-[0.24em]"
            style={{ letterSpacing: config.logoTracking || "0.24em" }}
          >
            {config.logoText || "A R GREEN GARDEN"}
          </span>
        )}
      </Link>
    </div>
  );
}
