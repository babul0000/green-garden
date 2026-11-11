"use client";

import React, { useState, useEffect } from "react";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import SortableList, { DragHandle } from "@/components/shared/SortableList";
import { StandaloneToast } from "@/components/shared/Toast";
import AboutStudioTab from "./AboutStudioTab";
import { emitSettingsSync } from "@/context/SiteConfigContext";
import { ContactBranch, DEFAULT_EXTENDED_CONTACT_CONFIG } from "@/types/cms";
import { BilingualInput } from "./studios/AdminStudioPrimitives";

type ActiveSection = "about" | "team" | "faq" | "contact" | "footer";

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  dept: string;
  photo: string;
  skills: string;
  experience: string;
  isPublic: boolean;
}

interface FaqItem {
  id: string;
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}

const EMPTY_MEMBER: Omit<TeamMember, "id"> = {
  name: "",
  designation: "",
  dept: "",
  photo: "",
  skills: "",
  experience: "",
  isPublic: true,
};

const EMPTY_FAQ: Omit<FaqItem, "id"> = {
  questionEn: "",
  questionBn: "",
  answerEn: "",
  answerBn: "",
};

const EMPTY_BRANCH: Omit<ContactBranch, "id"> = {
  cityBn: "",
  cityEn: "",
  titleBn: "",
  titleEn: "",
  addressBn: "",
  addressEn: "",
  phone: "",
  email: "",
  hoursBn: "শনি – বৃহস্পতি: সকাল ৯টা – সন্ধ্যা ৭টা",
  hoursEn: "Sat – Thu: 9:00 AM – 7:00 PM",
};

