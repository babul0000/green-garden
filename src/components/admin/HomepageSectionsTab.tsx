"use client";

import React, { useState, useEffect } from "react";
import SortableList, { DragHandle } from "@/components/shared/SortableList";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import { toast, ToastContainer } from "@/components/shared/Toast";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

interface HomeSection {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  width?: "full" | "contained" | "compact";
  columns?: 1 | 2 | 3 | 4;
  padding?: "none" | "small" | "normal" | "large";
}

export interface ProcessStepItem {
  iconEn: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  image?: string;
}

export interface HomepageConfig {
  sections: HomeSection[];
  manifesto: { lineEn: string; lineBn: string };
  process: {
    titleEn: string;
    titleBn: string;
    categoryEn?: string;
    categoryBn?: string;
    headlineEn?: string;
    headlineBn?: string;
    descEn?: string;
    descBn?: string;
    steps: ProcessStepItem[];
  };
  campaign: { textEn: string; textBn: string };
  whyUs?: {
    titleEn: string;
    titleBn: string;
    points: { iconEn: string; titleEn: string; titleBn: string; descEn: string; descBn: string }[];
  };
  studioLife?: {
    titleEn: string;
    titleBn: string;
    image: string;
    paragraph1Bn: string;
    paragraph2Bn: string;
    paragraph1En: string;
    paragraph2En: string;
  };
}

