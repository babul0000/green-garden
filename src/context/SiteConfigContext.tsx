"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DEFAULT_CAREER_CONFIG,
  DEFAULT_ESTIMATOR_CONFIG,
  DEFAULT_EXTENDED_CONTACT_CONFIG,
  DEFAULT_LEGAL_CONFIG,
  DEFAULT_LOYALTY_CONFIG,
  DEFAULT_PAGES_CONFIG,
  DEFAULT_SHOP_CONFIG,
  DEFAULT_TREE_DOCTOR_CONFIG,
  DEFAULT_UI_TEXT_ITEMS,
  DEFAULT_WIZARD_CONFIG,
  PageHeaderConfig,
  PageSlugKey,
  UiTextItem,
} from "@/types/cms";

export const SETTINGS_SYNC_EVENTS = [
  "site-settings-updated",
  "site-content-updated",
  "homepage-config-updated",
  "about-config-updated",
  "navbar-config-updated",
  "hero-config-updated",
  "shop-config-updated",
  "legal-config-updated",
  "ui-texts-updated",
  "pages-config-updated",
  "career-config-updated",
  "tools-config-updated",
];

export function emitSettingsSync(eventName = "site-settings-updated") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(eventName));
  window.dispatchEvent(new Event("site-settings-updated"));
  try {
    const ch = new BroadcastChannel("gg_settings_sync");
    ch.postMessage({ eventName, ts: Date.now() });
    ch.close();
  } catch {
    // BroadcastChannel optional
  }
}

interface SiteConfigContextValue {
  config: Record<string, any>;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  getSection: <T>(key: string, fallback: T) => T;
  getPageHeader: (slug: PageSlugKey) => PageHeaderConfig;
  txt: (key: string, defaultBn: string, defaultEn: string) => string;
  txObj: (key: string, defaultBn: string, defaultEn: string) => { bn: string; en: string };
}

const DEFAULT_MERGED_CONFIG: Record<string, any> = {
  site_config: {
    title: "A R Green Garden",
    tagline: "Landscape Architecture & Biophilic Studio",
    phone: "01883012641",
    whatsapp: "8801883012641",
    email: "info@argreengarden.com",
    address: "৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯",
    themeColor: "#2B4D33",
    secondaryColor: "#DAB200",
    currencySymbol: "৳",
    emergencyDoctorActive: true,
    bookingActive: true,
    maintenanceMode: false,
    enableAnnouncement: false,
  },
  legal_config: DEFAULT_LEGAL_CONFIG,
  shop_config: DEFAULT_SHOP_CONFIG,
  estimator_config: DEFAULT_ESTIMATOR_CONFIG,
  wizard_config: DEFAULT_WIZARD_CONFIG,
  loyalty_config: DEFAULT_LOYALTY_CONFIG,
  tree_doctor_config: DEFAULT_TREE_DOCTOR_CONFIG,
  contact_config: DEFAULT_EXTENDED_CONTACT_CONFIG,
  career_config: DEFAULT_CAREER_CONFIG,
  pages_config: DEFAULT_PAGES_CONFIG,
  ui_texts_config: { items: DEFAULT_UI_TEXT_ITEMS, deletedKeys: [] },
};

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [config, setConfig] = useState<Record<string, any>>(DEFAULT_MERGED_CONFIG);
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === "object") {
        setConfig((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // keep safe defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();

    const handler = () => {
      refreshConfig();
    };

    for (const ev of SETTINGS_SYNC_EVENTS) {
      window.addEventListener(ev, handler);
    }

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("gg_settings_sync");
      channel.onmessage = () => refreshConfig();
    } catch {
      // ignore if unsupported
    }

    return () => {
      for (const ev of SETTINGS_SYNC_EVENTS) {
        window.removeEventListener(ev, handler);
      }
      channel?.close();
    };
  }, [refreshConfig]);

  const uiTextMap = useMemo(() => {
    const map = new Map<string, UiTextItem>();
    for (const def of DEFAULT_UI_TEXT_ITEMS) {
      map.set(def.key, def);
    }
    const items: UiTextItem[] = config?.ui_texts_config?.items || [];
    for (const item of items) {
      if (item?.key) map.set(item.key, item);
    }
    return map;
  }, [config?.ui_texts_config]);

  const getSection = useCallback(
    <T,>(key: string, fallback: T): T => {
      const raw = config?.[key];
      if (!raw || typeof raw !== "object") return fallback;
      if (Array.isArray(fallback)) return raw as T;
      return { ...fallback, ...raw };
    },
    [config]
  );

  const getPageHeader = useCallback(
    (slug: PageSlugKey): PageHeaderConfig => {
      const fallback = DEFAULT_PAGES_CONFIG[slug];
      const stored = config?.pages_config?.[slug];
      if (!stored) return fallback;
      return { ...fallback, ...stored };
    },
    [config]
  );

  const txObj = useCallback(
    (key: string, defaultBn: string, defaultEn: string) => {
      const found = uiTextMap.get(key);
      return {
        bn: found?.bn?.trim() ? found.bn : defaultBn,
        en: found?.en?.trim() ? found.en : defaultEn,
      };
    },
    [uiTextMap]
  );

  const txt = useCallback(
    (key: string, defaultBn: string, defaultEn: string) => {
      const obj = txObj(key, defaultBn, defaultEn);
      return language === "bn" ? obj.bn : obj.en;
    },
    [language, txObj]
  );

  const value = useMemo(
    () => ({
      config,
      loading,
      refreshConfig,
      getSection,
      getPageHeader,
      txt,
      txObj,
    }),
    [config, loading, refreshConfig, getSection, getPageHeader, txt, txObj]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    return {
      config: DEFAULT_MERGED_CONFIG,
      loading: false,
      refreshConfig: async () => {},
      getSection: <T,>(_: string, fallback: T) => fallback,
      getPageHeader: (slug: PageSlugKey) => DEFAULT_PAGES_CONFIG[slug],
      txt: (_: string, defaultBn: string, defaultEn: string) => defaultBn || defaultEn,
      txObj: (_: string, defaultBn: string, defaultEn: string) => ({ bn: defaultBn, en: defaultEn }),
    };
  }
  return ctx;
}

