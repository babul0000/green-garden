"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ContactConfig {
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
}

const DEFAULT_CONTACT: ContactConfig = {
  phone: "01883012641",
  whatsapp: "8801883012641",
  whatsappMessage: "Hello A R Green Garden, I would like to consult about landscape architecture and gardening services.",
};

export default function MobileQuickContact() {
  const { t } = useLanguage();
  const [contact, setContact] = useState<ContactConfig>(DEFAULT_CONTACT);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const navConf = data?.value?.navbar_config || {};
          const siteConf = data?.value || data || {};
          
          setContact({
            phone: navConf.hotlinePhone || siteConf.phone || DEFAULT_CONTACT.phone,
            whatsapp: navConf.whatsappNumber || siteConf.whatsapp || DEFAULT_CONTACT.whatsapp,
            whatsappMessage: navConf.whatsappMessage || siteConf.whatsappMessage || DEFAULT_CONTACT.whatsappMessage,
          });
        }
      } catch {
        // Fallback to defaults
      }
    };

    fetchContactSettings();

    const handleCustomUpdate = (e: any) => {
      if (e?.detail) {
        setContact((prev) => ({
          ...prev,
          phone: e.detail.hotlinePhone || e.detail.phone || prev.phone,
          whatsapp: e.detail.whatsappNumber || e.detail.whatsapp || prev.whatsapp,
        }));
      }
    };

    window.addEventListener("navbar-config-updated", handleCustomUpdate);
    window.addEventListener("site-settings-updated", handleCustomUpdate);
    return () => {
      window.removeEventListener("navbar-config-updated", handleCustomUpdate);
      window.removeEventListener("site-settings-updated", handleCustomUpdate);
    };
  }, []);

  const cleanPhone = contact.phone.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = contact.whatsapp.replace(/[^0-9]/g, "");
  const whatsappHref = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  return (
    <div
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 flex items-center gap-2 p-1.5 bg-[#0d1610]/95 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl font-sans"
      role="region"
      aria-label="Quick Mobile Contact"
    >
      {/* Call Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#E4E2D7] text-xs font-semibold border border-white/15 transition-all active:scale-95 cursor-pointer"
        aria-label="Call studio hotline"
      >
        <span className="text-sm">📞</span>
        <span>{t("কল করুন", "Call Now")}</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-sm">💬</span>
        <span>{t("হোয়াটসঅ্যাপ", "WhatsApp")}</span>
      </a>
    </div>
  );
}
