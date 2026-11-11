"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Estimator from "@/components/home/Estimator";
import EmergencyTreeDoctorModal from "@/components/shared/EmergencyTreeDoctorModal";
import MobileQuickContact from "@/components/layout/MobileQuickContact";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const PATH_TO_STUDIO_TAB: Array<{ match: (p: string) => boolean; tab: string; label: string }> = [
  { match: (p) => p === "/", tab: "homepage-sections", label: "🏠 হোম সেকশন এডিট" },
  { match: (p) => p.startsWith("/about"), tab: "about-studio", label: "📖 About এডিট" },
  { match: (p) => p.startsWith("/shop"), tab: "shop-studio", label: "🛒 Shop এডিট" },
  { match: (p) => p.startsWith("/team"), tab: "content-manager&sub=team", label: "👥 Team এডিট" },
  { match: (p) => p.startsWith("/faq"), tab: "content-manager&sub=faq", label: "❓ FAQ এডিট" },
  { match: (p) => p.startsWith("/contact"), tab: "content-manager&sub=contact", label: "📍 Contact এডিট" },
  { match: (p) => p.startsWith("/career"), tab: "careers", label: "💼 Career এডিট" },
  {
    match: (p) =>
      p.startsWith("/privacy-policy") || p.startsWith("/terms") || p.startsWith("/refund-policy"),
    tab: "legal-studio",
    label: "📜 Legal পেজ এডিট",
  },
  { match: (p) => p.startsWith("/projects"), tab: "projects", label: "🏗️ প্রজেক্ট এডিট" },
  { match: (p) => p.startsWith("/services"), tab: "services", label: "🌿 সার্ভিস এডিট" },
  { match: (p) => p.startsWith("/blog"), tab: "blogs", label: "📰 ব্লগ এডিট" },
  { match: (p) => p.startsWith("/gallery") || p.startsWith("/before-after"), tab: "gallery", label: "🖼️ গ্যালারি এডিট" },
  { match: (p) => p.startsWith("/design-garden"), tab: "tools-studio", label: "📐 উইজার্ড এডিট" },
  { match: (p) => p.startsWith("/tree-doctor"), tab: "tools-studio", label: "🩺 ট্রি ডক্টর এডিট" },
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showEstimatorModal, setShowEstimatorModal] = useState(false);
  const { config, getPageHeader, txt } = useSiteConfig();
  const { user } = useAuth();
  const { language } = useLanguage();
  const pathname = usePathname() || "/";

  const siteConf = config?.site_config || config || {};
  const roleUpper = user?.role?.toUpperCase() || "";
  const isStaff = ["ADMIN", "EDITOR", "MODERATOR", "EMPLOYEE"].includes(roleUpper);
  const canEditStudio = ["ADMIN", "EDITOR", "MODERATOR"].includes(roleUpper);

  useEffect(() => {
    const handleOpen = () => setShowEstimatorModal(true);
    window.addEventListener("open-estimator", handleOpen);
    return () => window.removeEventListener("open-estimator", handleOpen);
  }, []);

  const themePrimary = siteConf.themeColor || "#2B4D33";
  const themeSecondary = siteConf.secondaryColor || "#DAB200";

  // Maintenance screen for public visitors when enabled
  if (siteConf.maintenanceMode && !isStaff) {
    const maintHeader = getPageHeader("maintenance");
    return (
      <div className="min-h-screen bg-[#121813] text-[#F7F6F2] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-[#1C261D] border border-white/15 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest">
            {language === "bn" ? maintHeader.badgeBn : maintHeader.badgeEn}
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold leading-tight">
            {language === "bn" ? maintHeader.titleBn : maintHeader.titleEn}
          </h1>
          <p className="text-sm text-white/75 leading-relaxed">
            {siteConf.maintenanceMessage ||
              (language === "bn" ? maintHeader.subtitleBn : maintHeader.subtitleEn)}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href={`tel:${siteConf.phone || "01883012641"}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              📞 {txt("common.callNow", "সরাসরি কল করুন", "Call Studio")}: {siteConf.phone || "01883012641"}
            </a>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-colors"
            >
              🔐 Staff Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const studioMatch = PATH_TO_STUDIO_TAB.find((m) => m.match(pathname));

  return (
    <div
      className="flex flex-col min-h-screen bg-background text-foreground font-sans"
      style={
        {
          "--studio-primary": themePrimary,
          "--studio-accent": themeSecondary,
        } as React.CSSProperties
      }
    >
      {/* Dynamic Studio Announcement Bar */}
      {siteConf.enableAnnouncement && siteConf.announcementText && (
        <div
          className="text-white text-xs py-2 px-4 text-center font-medium z-40 relative"
          style={{ backgroundColor: themePrimary }}
        >
          {siteConf.announcementLink ? (
            <Link href={siteConf.announcementLink} className="hover:underline inline-flex items-center gap-2">
              <span>{siteConf.announcementText}</span>
              <span className="opacity-80">➔</span>
            </Link>
          ) : (
            <span>{siteConf.announcementText}</span>
          )}
        </div>
      )}

      {/* Navbar Layout */}
      <Navbar onOpenEstimator={() => setShowEstimatorModal(true)} />

      {/* Main Page Area */}
      <main className="flex-grow">{children}</main>

      {/* Emergency Tree Doctor Floating Quick Hotline & Booking Modal */}
      {siteConf.emergencyDoctorActive !== false && <EmergencyTreeDoctorModal />}

      {/* Sticky Mobile Quick Call & WhatsApp Action Bar */}
      <MobileQuickContact />

      {/* Footer Layout */}
      <Footer />

      {/* Admin Quick-Edit Floating Pill */}
      {canEditStudio && (
        <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-1.5 bg-[#121813]/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-full border border-white/15 shadow-2xl text-[11px] font-mono">
          {studioMatch && (
            <Link
              href={`/admin?tab=${studioMatch.tab}`}
              className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
            >
              {studioMatch.label}
            </Link>
          )}
          <Link
            href="/admin?tab=micro-texts"
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
          >
            🔤 ছোট টেক্সট এডিট
          </Link>
        </div>
      )}

      {/* Overlay Dialog Cost Estimator Modal */}
      {showEstimatorModal && (
        <Estimator isModal={true} onClose={() => setShowEstimatorModal(false)} />
      )}
    </div>
  );
}