export default function ContentManagerTab() {
  const [active, setActive] = useState<ActiveSection>("about");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // ── Team State ──
  const [teamTitle, setTeamTitle] = useState({
    badgeEn: "Studio Architects & Arborists",
    badgeBn: "স্টুডিও আর্কিটেক্ট ও বোটানিস্ট টিম",
    titleEn: "Meet Our Expert Team",
    titleBn: "আমাদের বিশেষজ্ঞ দল",
    subtitleEn: "A multidisciplinary team of landscape architects and arborists.",
    subtitleBn: "দক্ষ ল্যান্ডস্কেপ আর্কিটেক্ট ও বৃক্ষ চিকিৎসকদের সমন্বয়ে আমাদের টিম।",
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberDraft, setMemberDraft] = useState<Omit<TeamMember, "id">>(EMPTY_MEMBER);

  // ── FAQ State ──
  const [faqTitle, setFaqTitle] = useState({
    badgeEn: "Knowledge Base • FAQ",
    badgeBn: "সাধারণ জিজ্ঞাসা",
    titleEn: "Frequently Asked Questions",
    titleBn: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
    subtitleEn: "Answers about rooftop gardens, drainage, costs and care.",
    subtitleBn: "ছাদবাগান, ড্রেইনেজ, খরচ ও পরিচর্যা বিষয়ক সাধারণ প্রশ্নের উত্তর।",
  });
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [faqDraft, setFaqDraft] = useState<Omit<FaqItem, "id">>(EMPTY_FAQ);

  // ── Contact State (with Dynamic Regional Branches) ──
  const [contact, setContact] = useState<any>(DEFAULT_EXTENDED_CONTACT_CONFIG);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchDraft, setBranchDraft] = useState<Omit<ContactBranch, "id">>(EMPTY_BRANCH);

  // ── Footer State ──
  const [footer, setFooter] = useState({
    descriptionEn: "Bangladesh's premier landscape architecture studio.",
    descriptionBn: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও।",
    copyrightText: "© 2026 A R Green Garden. All rights reserved.",
    newsletterTitleEn: "Receive news & offers from A R Green Garden",
    newsletterTitleBn: "নিয়মিত বোটানিক্যাল টিপস ও অফার পেতে যুক্ত হোন",
    newsletterPrivacyEn: "I acknowledge the privacy policy & agree to receive studio updates.",
    newsletterPrivacyBn: "আমি প্রাইভেসি পলিসি মেনে স্টুডিও নিউজলেটার পেতে সম্মত।",
    showNewsletter: true,
    showSocialLinks: true,
  });

  useEffect(() => {
    fetchAll();
    const checkSub = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const s = params.get("sub");
      if (s && ["about", "team", "faq", "contact", "footer"].includes(s)) {
        setActive(s as ActiveSection);
      }
    };
    checkSub();
    const handleSubNav = (e: any) => {
      if (e.detail?.sub && ["about", "team", "faq", "contact", "footer"].includes(e.detail.sub)) {
        setActive(e.detail.sub as ActiveSection);
      }
    };
    window.addEventListener("admin-navigate-subtab", handleSubNav);
    return () => window.removeEventListener("admin-navigate-subtab", handleSubNav);
  }, []);

  const fetchAll = async () => {
    try {
      const keys = ["team_config", "faq_config", "contact_config", "footer_config"];
      await Promise.all(
        keys.map(async (key) => {
          const res = await fetch(`/api/settings?key=${key}&_t=${Date.now()}`, { cache: "no-store" });
          if (!res.ok) return;
          const data = await res.json();
          const val = data?.value;
          if (!val) return;
          if (key === "team_config") {
            setTeamTitle((p) => ({ ...p, ...val }));
            if (Array.isArray(val.members)) setTeamMembers(val.members);
          }
          if (key === "faq_config") {
            setFaqTitle((p) => ({ ...p, ...val }));
            if (Array.isArray(val.items)) setFaqs(val.items);
          }
          if (key === "contact_config") {
            setContact((p: any) => ({ ...p, ...val }));
          }
          if (key === "footer_config") {
            setFooter((p) => ({ ...p, ...val }));
          }
        })
      );
    } catch {
      console.warn("Config load failed, using defaults");
    }
  };

  const saveKey = async (key: string, value: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setToast("✅ সফলভাবে ডাটাবেজে সেভ হয়েছে!");
        window.dispatchEvent(new CustomEvent("site-content-updated", { detail: { key, value } }));
        emitSettingsSync("site-content-updated");
      } else {
        setToast("❌ সেভ করতে সমস্যা হয়েছে।");
      }
    } catch {
      setToast("❌ নেটওয়ার্ক এরর।");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 4000);
    }
  };

  // Team Save (Add/Edit)
  const submitMember = () => {
    if (!memberDraft.name.trim() || !memberDraft.designation.trim()) return;
    if (editingMemberId) {
      setTeamMembers((p) =>
        p.map((m) => (m.id === editingMemberId ? { ...memberDraft, id: editingMemberId } : m))
      );
    } else {
      setTeamMembers((p) => [...p, { ...memberDraft, id: `member-${Date.now()}` }]);
    }
    setMemberDraft(EMPTY_MEMBER);
    setEditingMemberId(null);
    setShowMemberForm(false);
  };

  // FAQ Save (Add/Edit)
  const submitFaq = () => {
    if (!faqDraft.questionEn.trim() && !faqDraft.questionBn.trim()) return;
    if (editingFaqId) {
      setFaqs((p) => p.map((f) => (f.id === editingFaqId ? { ...faqDraft, id: editingFaqId } : f)));
    } else {
      setFaqs((p) => [...p, { ...faqDraft, id: `faq-${Date.now()}` }]);
    }
    setFaqDraft(EMPTY_FAQ);
    setEditingFaqId(null);
    setShowFaqForm(false);
  };

  // Contact Branch Save (Add/Edit)
  const submitBranch = () => {
    if (!branchDraft.cityEn.trim() && !branchDraft.cityBn.trim()) return;
    const branches: ContactBranch[] = Array.isArray(contact.branches) ? [...contact.branches] : [];
    const nextBranches = editingBranchId
      ? branches.map((b) => (b.id === editingBranchId ? { ...branchDraft, id: editingBranchId } : b))
      : [...branches, { ...branchDraft, id: `branch-${Date.now()}` }];

    setContact((p: any) => ({ ...p, branches: nextBranches }));
    setBranchDraft(EMPTY_BRANCH);
    setEditingBranchId(null);
    setShowBranchForm(false);
  };

  const SECTIONS: { key: ActiveSection; label: string }[] = [
    { key: "about", label: "📖 About (/about)" },
    { key: "team", label: "👥 Team (/team)" },
    { key: "faq", label: "❓ FAQ (/faq)" },
    { key: "contact", label: "📍 Contact & Branches" },
    { key: "footer", label: "📌 Footer & Newsletter" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">📝</div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Content & Pages Manager</h2>
          <p className="text-sm text-gray-500">About, Team, FAQ, আঞ্চলিক শাখা ও Footer কনটেন্ট যোগ, এডিট ও ডিলিট করুন</p>
        </div>
      </div>

      {/* Section Nav */}
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(s.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              active === s.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── ABOUT ─── */}
      {active === "about" && <AboutStudioTab />}

      {/* ─── TEAM ─── */}
      {active === "team" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="font-semibold text-gray-700">👥 Team Page Header & Members</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingMemberId(null);
                  setMemberDraft(EMPTY_MEMBER);
                  setShowMemberForm(true);
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              >
                + সদস্য যোগ
              </button>
              <button
                type="button"
                onClick={() => saveKey("team_config", { ...teamTitle, members: teamMembers })}
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
              >
                {saving ? "সেভ হচ্ছে..." : "💾 সেভ"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <BilingualInput
              label="Page Badge"
              bnValue={teamTitle.badgeBn}
              enValue={teamTitle.badgeEn}
              onBnChange={(v) => setTeamTitle((p) => ({ ...p, badgeBn: v }))}
              onEnChange={(v) => setTeamTitle((p) => ({ ...p, badgeEn: v }))}
            />
            <BilingualInput
              label="Page Title"
              bnValue={teamTitle.titleBn}
              enValue={teamTitle.titleEn}
              onBnChange={(v) => setTeamTitle((p) => ({ ...p, titleBn: v }))}
              onEnChange={(v) => setTeamTitle((p) => ({ ...p, titleEn: v }))}
            />
            <BilingualInput
              label="Page Subtitle"
              bnValue={teamTitle.subtitleBn}
              enValue={teamTitle.subtitleEn}
              onBnChange={(v) => setTeamTitle((p) => ({ ...p, subtitleBn: v }))}
              onEnChange={(v) => setTeamTitle((p) => ({ ...p, subtitleEn: v }))}
            />
          </div>

          {showMemberForm && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-emerald-800 text-sm">
                {editingMemberId ? "সদস্যের তথ্য আপডেট করুন" : "নতুন টিম সদস্য যোগ করুন"}
              </h4>
              <CloudinaryUploader
                value={memberDraft.photo}
                onUpload={(url) => setMemberDraft((p) => ({ ...p, photo: url }))}
                folder="team"
                label="Photo"
                previewType="image"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" placeholder="নাম *" value={memberDraft.name} onChange={(e) => setMemberDraft((p) => ({ ...p, name: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="পদবী *" value={memberDraft.designation} onChange={(e) => setMemberDraft((p) => ({ ...p, designation: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="বিভাগ" value={memberDraft.dept} onChange={(e) => setMemberDraft((p) => ({ ...p, dept: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="অভিজ্ঞতা" value={memberDraft.experience} onChange={(e) => setMemberDraft((p) => ({ ...p, experience: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="দক্ষতা (কমা দিয়ে)" value={memberDraft.skills} onChange={(e) => setMemberDraft((p) => ({ ...p, skills: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm sm:col-span-2" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowMemberForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer">বাতিল</button>
                <button type="button" onClick={submitMember} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold cursor-pointer">
                  {editingMemberId ? "আপডেট" : "যোগ করুন"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-2">
                {member.photo && <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200" />}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.designation}</p>
                  <p className="text-xs text-emerald-600">{member.dept}</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMemberId(member.id);
                      setMemberDraft({ ...member });
                      setShowMemberForm(true);
                    }}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    ✏️ এডিট
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeamMembers((p) => p.filter((m) => m.id !== member.id))}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    ✕ ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>
          {teamMembers.length === 0 && <p className="text-center text-gray-400 py-6 text-xs">এখনো কোনো এক্সট্রা টিম সদস্য যোগ করা হয়নি (সক্রিয় কর্মচারীরা অটোমেটিক দেখায়)।</p>}
        </div>
      )}

      {/* ─── FAQ ─── */}
      {active === "faq" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="font-semibold text-gray-700">❓ FAQ Header & Questions</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingFaqId(null);
                  setFaqDraft(EMPTY_FAQ);
                  setShowFaqForm(true);
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              >
                + প্রশ্ন যোগ
              </button>
              <button
                type="button"
                onClick={() => saveKey("faq_config", { ...faqTitle, items: faqs })}
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
              >
                {saving ? "সেভ হচ্ছে..." : "💾 সেভ"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <BilingualInput
              label="FAQ Badge"
              bnValue={faqTitle.badgeBn}
              enValue={faqTitle.badgeEn}
              onBnChange={(v) => setFaqTitle((p) => ({ ...p, badgeBn: v }))}
              onEnChange={(v) => setFaqTitle((p) => ({ ...p, badgeEn: v }))}
            />
            <BilingualInput
              label="FAQ Main Title"
              bnValue={faqTitle.titleBn}
              enValue={faqTitle.titleEn}
              onBnChange={(v) => setFaqTitle((p) => ({ ...p, titleBn: v }))}
              onEnChange={(v) => setFaqTitle((p) => ({ ...p, titleEn: v }))}
            />
            <BilingualInput
              label="FAQ Subtitle"
              bnValue={faqTitle.subtitleBn}
              enValue={faqTitle.subtitleEn}
              onBnChange={(v) => setFaqTitle((p) => ({ ...p, subtitleBn: v }))}
              onEnChange={(v) => setFaqTitle((p) => ({ ...p, subtitleEn: v }))}
            />
          </div>

          {showFaqForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-blue-800 text-sm">
                {editingFaqId ? "প্রশ্ন-উত্তর পরিবর্তন করুন" : "নতুন প্রশ্ন যোগ করুন"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Question (EN)" value={faqDraft.questionEn} onChange={(e) => setFaqDraft((p) => ({ ...p, questionEn: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="প্রশ্ন (BN)" value={faqDraft.questionBn} onChange={(e) => setFaqDraft((p) => ({ ...p, questionBn: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm" />
                <textarea placeholder="Answer (EN)" rows={3} value={faqDraft.answerEn} onChange={(e) => setFaqDraft((p) => ({ ...p, answerEn: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm resize-none" />
                <textarea placeholder="উত্তর (BN)" rows={3} value={faqDraft.answerBn} onChange={(e) => setFaqDraft((p) => ({ ...p, answerBn: e.target.value }))} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm resize-none" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowFaqForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer">বাতিল</button>
                <button type="button" onClick={submitFaq} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold cursor-pointer">
                  {editingFaqId ? "আপডেট" : "যোগ করুন"}
                </button>
              </div>
            </div>
          )}

          <SortableList
            items={faqs}
            onReorder={setFaqs}
            renderItem={(item, dragHandleProps, isDragging) => (
              <div className={`bg-gray-50 rounded-xl p-4 border ${isDragging ? "border-blue-400 shadow-lg" : "border-gray-200"}`}>
                <div className="flex items-start gap-3">
                  <DragHandle dragHandleProps={dragHandleProps} />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-gray-800 text-sm">{item.questionBn || item.questionEn}</p>
                    <p className="text-xs text-gray-500">{item.questionEn}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{item.answerBn || item.answerEn}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFaqId(item.id);
                        setFaqDraft({ ...item });
                        setShowFaqForm(true);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      ✏️ এডিট
                    </button>
                    <button
                      type="button"
                      onClick={() => setFaqs((p) => p.filter((f) => f.id !== item.id))}
                      className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
          {faqs.length === 0 && <p className="text-center text-gray-400 py-8">এখনো FAQ যোগ করা হয়নি</p>}
        </div>
      )}

      {/* ─── CONTACT & REGIONAL BRANCHES ─── */}
      {active === "contact" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="font-semibold text-gray-700">📍 Contact Page, Form Headings & Regional Hubs</h3>
            <button
              type="button"
              onClick={() => saveKey("contact_config", contact)}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
            >
              {saving ? "সেভ হচ্ছে..." : "💾 সেভ"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
            <BilingualInput
              label="Contact Page Headline"
              bnValue={contact.titleBn || ""}
              enValue={contact.titleEn || ""}
              onBnChange={(v) => setContact((p: any) => ({ ...p, titleBn: v }))}
              onEnChange={(v) => setContact((p: any) => ({ ...p, titleEn: v }))}
            />
            <BilingualInput
              label="Contact Page Subtitle"
              bnValue={contact.subtitleBn || ""}
              enValue={contact.subtitleEn || ""}
              onBnChange={(v) => setContact((p: any) => ({ ...p, subtitleBn: v }))}
              onEnChange={(v) => setContact((p: any) => ({ ...p, subtitleEn: v }))}
            />
            <BilingualInput
              label="Contact Form Heading"
              bnValue={contact.formTitleBn || ""}
              enValue={contact.formTitleEn || ""}
              onBnChange={(v) => setContact((p: any) => ({ ...p, formTitleBn: v }))}
              onEnChange={(v) => setContact((p: any) => ({ ...p, formTitleEn: v }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { field: "address", label: "📍 Primary Address / ঠিকানা" },
              { field: "phone", label: "📞 Primary Phone" },
              { field: "whatsapp", label: "💬 WhatsApp Number" },
              { field: "email", label: "✉️ Primary Email" },
              { field: "officeHours", label: "🕐 Office Hours" },
              { field: "fbPage", label: "📘 Facebook URL" },
              { field: "instagram", label: "📸 Instagram URL" },
              { field: "youtube", label: "▶️ YouTube URL" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
                <input
                  type="text"
                  value={(contact as any)[field] || ""}
                  onChange={(e) => setContact((p: any) => ({ ...p, [field]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            ))}
          </div>

          {/* Unlimited Regional Branches Manager */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">🏢 শাখা অফিসসমূহ (Branch Hubs — Dhaka, Chattogram, Sylhet...)</h4>
                <p className="text-xs text-gray-500">যেকোনো সংখ্যক শাখা যোগ, এডিট বা ডিলিট করুন</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingBranchId(null);
                  setBranchDraft(EMPTY_BRANCH);
                  setShowBranchForm(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + নতুন শাখা যোগ
              </button>
            </div>

            {showBranchForm && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 text-xs">
                <BilingualInput
                  label="City / Label (e.g. চট্টগ্রাম শাখা)"
                  bnValue={branchDraft.cityBn}
                  enValue={branchDraft.cityEn}
                  onBnChange={(v) => setBranchDraft((p) => ({ ...p, cityBn: v }))}
                  onEnChange={(v) => setBranchDraft((p) => ({ ...p, cityEn: v }))}
                />
                <BilingualInput
                  label="Office Title"
                  bnValue={branchDraft.titleBn}
                  enValue={branchDraft.titleEn}
                  onBnChange={(v) => setBranchDraft((p) => ({ ...p, titleBn: v }))}
                  onEnChange={(v) => setBranchDraft((p) => ({ ...p, titleEn: v }))}
                />
                <BilingualInput
                  label="Full Street Address"
                  bnValue={branchDraft.addressBn}
                  enValue={branchDraft.addressEn}
                  onBnChange={(v) => setBranchDraft((p) => ({ ...p, addressBn: v }))}
                  onEnChange={(v) => setBranchDraft((p) => ({ ...p, addressEn: v }))}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Phone Number" value={branchDraft.phone} onChange={(e) => setBranchDraft((p) => ({ ...p, phone: e.target.value }))} className="border bg-white border-gray-200 rounded-lg px-3 py-2" />
                  <input type="email" placeholder="Branch Email" value={branchDraft.email} onChange={(e) => setBranchDraft((p) => ({ ...p, email: e.target.value }))} className="border bg-white border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <BilingualInput
                  label="Working Hours"
                  bnValue={branchDraft.hoursBn}
                  enValue={branchDraft.hoursEn}
                  onBnChange={(v) => setBranchDraft((p) => ({ ...p, hoursBn: v }))}
                  onEnChange={(v) => setBranchDraft((p) => ({ ...p, hoursEn: v }))}
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowBranchForm(false)} className="px-3 py-1.5 border border-gray-300 rounded-lg cursor-pointer">বাতিল</button>
                  <button type="button" onClick={submitBranch} className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer">
                    {editingBranchId ? "আপডেট" : "শাখা যোগ করুন"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(contact.branches || []).map((b: ContactBranch) => (
                <div key={b.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-emerald-700">{b.cityBn || b.cityEn}</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{b.titleBn || b.titleEn}</p>
                    <p className="text-gray-500 mt-1">{b.addressBn || b.addressEn}</p>
                    <p className="text-gray-600 font-mono mt-1">{b.phone} • {b.email}</p>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBranchId(b.id);
                        setBranchDraft({ ...b });
                        setShowBranchForm(true);
                      }}
                      className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      ✏️ এডিট
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContact((p: any) => ({
                          ...p,
                          branches: (p.branches || []).filter((x: ContactBranch) => x.id !== b.id),
                        }))
                      }
                      className="text-red-500 font-semibold hover:underline cursor-pointer"
                    >
                      ✕ ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">🗺️ Google Map Embed URL</label>
            <textarea
              rows={2}
              value={contact.mapEmbedUrl || ""}
              onChange={(e) => setContact((p: any) => ({ ...p, mapEmbedUrl: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400"
              placeholder="Google Maps embed iframe src URL"
            />
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      {active === "footer" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">📌 Footer & Newsletter Content</h3>
            <button
              type="button"
              onClick={() => saveKey("footer_config", footer)}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
            >
              {saving ? "সেভ হচ্ছে..." : "💾 সেভ"}
            </button>
          </div>
          <div className="space-y-4">
            <BilingualInput
              label="Studio Footer Description"
              multiline
              rows={3}
              bnValue={footer.descriptionBn}
              enValue={footer.descriptionEn}
              onBnChange={(v) => setFooter((p) => ({ ...p, descriptionBn: v }))}
              onEnChange={(v) => setFooter((p) => ({ ...p, descriptionEn: v }))}
            />
            <BilingualInput
              label="Newsletter Form Title"
              bnValue={footer.newsletterTitleBn}
              enValue={footer.newsletterTitleEn}
              onBnChange={(v) => setFooter((p) => ({ ...p, newsletterTitleBn: v }))}
              onEnChange={(v) => setFooter((p) => ({ ...p, newsletterTitleEn: v }))}
            />
            <BilingualInput
              label="Newsletter Privacy Checkbox Label"
              bnValue={footer.newsletterPrivacyBn}
              enValue={footer.newsletterPrivacyEn}
              onBnChange={(v) => setFooter((p) => ({ ...p, newsletterPrivacyBn: v }))}
              onEnChange={(v) => setFooter((p) => ({ ...p, newsletterPrivacyEn: v }))}
            />
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Copyright Text</label>
              <input
                type="text"
                value={footer.copyrightText}
                onChange={(e) => setFooter((p) => ({ ...p, copyrightText: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={footer.showNewsletter}
                  onChange={(e) => setFooter((p) => ({ ...p, showNewsletter: e.target.checked }))}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm">Newsletter Section দেখান</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={footer.showSocialLinks}
                  onChange={(e) => setFooter((p) => ({ ...p, showSocialLinks: e.target.checked }))}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm">Social Links দেখান</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <StandaloneToast message={toast} type={toast.startsWith("✅") ? "success" : "error"} visible={!!toast} />
    </div>
  );
}