const DEFAULT_CONFIG: HomepageConfig = {
  sections: [
    { id: "hero", label: "🎥 Hero Video", visible: true, order: 1, width: "full", columns: 1, padding: "none" },
    { id: "manifesto", label: "✨ Animated Manifesto", visible: true, order: 2, width: "contained", columns: 1, padding: "normal" },
    { id: "projects", label: "🏗️ Highlight Projects", visible: true, order: 3, width: "contained", columns: 3, padding: "normal" },
    { id: "services", label: "🌿 Services Flip Cards", visible: true, order: 4, width: "contained", columns: 3, padding: "normal" },
    { id: "process", label: "📐 Our Process", visible: true, order: 5, width: "contained", columns: 4, padding: "normal" },
    { id: "campaign", label: "📣 Campaign Banner", visible: true, order: 6, width: "full", columns: 1, padding: "small" },
    { id: "activities", label: "📸 Recent Activities", visible: true, order: 7, width: "contained", columns: 3, padding: "normal" },
    { id: "life", label: "🌱 Studio Life", visible: true, order: 8, width: "contained", columns: 2, padding: "normal" },
  ],
  manifesto: {
    lineEn: "ENABLE CHANGE FOR A BETTER EARTH",
    lineBn: "একটি সুন্দর পৃথিবীর জন্য পরিবর্তন আনুন",
  },
  process: {
    titleEn: "A Thoughtful Journey",
    titleBn: "আমাদের কার্যপদ্ধতি",
    categoryEn: "DESIGN & DELIVERY STAGES",
    categoryBn: "ডিজাইন ও বাস্তবায়ন পর্যায়",
    headlineEn: "A Thoughtful Journey to Transformative Solutions",
    headlineBn: "টেকসই ও আধুনিক সমাধানের সুপরিকল্পিত যাত্রা",
    descEn: "Ensuring highest architectural standards, native plant health, and waterproofing resilience across every phase.",
    descBn: "প্রাথমিক ভাবনা থেকে চূড়ান্ত বাস্তবায়ন পর্যন্ত প্রতিটি ধাপে আন্তর্জাতিক গুণগত মান, জীববৈচিত্র্য ও ওয়াটারপ্রুফিং সুরক্ষা নিশ্চিতকরণ।",
    steps: [
      {
        iconEn: "💬",
        titleEn: "Define Problem & Site Survey",
        titleBn: "সমস্যা ও সাইট বিশ্লেষণ",
        descEn: "Connecting with the client to understand requirements and uncovering true ecological potential.",
        descBn: "ক্লায়েন্টের নির্দিষ্ট চাহিদা ও সাইটের চ্যালেঞ্জ গভীরভাবে পর্যবেক্ষণ করে প্রকল্পের সর্বোচ্চ সম্ভাবনা নিশ্চিত করা।",
        image: "/hero_plants.png",
      },
      {
        iconEn: "📐",
        titleEn: "Idea & Biophilic Concept",
        titleBn: "নকশা ও সৃজনশীল ধারণা",
        descEn: "Translating ecological research and client aspiration into cohesive biophilic master concepts.",
        descBn: "সাইট জরিপ ও গবেষণার মাধ্যমে টেকসই পরিবেশ সৃষ্টিতে আধুনিক স্থাপত্য নকশার রূপরেখা প্রণয়ন।",
        image: "/featured_plant.png",
      },
      {
        iconEn: "🌿",
        titleEn: "Data Driven & Microclimate",
        titleBn: "বৈজ্ঞানিক ডেটা ও সিমুলেশন",
        descEn: "Simulating microclimate, sunlight patterns, and rainfall catchment for grounded decisions.",
        descBn: "মাইক্রোক্লাইমেট, সূর্যালোকের ব্যাপ্তি ও বৃষ্টির পানি প্রবাহের ডিজিটাল সিমুলেশন করে পরিকল্পনা চূড়ান্তকরণ।",
        image: "/hero_plants.png",
      },
      {
        iconEn: "🔧",
        titleEn: "Prototyping & Execution",
        titleBn: "টার্ন-কি বাস্তবায়ন ও যত্ন",
        descEn: "Transforming concepts into living landscapes through waterproof layers and turnkey engineering.",
        descBn: "থ্রিডি মডেল ও শতভাগ ওয়াটারপ্রুফ মেমব্রেনসহ দক্ষ প্রকৌশলীদের দিয়ে সাইটে নিখুঁত বাস্তবায়ন।",
        image: "/featured_plant.png",
      },
    ],
  },
  campaign: {
    textEn: "A R GREEN GARDEN — 10TH ANNIVERSARY — Participating in the Future",
    textBn: "এ আর গ্রিন গার্ডেন — ১০ম বার্ষিকী — ভবিষ্যতের সাথে অংশীদারিত্ব",
  },
  studioLife: {
    titleEn: "Studio Life & Culture",
    titleBn: "স্টুডিও লাইফ ও কালচার",
    image: "/hero_plants.png",
    paragraph1Bn: "ঢাকার প্রাণকেন্দ্র ধানমন্ডিতে অবস্থিত এ আর গ্রিন গার্ডেনের স্টুডিও ক্যাম্পাস। এখানে নবীন ও অভিজ্ঞ ল্যান্ডস্কেপ আর্কিটেক্ট, আরবারিস্ট এবং সিভিল ইঞ্জিনিয়াররা মিলেমিশে গড়ে তুলেছেন এক উন্মুক্ত উদ্ভাবনী পরিবেশ।",
    paragraph2Bn: "আমাদের স্টুডিও কেবল গতানুগতিক কাজের জায়গা নয়, বরং এটি ধানমন্ডির বুকে এক জীবন্ত সবুজ গবেষণাগার।",
    paragraph1En: "Located in the heart of Dhanmondi, the A R Green Garden studio is an open collaborative space where landscape architects, arborists, and civil engineers unite around climate-resilient design.",
    paragraph2En: "Beyond a traditional architectural studio, our campus serves as a biophilic learning laboratory.",
  },
};

const PRESET_STEP_ICONS = ["💬", "📐", "🌿", "🔧", "🌱", "🏗️", "🩺", "⛲", "💧", "🔍", "📋", "🏡"];

interface HomepageSectionsTabProps {
  defaultTab?: "sections" | "manifesto" | "process" | "campaign" | "studioLife";
}

