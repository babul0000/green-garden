"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  NavbarProps,
  IMenuLink,
  INavbarConfig,
  defaultNavbarConfig,
} from "./navbar/types";
import NavLogo from "./navbar/NavLogo";
import NavLanguageToggle from "./navbar/NavLanguageToggle";
import NavSocials from "./navbar/NavSocials";
import NavHotline from "./navbar/NavHotline";
import NavWhatsAppBtn from "./navbar/NavWhatsAppBtn";
import NavUserAuthBtn from "./navbar/NavUserAuthBtn";
import NavMenuDrawer from "./navbar/NavMenuDrawer";

// Re-export types for backward compatibility
export type { NavbarProps, IMenuLink, INavbarConfig };
export { defaultNavbarConfig };

export default function Navbar({ onOpenEstimator }: NavbarProps) {
  const { user, logout } = useAuth();
  const { toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [config, setConfig] = useState<INavbarConfig>(defaultNavbarConfig);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean;
    text: string;
    link?: string;
  }>({ enabled: false, text: "" });

  const handleToggleLang = () => {
    setRotateDeg((prev) => prev + 360);
    toggleLanguage();
  };

  // Check if current page is the homepage with dark video hero
  const isHomePage = pathname === "/";
  // On interior pages, always keep the crisp light header style; on homepage, switch on scroll
  const isLightHeader = !isHomePage || isScrolled;

  // Load navbar settings from API
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.value) {
            if (data.value.enableAnnouncement && data.value.announcementText) {
              setAnnouncement({
                enabled: true,
                text: data.value.announcementText,
                link: data.value.announcementLink,
              });
            } else {
              setAnnouncement({ enabled: false, text: "" });
            }
          }
          if (data?.value?.navbar_config) {
            setConfig({
              ...defaultNavbarConfig,
              ...data.value.navbar_config,
              menuLinks: data.value.navbar_config.menuLinks || defaultNavbarConfig.menuLinks,
            });
          } else if (data?.value) {
            setConfig((prev) => ({
              ...prev,
              logoText: data.value.title || prev.logoText,
              hotlinePhone: data.value.phone || prev.hotlinePhone,
              facebookUrl: data.value.fbPage || prev.facebookUrl,
            }));
          }
        }
      } catch (err) {
        console.warn("Navbar config fetch fallback to default");
      }
    };

    loadConfig();

    // Listen for live update events from admin panel
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig((prev) => ({ ...prev, ...e.detail }));
      }
    };

    const handleSiteSettingsUpdated = (e: any) => {
      if (e?.detail) {
        if (e.detail.enableAnnouncement && e.detail.announcementText) {
          setAnnouncement({
            enabled: true,
            text: e.detail.announcementText,
            link: e.detail.announcementLink,
          });
        } else {
          setAnnouncement({ enabled: false, text: "" });
        }
        if (e.detail.title) {
          setConfig((prev) => ({ ...prev, logoText: e.detail.title }));
        }
        if (e.detail.phone) {
          setConfig((prev) => ({ ...prev, hotlinePhone: e.detail.phone }));
        }
        if (e.detail.fbPage) {
          setConfig((prev) => ({ ...prev, facebookUrl: e.detail.fbPage }));
        }
      }
    };

    window.addEventListener("navbar-config-updated", handleUpdate);
    window.addEventListener("site-settings-updated", handleSiteSettingsUpdated);
    return () => {
      window.removeEventListener("navbar-config-updated", handleUpdate);
      window.removeEventListener("site-settings-updated", handleSiteSettingsUpdated);
    };
  }, []);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when menu popup is active
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Handle link click with smooth scroll for hash anchors on homepage or router navigation on subpages
  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
      setMenuOpen(false);

      if (targetUrl.startsWith("#")) {
        if (isHomePage) {
          e.preventDefault();
          const el = document.querySelector(targetUrl);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", targetUrl);
          }
        } else {
          e.preventDefault();
          router.push(`/${targetUrl}`);
        }
      }
    },
    [isHomePage, router]
  );

  // Handle opening cost estimator modal
  const handleTriggerEstimator = () => {
    setMenuOpen(false);
    if (onOpenEstimator) {
      onOpenEstimator();
    } else {
      window.dispatchEvent(new CustomEvent("open-estimator"));
    }
  };

  // Handle opening emergency tree doctor modal
  const handleTriggerTreeDoctor = () => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-tree-doctor"));
  };

  const visibleMenuLinks = (config.menuLinks || defaultNavbarConfig.menuLinks!).filter(
    (link) => link.isVisible !== false
  );

  const whatsappLink = `https://wa.me/${config.whatsappNumber || "8801883012641"}?text=${encodeURIComponent(
    config.whatsappMessage || "Hello A R Green Garden, I would like to consult about my garden."
  )}`;

  return (
    <>
      {/* Dynamic Top Announcement Notice Bar */}
      {announcement.enabled && (
        <aside
          role="region"
          aria-label="Studio Announcement"
          className="fixed top-0 left-0 w-full z-50 bg-[#2B4D33] text-white text-[11px] sm:text-xs py-1 px-4 text-center font-sans tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <span>{announcement.text}</span>
          {announcement.link && (
            <a href={announcement.link} className="underline hover:text-emerald-200 font-semibold ml-1">
              বিস্তারিত ➔
            </a>
          )}
        </aside>
      )}

      {/* ================= ARCHITECTURAL TOP HEADER BAR ================= */}
      <header
        className={`fixed left-0 w-full z-40 transition-all duration-500 ease-out ${
          announcement.enabled ? "top-[28px] sm:top-[26px]" : "top-0"
        } ${
          isLightHeader
            ? "bg-white/95 backdrop-blur-md shadow-xs py-3.5 sm:py-4 border-b border-black/5 text-[#323232]"
            : "bg-transparent py-5 sm:py-6 text-white"
        }`}
        role="banner"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Section 1: Hamburger Menu Trigger + Rotating Language Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2 text-inherit p-2 -ml-2 transition-opacity hover:opacity-70 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4D33] rounded-lg"
              aria-label={t("মেন্যু খুলুন", "Open Navigation Menu")}
              aria-expanded={menuOpen}
            >
              <div className="flex flex-col gap-1.5 w-7">
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isLightHeader ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isLightHeader ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isLightHeader ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
              </div>
            </button>

            {config.enableLanguageSwitch !== false && (
              <NavLanguageToggle
                isLightHeader={isLightHeader}
                rotateDeg={rotateDeg}
                onToggle={handleToggleLang}
              />
            )}
          </div>

          {/* Section 2: Centered Brand Logo (Image or Text) */}
          <NavLogo config={config} />

          {/* Section 3: Right Action Column (Socials, Hotline, WhatsApp, Auth) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3.5 shrink-0">
            {config.socialVisible !== false && (
              <NavSocials
                facebookUrl={config.facebookUrl}
                instagramUrl={config.instagramUrl}
                linkedinUrl={config.linkedinUrl}
              />
            )}

            {config.hotlineVisible !== false && (
              <NavHotline
                isLightHeader={isLightHeader}
                hotlinePhone={config.hotlinePhone}
                hotlineDisplay={config.hotlineDisplay}
              />
            )}

            {config.whatsappVisible !== false && (
              <NavWhatsAppBtn whatsappLink={whatsappLink} />
            )}

            <NavUserAuthBtn
              isLightHeader={isLightHeader}
              user={user}
            />
          </div>

        </div>
      </header>

      {/* ================= ARCHITECTURAL LINEN SLIDE-IN DRAWER MODAL ================= */}
      <NavMenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        config={config}
        visibleMenuLinks={visibleMenuLinks}
        pathname={pathname}
        isHomePage={isHomePage}
        rotateDeg={rotateDeg}
        onToggleLang={handleToggleLang}
        onLinkClick={handleLinkClick}
        onTriggerEstimator={handleTriggerEstimator}
        onTriggerTreeDoctor={handleTriggerTreeDoctor}
        user={user}
        onLogout={logout}
        whatsappLink={whatsappLink}
      />
    </>
  );
}
