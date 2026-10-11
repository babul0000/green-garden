"use client";

import React from "react";
import Link from "next/link";
import { IMenuLink } from "./types";

interface NavDrawerLinksProps {
  links: IMenuLink[];
  pathname: string;
  isHomePage: boolean;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
  onClose: () => void;
}

export default function NavDrawerLinks({
  links,
  pathname,
  isHomePage,
  onLinkClick,
  onClose,
}: NavDrawerLinksProps) {
  return (
    <nav className="space-y-3 font-display font-light" aria-label="Main Navigation">
      {links.map((link) => {
        const isInternalAnchor = link.url.startsWith("#");
        const isActive = !isInternalAnchor && pathname === link.url;

        return (
          <div key={link.id} className="group flex items-center justify-between">
            {isInternalAnchor ? (
              <a
                href={isHomePage ? link.url : `/${link.url}`}
                onClick={(e) => onLinkClick(e, link.url)}
                className="text-2xl sm:text-3xl md:text-[34px] font-light text-[#323232] hover:text-[#2B4D33] hover:translate-x-1.5 transition-all block leading-tight tracking-tight duration-200"
              >
                {link.titleEn}
              </a>
            ) : (
              <Link
                href={link.url}
                onClick={onClose}
                className={`text-2xl sm:text-3xl md:text-[34px] font-light hover:translate-x-1.5 transition-all block leading-tight tracking-tight duration-200 ${
                  isActive
                    ? "text-[#2B4D33] font-normal"
                    : "text-[#323232] hover:text-[#2B4D33]"
                }`}
              >
                {link.titleEn}
              </Link>
            )}

            {link.badge && (
              <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-[#323232]/10 text-[#323232] border border-[#323232]/20 font-bold uppercase tracking-wider">
                {link.badge}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