export default function HomepageSectionsTab({ defaultTab = "sections" }: HomepageSectionsTabProps) {
  const [config, setConfig] = useState<HomepageConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"sections" | "manifesto" | "process" | "campaign" | "studioLife">(defaultTab);

  // Process Step Modal states
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepIcon, setStepIcon] = useState("🌱");
  const [stepTitleEn, setStepTitleEn] = useState("");
  const [stepTitleBn, setStepTitleBn] = useState("");
  const [stepDescEn, setStepDescEn] = useState("");
  const [stepDescBn, setStepDescBn] = useState("");
  const [stepImage, setStepImage] = useState("/hero_plants.png");

  // Delete Step confirmation state
  const [deleteStepIndex, setDeleteStepIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("gg_auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/settings?key=homepage_sections&_t=${Date.now()}`, {
        cache: "no-store",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.value) {
          setConfig((prev) => ({
            ...DEFAULT_CONFIG,
            ...data.value,
            process: {
              ...DEFAULT_CONFIG.process,
              ...(data.value.process || {}),
              steps: Array.isArray(data.value.process?.steps) ? data.value.process.steps : DEFAULT_CONFIG.process.steps,
            },
          }));
        }
      }
    } catch {
      console.warn("Fallback to defaults");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ key: "homepage_sections", value: config }),
      });
      if (res.ok) {
        toast.success("হোমপেজ ও প্রসেস কনফিগারেশন সফলভাবে সেভ হয়েছে! ✨", { title: "সংরক্ষিত" });
        window.dispatchEvent(new CustomEvent("homepage-config-updated", { detail: config }));
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", { title: "ব্যর্থ হয়েছে" });
      }
    } catch {
      toast.error("নেটওয়ার্ক এরর। ইন্টারনেট সংযোগ চেক করুন।", { title: "নেটওয়ার্ক সমস্যা" });
    } finally {
      setSaving(false);
    }
  };

  // ── Sections Order & Sizing Handlers ──
  const toggleSection = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    }));
  };

  const reorderSections = (newSections: HomeSection[]) => {
    setConfig((prev) => ({
      ...prev,
      sections: newSections.map((s, i) => ({ ...s, order: i + 1 })),
    }));
  };

  const updateSectionSize = (id: string, width: "full" | "contained" | "compact") => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, width } : s)),
    }));
  };

  const updateSectionColumns = (id: string, columns: 1 | 2 | 3 | 4) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, columns } : s)),
    }));
  };

  const updateSectionPadding = (id: string, padding: "none" | "small" | "normal" | "large") => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, padding } : s)),
    }));
  };

  // ── Process Steps Handlers (Full CRUD) ──
  const openAddStepModal = () => {
    setEditingStepIndex(null);
    setStepIcon("🌱");
    setStepTitleEn("");
    setStepTitleBn("");
    setStepDescEn("");
    setStepDescBn("");
    setStepImage("/hero_plants.png");
    setIsStepModalOpen(true);
  };

  const openEditStepModal = (index: number) => {
    const step = config.process.steps[index];
    if (!step) return;
    setEditingStepIndex(index);
    setStepIcon(step.iconEn || "🌱");
    setStepTitleEn(step.titleEn || "");
    setStepTitleBn(step.titleBn || "");
    setStepDescEn(step.descEn || "");
    setStepDescBn(step.descBn || "");
    setStepImage(step.image || "/hero_plants.png");
    setIsStepModalOpen(true);
  };

  const persistConfig = async (newConfig: HomepageConfig) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ key: "homepage_sections", value: newConfig }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Auto-save failed:", err);
        toast.error(err.error || "সার্ভারে অটো-সেভ ব্যর্থ হয়েছে। দয়া করে উপরে 'পরিবর্তন সেভ করুন' চাপুন।", { title: "সেভ ব্যর্থ" });
      } else {
        window.dispatchEvent(new CustomEvent("homepage-config-updated", { detail: newConfig }));
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
      toast.error("নেটওয়ার্ক সমস্যা: সার্ভারে পরিবর্তন সংরক্ষিত হয়নি।", { title: "সংযোগ বিচ্ছিন্ন" });
    }
  };

  const handleSaveStepModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepTitleEn.trim() && !stepTitleBn.trim()) {
      toast.warning("ধাপের অন্তত একটি শিরোনাম প্রদান করুন");
      return;
    }

    const newStepItem: ProcessStepItem = {
      iconEn: stepIcon || "🌱",
      titleEn: stepTitleEn.trim(),
      titleBn: stepTitleBn.trim() || stepTitleEn.trim(),
      descEn: stepDescEn.trim(),
      descBn: stepDescBn.trim() || stepDescEn.trim(),
      image: stepImage.trim() || "/hero_plants.png",
    };

    const newSteps =
      editingStepIndex === null
        ? [...config.process.steps, newStepItem]
        : config.process.steps.map((s, i) => (i === editingStepIndex ? newStepItem : s));

    const updatedConfig: HomepageConfig = {
      ...config,
      process: {
        ...config.process,
        steps: newSteps,
      },
    };

    setConfig(updatedConfig);
    setIsStepModalOpen(false);

    if (editingStepIndex === null) {
      toast.success("নতুন ধাপ যুক্ত হয়েছে এবং স্বয়ংক্রিয়ভাবে সেভ হয়েছে! ✨", { title: "ধাপ যোগ হয়েছে" });
    } else {
      toast.success("ধাপের তথ্য আপডেট হয়েছে এবং স্বয়ংক্রিয়ভাবে সেভ হয়েছে! 🌿", { title: "ধাপ হালনাগাদ" });
    }
    await persistConfig(updatedConfig);
  };

  const handleMoveStep = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.process.steps.length) return;

    const newSteps = [...config.process.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    const updatedConfig: HomepageConfig = {
      ...config,
      process: {
        ...config.process,
        steps: newSteps,
      },
    };

    setConfig(updatedConfig);
    toast.success("ধাপের ক্রম পরিবর্তন ও সেভ করা হয়েছে ↕️");
    await persistConfig(updatedConfig);
  };

  const handleDeleteStepConfirm = async () => {
    if (deleteStepIndex === null) return;
    const deletedStep = config.process.steps[deleteStepIndex];
    const newSteps = config.process.steps.filter((_, i) => i !== deleteStepIndex);

    const updatedConfig: HomepageConfig = {
      ...config,
      process: {
        ...config.process,
        steps: newSteps,
      },
    };

    setConfig(updatedConfig);
    setDeleteStepIndex(null);
    toast.info(`"${deletedStep?.titleEn || deletedStep?.titleBn || 'ধাপ'}" মুছে ফেলা হয়েছে এবং সেভ হয়েছে।`, { title: "মুছে ফেলা হয়েছে" });
    await persistConfig(updatedConfig);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-500">লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full font-sans">
      <ToastContainer position="top-right" />

      {/* ── TOP HEADER & SAVE ACTION ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
            🏠
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">হোমপেজ ও সেকশন কন্ট্রোলার</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              "A Thoughtful Journey", সেকশন ক্রম, ব্যানার এবং স্টুডিও লাইফ কনটেন্ট কাস্টমাইজ করুন
            </p>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white px-7 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md hover:shadow-lg min-h-[44px]"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>সেভ হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>পরিবর্তন সেভ করুন</span>
            </>
          )}
        </button>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "process", label: "📐 A Thoughtful Journey (Process)" },
          { key: "sections", label: "📋 Section Order & Dynamic Sizes" },
          { key: "manifesto", label: "✨ Manifesto Text" },
          { key: "campaign", label: "📣 Campaign Banner" },
          { key: "studioLife", label: "🌱 Studio Life & Culture" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30"
                : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-500 hover:text-emerald-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          SUB-TAB 1: PROCESS ("A THOUGHTFUL JOURNEY") FULL ORGANIZED MANAGER
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "process" && (
        <div className="space-y-6">
          {/* Section Hero Banner */}
          <div className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-mono font-bold">
                  📐 Design & Delivery Stages
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight">
                  A Thoughtful Journey — কার্যপদ্ধতি ধাপসমূহ
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  হোমপেজের 'A Thoughtful Journey' সেকশনের ধাপগুলো নিজের ইচ্ছামতো সাজান, নতুন ছবি ও বিবরণ দিন অথবা প্রয়োজনমতো মুছে ফেলুন।
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={openAddStepModal}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <span>➕</span>
                  <span>নতুন ধাপ যোগ করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section Titles & Headlines Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
              <span>০১</span>
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>সেকশন শিরোনাম ও বাম কলামের বিবরণ (Headings & Context)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  সেকশন শিরোনাম (Top Title - English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A Thoughtful Journey"
                  value={config.process.titleEn || ""}
                  onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, titleEn: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  সেকশন শিরোনাম (Top Title - বাংলা)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আমাদের কার্যপদ্ধতি"
                  value={config.process.titleBn || ""}
                  onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, titleBn: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  বাম কলামের মূল হেডলাইন (Headline - English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A Thoughtful Journey to Transformative Solutions"
                  value={config.process.headlineEn || ""}
                  onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, headlineEn: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  বাম কলামের মূল হেডলাইন (Headline - বাংলা)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: টেকসই ও আধুনিক সমাধানের সুপরিকল্পিত যাত্রা"
                  value={config.process.headlineBn || ""}
                  onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, headlineBn: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  বাম কলামের বিবরণী (Description - English)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ensuring highest architectural standards, native plant health..."
                  value={config.process.descEn || ""}
                  onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, descEn: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  বাম কলামের বিবরণী (Description - বাংলা)
                </label>
                <textarea
                  rows={2}
                  placeholder="প্রাথমিক ভাবনা থেকে চূড়ান্ত বাস্তবায়ন পর্যন্ত প্রতিটি ধাপে..."
                  value={config.process.descBn || ""}
                  onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, descBn: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Interactive Steps List Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  <span>০২</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>কার্যপদ্ধতির ধাপসমূহ ({config.process.steps.length}টি ধাপ সক্রিয়)</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  ক্রম পরিবর্তন করতে ▲ / ▼ চাপুন · এডিট করতে পপআপ মোডাল বাটন ব্যবহার করুন
                </p>
              </div>

              <button
                type="button"
                onClick={openAddStepModal}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                <span>➕</span>
                <span>নতুন ধাপ যোগ</span>
              </button>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.process.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 border border-stone-200/90 hover:border-emerald-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Thumbnail Image */}
                      <div className="w-16 h-14 rounded-xl bg-stone-200 overflow-hidden border border-stone-300 relative shrink-0">
                        <img
                          src={step.image || "/hero_plants.png"}
                          alt={step.titleEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/hero_plants.png";
                          }}
                        />
                      </div>

                      {/* Titles & Icon */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            ধাপ #{idx + 1}
                          </span>
                          <span className="text-sm">{step.iconEn || "🌱"}</span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm mt-1 truncate">
                          {step.titleEn}
                        </h4>
                        {step.titleBn && (
                          <p className="text-xs text-emerald-800 font-medium truncate mt-0.5">
                            {step.titleBn}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Up / Down Reorder */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStep(idx, "up")}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 flex items-center justify-center text-[10px] disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors"
                        title="উপরে নিন"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.process.steps.length - 1}
                        onClick={() => handleMoveStep(idx, "down")}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 flex items-center justify-center text-[10px] disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors"
                        title="নিচে নিন"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-100">
                    {step.descBn || step.descEn || "কোনো বিবরণ প্রদান করা হয়নি।"}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/60">
                    <button
                      type="button"
                      onClick={() => openEditStepModal(idx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-stone-200 hover:border-emerald-300 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-all min-h-[36px]"
                    >
                      <span>✏️</span>
                      <span>এডিট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteStepIndex(idx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-stone-200 hover:border-rose-300 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-all min-h-[36px]"
                    >
                      <span>🗑️</span>
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: SECTIONS DND ── */}
      {activeTab === "sections" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-800">সেকশন ক্রম, উইডথ ও গ্রিড সাইজিং কন্ট্রোল</h3>
              <p className="text-xs text-stone-400 mt-0.5">ড্র্যাগ করে সাজান · প্রতিটি সেকশনের সাইজ ও কলাম ইচ্ছামতো কাস্টমাইজ করুন</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              ৮টি সেকশন অ্যাক্টিভ
            </span>
          </div>

          <SortableList
            items={config.sections.map((s) => ({ ...s }))}
            onReorder={reorderSections}
            renderItem={(item, dragHandleProps, isDragging) => (
              <div className={`flex flex-col md:flex-row md:items-center gap-4 p-4 bg-stone-50 rounded-2xl border transition-all ${isDragging ? "border-emerald-400 shadow-lg bg-emerald-50" : "border-stone-200 hover:border-stone-300"}`}>
                <div className="flex items-center gap-3 flex-1">
                  <DragHandle dragHandleProps={dragHandleProps} />
                  <span className="text-xl">{item.label.split(" ")[0]}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-stone-800">{item.label.substring(item.label.indexOf(" ") + 1)}</span>
                    <span className="text-[11px] text-stone-400">ID: {item.id} · অবস্থান #{item.order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 font-medium">উইডথ:</span>
                    <select
                      value={item.width || "contained"}
                      onChange={(e) => updateSectionSize(item.id, e.target.value as any)}
                      className="text-xs font-semibold text-stone-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="full">ফুল স্ক্রিন (Full)</option>
                      <option value="contained">বক্সড (Container)</option>
                      <option value="compact">কমপ্যাক্ট (Compact)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 font-medium">কলাম:</span>
                    <select
                      value={item.columns || 3}
                      onChange={(e) => updateSectionColumns(item.id, parseInt(e.target.value) as any)}
                      className="text-xs font-semibold text-stone-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value={1}>১ কলাম (Hero)</option>
                      <option value={2}>২ কলাম (Split)</option>
                      <option value={3}>৩ কলাম (Standard)</option>
                      <option value={4}>৪ কলাম (Compact Grid)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-400 font-medium">স্পেসিং:</span>
                    <select
                      value={item.padding || "normal"}
                      onChange={(e) => updateSectionPadding(item.id, e.target.value as any)}
                      className="text-xs font-semibold text-stone-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="none">জিরো (0px)</option>
                      <option value="small">কম (Small)</option>
                      <option value="normal">স্ট্যান্ডার্ড (Normal)</option>
                      <option value="large">প্রশস্ত (Large)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                    <button
                      onClick={() => toggleSection(item.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${item.visible ? "bg-emerald-500" : "bg-stone-300"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.visible ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                    <span className={`text-xs font-bold ${item.visible ? "text-emerald-600" : "text-stone-400"}`}>
                      {item.visible ? "অন" : "অফ"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* ── SUB-TAB 3: MANIFESTO ── */}
      {activeTab === "manifesto" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-800">✨ Animated Manifesto টেক্সট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">English Text</label>
              <input
                type="text"
                value={config.manifesto.lineEn}
                onChange={(e) => setConfig((p) => ({ ...p, manifesto: { ...p.manifesto, lineEn: e.target.value } }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">বাংলা টেক্সট</label>
              <input
                type="text"
                value={config.manifesto.lineBn}
                onChange={(e) => setConfig((p) => ({ ...p, manifesto: { ...p.manifesto, lineBn: e.target.value } }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="mt-4 bg-black rounded-2xl p-8 text-center">
            <p className="text-white/40 text-xs tracking-widest mb-2 uppercase">Preview</p>
            <h2 className="text-white text-2xl font-black tracking-wider uppercase">{config.manifesto.lineEn}</h2>
            <p className="text-white/60 text-sm mt-1">{config.manifesto.lineBn}</p>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 4: CAMPAIGN ── */}
      {activeTab === "campaign" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-800">📣 Campaign Banner Text</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">English Text</label>
              <textarea
                rows={3}
                value={config.campaign.textEn}
                onChange={(e) => setConfig((p) => ({ ...p, campaign: { ...p.campaign, textEn: e.target.value } }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">বাংলা টেক্সট</label>
              <textarea
                rows={3}
                value={config.campaign.textBn}
                onChange={(e) => setConfig((p) => ({ ...p, campaign: { ...p.campaign, textBn: e.target.value } }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 5: STUDIO LIFE ── */}
      {activeTab === "studioLife" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
          <h3 className="font-bold text-stone-800">🌱 স্টুডিও লাইফ ও কালচার সেকশন এডিটর</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">Title (English)</label>
              <input
                type="text"
                value={config.studioLife?.titleEn || ""}
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    studioLife: { ...p.studioLife!, titleEn: e.target.value },
                  }))
                }
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">Title (বাংলা)</label>
              <input
                type="text"
                value={config.studioLife?.titleBn || ""}
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    studioLife: { ...p.studioLife!, titleBn: e.target.value },
                  }))
                }
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">Background Image URL</label>
            <input
              type="text"
              value={config.studioLife?.image || ""}
              onChange={(e) =>
                setConfig((p) => ({
                  ...p,
                  studioLife: { ...p.studioLife!, image: e.target.value },
                }))
              }
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          POPUP MODAL: ADD / EDIT PROCESS STEP
      ══════════════════════════════════════════════════════════════════════════ */}
      {isStepModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={() => setIsStepModalOpen(false)} />

          <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
                  {editingStepIndex !== null ? "✏️" : "✨"}
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                    {editingStepIndex !== null ? `ধাপ সম্পাদনা: #${editingStepIndex + 1}` : "নতুন প্রসেস ধাপ যোগ করুন"}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    ধাপের ছবি, বাংলা-ইংরেজি নাম ও বিবরণ পূরণ করে সেভ করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStepModalOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form id="step-modal-form" onSubmit={handleSaveStepModal} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Icon / Emoji Input & Presets */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  আইকন ইমোজি
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stepIcon}
                    onChange={(e) => setStepIcon(e.target.value)}
                    className="w-16 text-center border border-stone-200 rounded-xl px-2 py-2 text-xl focus:outline-none focus:border-emerald-600"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_STEP_ICONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setStepIcon(emoji)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-transform active:scale-90 ${
                          stepIcon === emoji
                            ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30 scale-110"
                            : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    ধাপের নাম (English Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Define Problem & Site Survey"
                    value={stepTitleEn}
                    onChange={(e) => setStepTitleEn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    ধাপের নাম (বাংলা শিরোনাম)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সমস্যা ও সাইট বিশ্লেষণ"
                    value={stepTitleBn}
                    onChange={(e) => setStepTitleBn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    বিবরণী (English Description)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Connecting with the client to understand requirements..."
                    value={stepDescEn}
                    onChange={(e) => setStepDescEn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    বিবরণী (বাংলা বিবরণ)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ক্লায়েন্টের নির্দিষ্ট চাহিদা ও সাইটের চ্যালেঞ্জ পর্যবেক্ষণ..."
                    value={stepDescBn}
                    onChange={(e) => setStepDescBn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                  />
                </div>
              </div>

              {/* Step Image */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <label className="text-xs font-semibold text-stone-700 block">
                  ধাপের ছবি (Step Image)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  {/* Thumbnail */}
                  <div className="w-28 h-20 rounded-xl bg-stone-200 overflow-hidden border border-stone-300 shrink-0">
                    <img
                      src={stepImage || "/hero_plants.png"}
                      alt="Step preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/hero_plants.png";
                      }}
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <CloudinaryUploader
                      value={stepImage}
                      onUpload={(url) => setStepImage(url)}
                      label="📁 ডিভাইস বা ক্লাউডিনারি থেকে ছবি আপলোড"
                    />
                    <input
                      type="text"
                      placeholder="অথবা সরাসরি URL: https://... বা /step_sample.jpg"
                      value={stepImage}
                      onChange={(e) => setStepImage(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 min-h-[40px]"
                    />
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-[11px] text-stone-500 font-medium">প্রিসেট ছবি:</span>
                      {[
                        { label: "🌱 বোটানিক্যাল ১", url: "/hero_plants.png" },
                        { label: "🌿 বোটানিক্যাল ২", url: "/featured_plant.png" },
                        { label: "📸 কাস্টম ছবি", url: "/step_sample.jpg" },
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setStepImage(preset.url)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            stepImage === preset.url
                              ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                              : "bg-white text-stone-600 border-stone-200 hover:border-emerald-500"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsStepModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                form="step-modal-form"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[44px]"
              >
                {editingStepIndex !== null ? "💾 ধাপ সংরক্ষণ করুন" : "➕ ধাপ যুক্ত করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRMATION MODAL FOR STEP DELETION ── */}
      {deleteStepIndex !== null && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteStepIndex(null)}
          onConfirm={handleDeleteStepConfirm}
          title="প্রসেস ধাপ মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে ধাপ #${deleteStepIndex + 1} ("${config.process.steps[deleteStepIndex]?.titleEn || config.process.steps[deleteStepIndex]?.titleBn}") মুছে ফেলতে চান?`}
          itemName={config.process.steps[deleteStepIndex]?.titleEn}
          confirmLabel="হ্যাঁ, মুছে ফেলুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
