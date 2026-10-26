"use client";

import React, { useState, useEffect } from "react";
import ShmaHeroVideo from "@/components/home/ShmaHeroVideo";
import ShmaAnimatedManifesto from "@/components/home/ShmaAnimatedManifesto";
import ShmaHighlightProjects from "@/components/home/ShmaHighlightProjects";
import ShmaServicesFlip from "@/components/home/ShmaServicesFlip";
import ShmaProcess from "@/components/home/ShmaProcess";
import ShmaCampaign from "@/components/home/ShmaCampaign";
import ShmaRecentActivities from "@/components/home/ShmaRecentActivities";
import ShmaLife from "@/components/home/ShmaLife";

interface HomeSection {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  width?: "full" | "contained" | "compact";
  columns?: 1 | 2 | 3 | 4;
  padding?: "none" | "small" | "normal" | "large";
}

interface HomepageConfig {
  sections: HomeSection[];
  manifesto?: { lineEn?: string; lineBn?: string; descriptionEn?: string; descriptionBn?: string };
  process?: {
    titleEn?: string;
    titleBn?: string;
    steps?: Array<{ iconEn?: string; titleEn?: string; titleBn?: string; descEn?: string; descBn?: string }>;
  };
  campaign?: { textEn?: string; textBn?: string };
}

const DEFAULT_CONFIG: HomepageConfig = {
  sections: [
    { id: "hero", label: "🎥 Hero Video", visible: true, order: 1, width: "full", columns: 1, padding: "none" },
    { id: "manifesto", label: "✨ Animated Manifesto", visible: true, order: 2, width: "full", columns: 1, padding: "none" },
    { id: "projects", label: "🏗️ Highlight Projects", visible: true, order: 3, width: "contained", columns: 2, padding: "normal" },
    { id: "services", label: "🌿 Services Flip Cards", visible: true, order: 4, width: "contained", columns: 3, padding: "normal" },
    { id: "process", label: "📐 Our Process", visible: true, order: 5, width: "contained", columns: 4, padding: "normal" },
    { id: "campaign", label: "📣 Campaign Banner", visible: true, order: 6, width: "full", columns: 1, padding: "small" },
    { id: "activities", label: "📸 Recent Activities", visible: true, order: 7, width: "contained", columns: 3, padding: "normal" },
    { id: "life", label: "🌱 Studio Life", visible: true, order: 8, width: "full", columns: 1, padding: "none" },
  ],
};

export default function Home() {
  const [config, setConfig] = useState<HomepageConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/settings?key=homepage_sections&_t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.value) {
            setConfig((prev) => ({
              ...DEFAULT_CONFIG,
              ...data.value,
              sections: data.value.sections || prev.sections,
            }));
          }
        }
      } catch (err) {
        // Fallback silently
      }
    };

    fetchConfig();

    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setConfig((prev) => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener("homepage-config-updated", handleUpdate);
    return () => window.removeEventListener("homepage-config-updated", handleUpdate);
  }, []);

  // Sort visible sections by order
  const sortedSections = [...config.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderSection = (section: HomeSection) => {
    const isHero = section.id === "hero";
    const widthClass = "w-full";

    const paddingClass =
      isHero || section.padding === "none"
        ? "py-0"
        : section.padding === "small"
        ? "py-6 sm:py-8"
        : section.padding === "large"
        ? "py-20 sm:py-28"
        : "py-10 sm:py-14";

    let component: React.ReactNode = null;
    switch (section.id) {
      case "hero":
        component = <ShmaHeroVideo key="hero" />;
        break;
      case "manifesto":
        component = <ShmaAnimatedManifesto key="manifesto" manifestoConfig={config.manifesto} />;
        break;
      case "projects":
        component = <ShmaHighlightProjects key="projects" columns={section.columns} />;
        break;
      case "services":
        component = <ShmaServicesFlip key="services" columns={section.columns} />;
        break;
      case "process":
        component = <ShmaProcess key="process" processConfig={config.process} />;
        break;
      case "campaign":
        component = <ShmaCampaign key="campaign" campaignConfig={config.campaign} />;
        break;
      case "activities":
        component = <ShmaRecentActivities key="activities" />;
        break;
      case "life":
        component = <ShmaLife key="life" />;
        break;
      default:
        component = null;
    }

    if (!component) return null;

    return (
      <section key={section.id} className={`${widthClass} ${paddingClass} transition-all duration-300`}>
        {component}
      </section>
    );
  };

  return (
    <div className="relative">
      {sortedSections.map((sec) => renderSection(sec))}
    </div>
  );
}
