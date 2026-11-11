"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { toast, ToastContainer } from "@/components/shared/Toast";
import {
  AboutPageConfig,
  AboutMilestoneItem,
  AboutTeamMember,
  AboutStatItem,
  DEFAULT_ABOUT_CONFIG,
} from "@/types/about";

type SubTabKey = "hero" | "story" | "stats" | "milestones" | "team" | "cta";

export default function AboutStudioTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("hero");
  const [config, setConfig] = useState<AboutPageConfig>(DEFAULT_ABOUT_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Milestone Modal State
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState<AboutMilestoneItem>({
    id: "",
    year: "",
    titleEn: "",
    titleBn: "",
    descEn: "",
    descBn: "",
  });

  // Team Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState<AboutTeamMember>({
    id: "",
    nameEn: "",
    nameBn: "",
    roleEn: "",
    roleBn: "",
    bioEn: "",
    bioBn: "",
    photo: "",
    icon: "👨‍💼",
  });

  // Delete Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Fetch Config on mount
  useEffect(() => {
    fetchAboutConfig();

    const checkSub = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const s = params.get("sub");
      if (s && ["hero", "story", "stats", "milestones", "team", "cta"].includes(s)) {
        setActiveSubTab(s as SubTabKey);
      }
    };
    checkSub();

    const handleSubNav = (e: any) => {
      if (e.detail?.sub && ["hero", "story", "stats", "milestones", "team", "cta"].includes(e.detail.sub)) {
        setActiveSubTab(e.detail.sub as SubTabKey);
      }
    };
    window.addEventListener("admin-navigate-subtab", handleSubNav);
    return () => window.removeEventListener("admin-navigate-subtab", handleSubNav);
  }, []);

  const fetchAboutConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/settings?key=about_page_config&_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.value) {
          // Merge deep with default to ensure no missing keys
          setConfig({
            hero: { ...DEFAULT_ABOUT_CONFIG.hero, ...(data.value.hero || {}) },
            storySection: { ...DEFAULT_ABOUT_CONFIG.storySection, ...(data.value.storySection || {}) },
            statsSection: { ...DEFAULT_ABOUT_CONFIG.statsSection, ...(data.value.statsSection || {}) },
            milestonesSection: { ...DEFAULT_ABOUT_CONFIG.milestonesSection, ...(data.value.milestonesSection || {}) },
            teamSection: { ...DEFAULT_ABOUT_CONFIG.teamSection, ...(data.value.teamSection || {}) },
            ctaSection: { ...DEFAULT_ABOUT_CONFIG.ctaSection, ...(data.value.ctaSection || {}) },
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch about config:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig?: AboutPageConfig) => {
    const dataToSave = newConfig || config;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "about_page_config",
          value: dataToSave,
        }),
      });

      if (res.ok) {
        toast.success("স্টুডিও পরিচিতি পেজের তথ্য সফলভাবে সেভ হয়েছে!");
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("about-config-updated", { detail: dataToSave })
          );
        }
      } else {
        toast.error("সেভ করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
    } catch {
      toast.error("নেটওয়ার্ক সমস্যার কারণে সেভ হয়নি।");
    } finally {
      setSaving(false);
    }
  };

  // ── Milestone CRUD Handlers ──
  const openAddMilestoneModal = () => {
    setMilestoneForm({
      id: `ms-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      titleEn: "",
      titleBn: "",
      descEn: "",
      descBn: "",
    });
    setEditingMilestoneId(null);
    setIsMilestoneModalOpen(true);
  };

  const openEditMilestoneModal = (item: AboutMilestoneItem) => {
    setMilestoneForm({ ...item });
    setEditingMilestoneId(item.id);
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestoneModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.year.trim() || !milestoneForm.titleEn.trim()) {
      toast.error("সাল এবং শিরোনাম অবশ্যই পূরণ করুন");
      return;
    }

    let updatedItems: AboutMilestoneItem[];
    if (editingMilestoneId) {
      updatedItems = config.milestonesSection.items.map((m) =>
        m.id === editingMilestoneId ? milestoneForm : m
      );
    } else {
      updatedItems = [...config.milestonesSection.items, milestoneForm];
    }

    const updatedConfig: AboutPageConfig = {
      ...config,
      milestonesSection: {
        ...config.milestonesSection,
        items: updatedItems,
      },
    };

    setConfig(updatedConfig);
    setIsMilestoneModalOpen(false);
    saveConfig(updatedConfig);
  };

  const handleDeleteMilestone = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: "মাইলস্টোন মুছে ফেলুন",
      message: `আপনি কি নিশ্চিত যে "${title}" মাইলস্টোনটি চিরতরে মুছে ফেলতে চান?`,
      onConfirm: () => {
        const updatedItems = config.milestonesSection.items.filter((m) => m.id !== id);
        const updatedConfig = {
          ...config,
          milestonesSection: { ...config.milestonesSection, items: updatedItems },
        };
        setConfig(updatedConfig);
        setConfirmModal((p) => ({ ...p, isOpen: false }));
        saveConfig(updatedConfig);
        toast.success("মাইলস্টোনটি মুছে ফেলা হয়েছে");
      },
    });
  };

  // ── Team CRUD Handlers ──
  const openAddTeamModal = () => {
    setTeamForm({
      id: `tm-${Date.now()}`,
      nameEn: "",
      nameBn: "",
      roleEn: "",
      roleBn: "",
      bioEn: "",
      bioBn: "",
      photo: "",
      icon: "👨‍💼",
    });
    setEditingTeamMemberId(null);
    setIsTeamModalOpen(true);
  };

  const openEditTeamModal = (member: AboutTeamMember) => {
    setTeamForm({ ...member });
    setEditingTeamMemberId(member.id);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.nameEn.trim() || !teamForm.roleEn.trim()) {
      toast.error("সদস্যের নাম ও পদবী অবশ্যই প্রদান করুন");
      return;
    }

    let updatedMembers: AboutTeamMember[];
    if (editingTeamMemberId) {
      updatedMembers = config.teamSection.members.map((m) =>
        m.id === editingTeamMemberId ? teamForm : m
      );
    } else {
      updatedMembers = [...config.teamSection.members, teamForm];
    }

    const updatedConfig: AboutPageConfig = {
      ...config,
      teamSection: {
        ...config.teamSection,
        members: updatedMembers,
      },
    };

    setConfig(updatedConfig);
    setIsTeamModalOpen(false);
    saveConfig(updatedConfig);
  };

  const handleDeleteTeamMember = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "টিম সদস্য মুছে ফেলুন",
      message: `আপনি কি নিশ্চিত যে "${name}" কে নেতৃত্ব তালিকা থেকে মুছে ফেলতে চান?`,
      onConfirm: () => {
        const updatedMembers = config.teamSection.members.filter((m) => m.id !== id);
        const updatedConfig = {
          ...config,
          teamSection: { ...config.teamSection, members: updatedMembers },
        };
        setConfig(updatedConfig);
        setConfirmModal((p) => ({ ...p, isOpen: false }));
        saveConfig(updatedConfig);
        toast.success("টিম সদস্য অপসারিত হয়েছে");
      },
    });
  };

  // ── Stats Handlers ──
  const handleUpdateStat = (index: number, field: keyof AboutStatItem, val: string) => {
    const updated = config.statsSection.items.map((item, idx) =>
      idx === index ? { ...item, [field]: val } : item
    );
    setConfig({
      ...config,
      statsSection: { ...config.statsSection, items: updated },
    });
  };

  const handleAddStatItem = () => {
    const newItem: AboutStatItem = {
      id: `stat-${Date.now()}`,
      value: "100+",
      labelEn: "New Milestone",
      labelBn: "নতুন অর্জন",
    };
    setConfig({
      ...config,
      statsSection: {
        ...config.statsSection,
        items: [...config.statsSection.items, newItem],
      },
    });
  };

  const handleDeleteStatItem = (index: number) => {
    const updated = config.statsSection.items.filter((_, idx) => idx !== index);
    setConfig({
      ...config,
      statsSection: { ...config.statsSection, items: updated },
    });
  };

  if (loading) {
    return (
      <div className="bg-white/80 border border-[#D6D2C4] rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#2B4D33]/30 border-t-[#2B4D33] rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#75787B]">স্টুডিও পরিচিতি পেজের কনফিগারেশন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <ToastContainer />

      {/* ── Top Header Banner ── */}
      <div className="bg-[#18221A] text-[#E4E2D7] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold mb-2">
            <span>📖</span> স্টুডিও পরিচিতি ও ইতিহাস • About Us Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            About Studio & Timeline Manager
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xl leading-relaxed">
            ওয়েবসাইটের <code className="text-emerald-400">/about</code> পেজের প্রতিটি লেখা, ছবি, গল্প, ভিশন-মিশন, পরিসংখ্যান, মাইলস্টোন ও লিডারশিপ টিম অ্যাডমিন প্যানেল থেকে এডিট ও ডিলিট করুন।
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Open /about in new tab"
          >
            <span>🌐</span>
            <span>লাইভ পেজ দেখুন</span>
            <span className="text-[10px]">➔</span>
          </Link>

          <button
            type="button"
            onClick={() => saveConfig()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>সকল পরিবর্তন সেভ করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Sub-Tab Navigation Bar ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { key: "hero", label: "🏢 হিরো ও ভূমিকা", count: config.hero.visible ? "অন" : "অফ" },
          { key: "story", label: "📖 গল্প, ভিশন ও মিশন", count: config.storySection.visible ? "অন" : "অফ" },
          { key: "stats", label: `📊 পরিসংখ্যান (${config.statsSection.items.length})`, count: config.statsSection.visible ? "অন" : "অফ" },
          { key: "milestones", label: `⏳ মাইলস্টোন টাইমলাইন (${config.milestonesSection.items.length})`, count: config.milestonesSection.visible ? "অন" : "অফ" },
          { key: "team", label: `👥 লিডারশিপ টিম (${config.teamSection.members.length})`, count: config.teamSection.visible ? "অন" : "অফ" },
          { key: "cta", label: "📣 সিটিএ ব্যানার", count: config.ctaSection.visible ? "অন" : "অফ" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSubTab(tab.key as SubTabKey)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeSubTab === tab.key
                ? "bg-[#2B4D33] text-white shadow-sm"
                : "bg-white hover:bg-[#F2EFE9] text-[#121813] border border-[#D6D2C4]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                tab.count === "অন"
                  ? "bg-emerald-500/20 text-emerald-800"
                  : "bg-black/10 text-stone-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── 1. HERO SECTION ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "hero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D6D2C4] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E2D7]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121813]">🏢 হিরো ব্যানার ও শীর্ষ পরিচিতি</h3>
              <p className="text-xs text-[#75787B] mt-0.5">/about পেজের সবচেয়ে উপরে থাকা মূল শিরোনাম ও ভূমিকা অনুচ্ছেদ</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#D6D2C4]">
              <input
                type="checkbox"
                checked={config.hero.visible}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, visible: e.target.checked } })
                }
                className="w-4 h-4 accent-[#2B4D33] rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-[#121813]">সেকশন দৃশ্যমান (Visible)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                ট্যাগ বা ব্যাজ (English)
              </label>
              <input
                type="text"
                value={config.hero.badgeEn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, badgeEn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                ট্যাগ বা ব্যাজ (বাংলা)
              </label>
              <input
                type="text"
                value={config.hero.badgeBn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, badgeBn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                প্রধান শিরোনাম (Page Title - EN)
              </label>
              <input
                type="text"
                value={config.hero.titleEn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, titleEn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs font-semibold text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                প্রধান শিরোনাম (বাংলা)
              </label>
              <input
                type="text"
                value={config.hero.titleBn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, titleBn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs font-semibold text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                সাবটাইটেল (Subtitle - EN)
              </label>
              <input
                type="text"
                value={config.hero.subtitleEn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, subtitleEn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                সাবটাইটেল (বাংলা)
              </label>
              <input
                type="text"
                value={config.hero.subtitleBn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, subtitleBn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                ভূমিকা প্যারাগ্রাফ (Description - EN)
              </label>
              <textarea
                rows={3}
                value={config.hero.descriptionEn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, descriptionEn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] resize-none leading-relaxed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                ভূমিকা প্যারাগ্রাফ (বাংলা)
              </label>
              <textarea
                rows={3}
                value={config.hero.descriptionBn}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, descriptionBn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] resize-none leading-relaxed"
              />
            </div>

            <div className="md:col-span-2">
              <CloudinaryUploader
                label="কভার বা ব্যাকগ্রাউন্ড ইমেজ (Optional Cover Image)"
                folder="about"
                value={config.hero.coverImage || ""}
                onUpload={(url) =>
                  setConfig({ ...config, hero: { ...config.hero, coverImage: url } })
                }
                previewType="image"
              />
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── 2. STORY, VISION & MISSION ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "story" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D6D2C4] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E2D7]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121813]">📖 আমাদের গল্প, ভিশন ও মিশন</h3>
              <p className="text-xs text-[#75787B] mt-0.5">স্টুডিওর উৎপত্তি ইতিহাস, লক্ষ্য (Mission) এবং দীর্ঘমেয়াদি দূরদৃষ্টি (Vision)</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#D6D2C4]">
              <input
                type="checkbox"
                checked={config.storySection.visible}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, visible: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-[#2B4D33] rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-[#121813]">সেকশন দৃশ্যমান</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                গল্প সেকশন হেডিং (EN)
              </label>
              <input
                type="text"
                value={config.storySection.storyTitleEn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, storyTitleEn: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                গল্প সেকশন হেডিং (বাংলা)
              </label>
              <input
                type="text"
                value={config.storySection.storyTitleBn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, storyTitleBn: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                আমাদের গল্প (Our Story - English)
              </label>
              <textarea
                rows={5}
                value={config.storySection.storyEn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, storyEn: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] resize-none leading-relaxed"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                আমাদের গল্প (বাংলা)
              </label>
              <textarea
                rows={5}
                value={config.storySection.storyBn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, storyBn: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] resize-none leading-relaxed"
              />
            </div>

            {/* Mission Card Fields */}
            <div className="p-4 bg-[#F7F9F7] rounded-2xl border border-emerald-500/15 flex flex-col gap-3">
              <span className="text-xs font-mono font-bold text-emerald-800">🎯 মিশন (Our Mission)</span>
              <div>
                <label className="text-[11px] font-mono font-semibold text-[#121813] block mb-1">মিশন শিরোনাম (EN / BN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Mission Title (EN)"
                    value={config.storySection.missionTitleEn}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        storySection: { ...config.storySection, missionTitleEn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="মিশন শিরোনাম (BN)"
                    value={config.storySection.missionTitleBn}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        storySection: { ...config.storySection, missionTitleBn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                  />
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="Mission statement in English..."
                value={config.storySection.missionEn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, missionEn: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs resize-none"
              />
              <textarea
                rows={3}
                placeholder="মিশনের বিবরণ বাংলায়..."
                value={config.storySection.missionBn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, missionBn: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs resize-none"
              />
            </div>

            {/* Vision Card Fields */}
            <div className="p-4 bg-[#F7F9F7] rounded-2xl border border-emerald-500/15 flex flex-col gap-3">
              <span className="text-xs font-mono font-bold text-emerald-800">👁️ ভিশন (Our Vision)</span>
              <div>
                <label className="text-[11px] font-mono font-semibold text-[#121813] block mb-1">ভিশন শিরোনাম (EN / BN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Vision Title (EN)"
                    value={config.storySection.visionTitleEn}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        storySection: { ...config.storySection, visionTitleEn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="ভিশন শিরোনাম (BN)"
                    value={config.storySection.visionTitleBn}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        storySection: { ...config.storySection, visionTitleBn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                  />
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="Vision statement in English..."
                value={config.storySection.visionEn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, visionEn: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs resize-none"
              />
              <textarea
                rows={3}
                placeholder="ভিশনের বিবরণ বাংলায়..."
                value={config.storySection.visionBn}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storySection: { ...config.storySection, visionBn: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── 3. STATS SECTION ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "stats" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D6D2C4] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E2D7]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121813]">📊 প্রধান পরিসংখ্যান ও অর্জন</h3>
              <p className="text-xs text-[#75787B] mt-0.5">প্রকল্প সম্পন্ন, ক্লায়েন্ট ও অভিজ্ঞতার সংখ্যাবাচক অর্জন</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#D6D2C4]">
                <input
                  type="checkbox"
                  checked={config.statsSection.visible}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      statsSection: { ...config.statsSection, visible: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-[#2B4D33] rounded cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#121813]">সেকশন দৃশ্যমান</span>
              </label>

              <button
                type="button"
                onClick={handleAddStatItem}
                className="px-3.5 py-1.5 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>+</span>
                <span>নতুন স্ট্যাটাস যোগ</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.statsSection.items.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className="p-4 bg-[#FAF9F5] border border-[#D6D2C4] rounded-2xl flex flex-col gap-3 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteStatItem(idx)}
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  ✕
                </button>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#75787B] block mb-1">
                    মান / সংখ্যা (Value)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-base font-bold text-center text-[#2B4D33] focus:outline-none focus:border-[#2B4D33]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#75787B] block mb-1">
                    লেবেল (English)
                  </label>
                  <input
                    type="text"
                    value={stat.labelEn}
                    onChange={(e) => handleUpdateStat(idx, "labelEn", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#75787B] block mb-1">
                    লেবেল (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={stat.labelBn}
                    onChange={(e) => handleUpdateStat(idx, "labelBn", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── 4. MILESTONES TIMELINE (FULL CRUD) ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "milestones" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D6D2C4] shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E2D7] gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121813]">⏳ কোম্পানি মাইলস্টোন ও টাইমলাইন</h3>
              <p className="text-xs text-[#75787B] mt-0.5">বছরের পর বছর কোম্পানির গুরুত্বপূর্ণ মাইলস্টোন, অর্জন ও ইতিহাস</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#D6D2C4]">
                <input
                  type="checkbox"
                  checked={config.milestonesSection.visible}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      milestonesSection: { ...config.milestonesSection, visible: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-[#2B4D33] rounded cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#121813]">সেকশন দৃশ্যমান</span>
              </label>

              <button
                type="button"
                onClick={openAddMilestoneModal}
                className="px-4 py-2 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>+</span>
                <span>নতুন মাইলস্টোন যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Section Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#D6D2C4]">
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                টাইমলাইন সেকশন শিরোনাম (EN / BN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={config.milestonesSection.headingEn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      milestonesSection: { ...config.milestonesSection, headingEn: e.target.value },
                    })
                  }
                  placeholder="Heading (EN)"
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={config.milestonesSection.headingBn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      milestonesSection: { ...config.milestonesSection, headingBn: e.target.value },
                    })
                  }
                  placeholder="শিরোনাম (বাংলা)"
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                সাবটাইটেল (EN / BN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={config.milestonesSection.subheadingEn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      milestonesSection: { ...config.milestonesSection, subheadingEn: e.target.value },
                    })
                  }
                  placeholder="Subheading (EN)"
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={config.milestonesSection.subheadingBn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      milestonesSection: { ...config.milestonesSection, subheadingBn: e.target.value },
                    })
                  }
                  placeholder="সাবটাইটেল (বাংলা)"
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Milestone List */}
          <div className="flex flex-col gap-3">
            {config.milestonesSection.items.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF9F5] border border-dashed border-[#D6D2C4] rounded-2xl">
                <p className="text-xs font-mono text-[#75787B]">বর্তমানে কোনো মাইলস্টোন এন্ট্রি নেই। উপরের বাটনে ক্লিক করে নতুন মাইলস্টোন যোগ করুন।</p>
              </div>
            ) : (
              config.milestonesSection.items.map((m) => (
                <div
                  key={m.id}
                  className="p-4 sm:p-5 bg-[#FAF9F5] hover:bg-white border border-[#D6D2C4] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#2B4D33] text-white text-xs font-mono font-bold shrink-0">
                      {m.year}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#121813] flex items-center gap-2">
                        <span>{m.titleBn || m.titleEn}</span>
                        <span className="text-xs text-[#75787B] font-normal">({m.titleEn})</span>
                      </h4>
                      <p className="text-xs text-[#555] mt-1 line-clamp-2 leading-relaxed">
                        {m.descBn || m.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => openEditMilestoneModal(m)}
                      className="px-3 py-1.5 bg-white hover:bg-[#E4E2D7] border border-[#D6D2C4] text-[#121813] text-xs font-mono font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      ✏️ এডিট
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(m.id, m.titleBn || m.titleEn)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-mono font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      🗑️ মুছুন
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── 5. LEADERSHIP & TEAM SECTION (FULL CRUD) ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "team" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D6D2C4] shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E2D7] gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121813]">👥 নেতৃত্ব ও টিম মেম্বার্স (Leadership Team)</h3>
              <p className="text-xs text-[#75787B] mt-0.5">/about পেজে প্রদর্শিত মূল নির্বাহী ও বিশেষজ্ঞ দল</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#D6D2C4]">
                <input
                  type="checkbox"
                  checked={config.teamSection.visible}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      teamSection: { ...config.teamSection, visible: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-[#2B4D33] rounded cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#121813]">সেকশন দৃশ্যমান</span>
              </label>

              <button
                type="button"
                onClick={openAddTeamModal}
                className="px-4 py-2 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>+</span>
                <span>নতুন টিম সদস্য যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Section Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#D6D2C4]">
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                টিম সেকশন শিরোনাম (EN / BN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={config.teamSection.headingEn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      teamSection: { ...config.teamSection, headingEn: e.target.value },
                    })
                  }
                  placeholder="Meet Our Leadership"
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={config.teamSection.headingBn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      teamSection: { ...config.teamSection, headingBn: e.target.value },
                    })
                  }
                  placeholder="আমাদের নেতৃত্ব ও বিশেষজ্ঞ দল"
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                সাবটাইটেল বিবরণ (EN / BN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={config.teamSection.subheadingEn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      teamSection: { ...config.teamSection, subheadingEn: e.target.value },
                    })
                  }
                  placeholder="Subheading in English..."
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={config.teamSection.subheadingBn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      teamSection: { ...config.teamSection, subheadingBn: e.target.value },
                    })
                  }
                  placeholder="সাবটাইটেল বাংলায়..."
                  className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {config.teamSection.members.map((member) => (
              <div
                key={member.id}
                className="bg-[#FAF9F5] border border-[#D6D2C4] rounded-2xl p-5 flex flex-col items-center text-center relative group shadow-2xs hover:shadow-md transition-all"
              >
                {/* Photo or Icon */}
                <div className="w-18 h-18 rounded-full overflow-hidden bg-white border-2 border-[#2B4D33]/20 flex items-center justify-center text-3xl shadow-inner mb-3">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.nameEn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{member.icon || "👨‍💼"}</span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-[#121813]">{member.nameBn || member.nameEn}</h4>
                <p className="text-[11px] font-mono font-semibold text-[#2B4D33] mt-0.5">
                  {member.roleBn || member.roleEn}
                </p>
                <p className="text-xs text-[#75787B] mt-2 line-clamp-3 leading-relaxed">
                  {member.bioBn || member.bioEn}
                </p>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#D6D2C4]/60 w-full justify-center">
                  <button
                    type="button"
                    onClick={() => openEditTeamModal(member)}
                    className="px-3 py-1 bg-white hover:bg-[#E4E2D7] border border-[#D6D2C4] text-[#121813] text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    ✏️ এডিট
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTeamMember(member.id, member.nameBn || member.nameEn)}
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    🗑️ মুছুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── 6. CTA SECTION ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "cta" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D6D2C4] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E2D7]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121813]">📣 কল-টু-অ্যাকশন ব্যানার (Call To Action)</h3>
              <p className="text-xs text-[#75787B] mt-0.5">পেজের একেবারে নিচে ক্লায়েন্টদের যোগাযোগে উদ্বুদ্ধ করার গাঢ় সবুজ ব্যানার</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#D6D2C4]">
              <input
                type="checkbox"
                checked={config.ctaSection.visible}
                onChange={(e) =>
                  setConfig({ ...config, ctaSection: { ...config.ctaSection, visible: e.target.checked } })
                }
                className="w-4 h-4 accent-[#2B4D33] rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-[#121813]">সেকশন দৃশ্যমান</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                সিটিএ হেডিং (EN)
              </label>
              <input
                type="text"
                value={config.ctaSection.titleEn}
                onChange={(e) =>
                  setConfig({ ...config, ctaSection: { ...config.ctaSection, titleEn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                সিটিএ হেডিং (বাংলা)
              </label>
              <input
                type="text"
                value={config.ctaSection.titleBn}
                onChange={(e) =>
                  setConfig({ ...config, ctaSection: { ...config.ctaSection, titleBn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                সিটিএ বিবরণ (EN)
              </label>
              <textarea
                rows={3}
                value={config.ctaSection.descEn}
                onChange={(e) =>
                  setConfig({ ...config, ctaSection: { ...config.ctaSection, descEn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                সিটিএ বিবরণ (বাংলা)
              </label>
              <textarea
                rows={3}
                value={config.ctaSection.descBn}
                onChange={(e) =>
                  setConfig({ ...config, ctaSection: { ...config.ctaSection, descBn: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-xl text-xs resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                প্রথম বাটন (Primary Button EN / BN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Text EN"
                  value={config.ctaSection.primaryBtnTextEn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ctaSection: { ...config.ctaSection, primaryBtnTextEn: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D6D2C4] rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="টেক্সট বাংলা"
                  value={config.ctaSection.primaryBtnTextBn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ctaSection: { ...config.ctaSection, primaryBtnTextBn: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D6D2C4] rounded-lg text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Button link e.g. #estimate or /booking"
                value={config.ctaSection.primaryBtnLink}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ctaSection: { ...config.ctaSection, primaryBtnLink: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 mt-1.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#121813] block mb-1.5">
                দ্বিতীয় বাটন (Secondary Button EN / BN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Text EN"
                  value={config.ctaSection.secondaryBtnTextEn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ctaSection: { ...config.ctaSection, secondaryBtnTextEn: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D6D2C4] rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="টেক্সট বাংলা"
                  value={config.ctaSection.secondaryBtnTextBn}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ctaSection: { ...config.ctaSection, secondaryBtnTextBn: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D6D2C4] rounded-lg text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Button link e.g. /contact"
                value={config.ctaSection.secondaryBtnLink}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ctaSection: { ...config.ctaSection, secondaryBtnLink: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 mt-1.5 bg-[#FAF9F5] border border-[#D6D2C4] rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MILESTONE MODAL ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF9F5] border border-[#D6D2C4] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6D2C4]">
              <h3 className="font-serif font-bold text-base text-[#121813]">
                {editingMilestoneId ? "✏️ মাইলস্টোন এডিট করুন" : "➕ নতুন মাইলস্টোন যোগ করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMilestoneModal} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                  বছর বা সাল (Year) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026"
                  value={milestoneForm.year}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D6D2C4] rounded-xl text-xs font-bold text-[#2B4D33]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                    মাইলস্টোন শিরোনাম (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Milestone title in English"
                    value={milestoneForm.titleEn}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                    মাইলস্টোন শিরোনাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    placeholder="মাইলস্টোন শিরোনাম বাংলায়"
                    value={milestoneForm.titleBn}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, titleBn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                  মাইলস্টোন বিবরণ (English)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of what was achieved..."
                  value={milestoneForm.descEn}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, descEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D6D2C4] rounded-xl text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                  মাইলস্টোন বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={3}
                  placeholder="অর্জনের বিস্তারিত বিবরণ বাংলায়..."
                  value={milestoneForm.descBn}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, descBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D6D2C4] rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6D2C4]">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D6D2C4] text-[#121813] text-xs font-mono cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold cursor-pointer"
                >
                  {editingMilestoneId ? "সংরক্ষণ করুন" : "যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── TEAM MEMBER MODAL ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF9F5] border border-[#D6D2C4] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6D2C4]">
              <h3 className="font-serif font-bold text-base text-[#121813]">
                {editingTeamMemberId ? "✏️ টিম সদস্য এডিট করুন" : "➕ নতুন টিম সদস্য যোগ করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTeamModal} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                    নাম (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={teamForm.nameEn}
                    onChange={(e) => setTeamForm({ ...teamForm, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                    নাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. তানভীর আহমেদ"
                    value={teamForm.nameBn}
                    onChange={(e) => setTeamForm({ ...teamForm, nameBn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                    পদবী (Role / Title - EN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Founder & CEO"
                    value={teamForm.roleEn}
                    onChange={(e) => setTeamForm({ ...teamForm, roleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                    পদবী (বাংলা)
                  </label>
                  <input
                    type="text"
                    placeholder="প্রতিষ্ঠাতা ও প্রধান নির্বাহী"
                    value={teamForm.roleBn}
                    onChange={(e) => setTeamForm({ ...teamForm, roleBn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <CloudinaryUploader
                  label="সদস্যের ছবি (Photo Upload)"
                  folder="team"
                  value={teamForm.photo || ""}
                  onUpload={(url) => setTeamForm({ ...teamForm, photo: url })}
                  previewType="image"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                  সংক্ষিপ্ত পরিচয় ও অভিজ্ঞতা (English)
                </label>
                <textarea
                  rows={2}
                  placeholder="Experience in landscape design..."
                  value={teamForm.bioEn}
                  onChange={(e) => setTeamForm({ ...teamForm, bioEn: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#121813] block mb-1">
                  সংক্ষিপ্ত পরিচয় ও অভিজ্ঞতা (বাংলা)
                </label>
                <textarea
                  rows={2}
                  placeholder="ল্যান্ডস্কেপ নকশায় অভিজ্ঞতা..."
                  value={teamForm.bioBn}
                  onChange={(e) => setTeamForm({ ...teamForm, bioBn: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6D2C4]">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D6D2C4] text-[#121813] text-xs font-mono cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold cursor-pointer"
                >
                  {editingTeamMemberId ? "সংরক্ষণ করুন" : "যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Deletion Modal ── */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((p) => ({ ...p, isOpen: false }))}
      />
    </div>
  );
}
