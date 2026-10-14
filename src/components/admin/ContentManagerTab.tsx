"use client";

import React, { useState, useEffect } from "react";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import SortableList, { DragHandle } from "@/components/shared/SortableList";
import { StandaloneToast } from "@/components/shared/Toast";

type ActiveSection = "about" | "team" | "faq" | "contact" | "footer";

interface StatItem { labelEn: string; labelBn: string; value: string }
interface TeamMember { id: string; name: string; designation: string; dept: string; photo: string; skills: string; experience: string; isPublic: boolean }
interface FaqItem { id: string; questionEn: string; questionBn: string; answerEn: string; answerBn: string }

export default function ContentManagerTab() {
  const [active, setActive] = useState<ActiveSection>("about");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // ── About State ──
  const [about, setAbout] = useState({
    titleEn: "About A R Green Garden", titleBn: "এ আর গ্রিন গার্ডেন সম্পর্কে",
    subtitleEn: "Bangladesh's Premier Landscape Architecture Studio", subtitleBn: "বাংলাদেশের শীর্ষস্থানীয় স্টুডিও",
    storyEn: "", storyBn: "", visionEn: "", visionBn: "", missionEn: "", missionBn: "",
    coverImage: "",
    founderName: "Ar. Tanvir Chowdhury", founderTitle: "Founder & Chief Landscape Architect",
    founderPhoto: "", founderQuoteEn: "", founderQuoteBn: "",
    stats: [
      { labelEn: "Projects Completed", labelBn: "সম্পন্ন প্রকল্প", value: "96+" },
      { labelEn: "Happy Clients", labelBn: "সন্তুষ্ট গ্রাহক", value: "250+" },
      { labelEn: "Team Members", labelBn: "দলের সদস্য", value: "35+" },
      { labelEn: "Years of Experience", labelBn: "বছরের অভিজ্ঞতা", value: "10+" },
    ] as StatItem[],
  });

  // ── Team State ──
  const [teamTitle, setTeamTitle] = useState({ titleEn: "Meet Our Expert Team", titleBn: "আমাদের বিশেষজ্ঞ দল" });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Omit<TeamMember, "id">>({ name: "", designation: "", dept: "", photo: "", skills: "", experience: "", isPublic: true });

  // ── FAQ State ──
  const [faqTitle, setFaqTitle] = useState({ titleEn: "Frequently Asked Questions", titleBn: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী" });
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaq, setNewFaq] = useState<Omit<FaqItem, "id">>({ questionEn: "", questionBn: "", answerEn: "", answerBn: "" });

  // ── Contact State ──
  const [contact, setContact] = useState({
    titleEn: "Get In Touch", titleBn: "যোগাযোগ করুন",
    address: "42/A, Road 9/A, Dhanmondi, Dhaka-1209",
    phone: "01883012641", whatsapp: "8801883012641", email: "info@argreengarden.com",
    officeHours: "Saturday – Thursday: 9:00 AM – 6:00 PM",
    mapEmbedUrl: "", fbPage: "", instagram: "", youtube: "",
  });

  // ── Footer State ──
  const [footer, setFooter] = useState({
    descriptionEn: "Bangladesh's premier landscape architecture studio.",
    descriptionBn: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও।",
    copyrightText: "© 2026 A R Green Garden. All rights reserved.",
    showNewsletter: true,
    showSocialLinks: true,
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const keys = ["about_config", "team_config", "faq_config", "contact_config", "footer_config"];
      await Promise.all(keys.map(async (key) => {
        const res = await fetch(`/api/settings?key=${key}&_t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const val = data?.value;
        if (!val) return;
        if (key === "about_config") setAbout((p) => ({ ...p, ...val }));
        if (key === "team_config") { setTeamTitle((p) => ({ ...p, ...val })); if (val.members) setTeamMembers(val.members); }
        if (key === "faq_config") { setFaqTitle((p) => ({ ...p, ...val })); if (val.items) setFaqs(val.items); }
        if (key === "contact_config") setContact((p) => ({ ...p, ...val }));
        if (key === "footer_config") setFooter((p) => ({ ...p, ...val }));
      }));
    } catch (e) { console.warn("Config load failed, using defaults"); }
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
        setToast("✅ সফলভাবে সেভ হয়েছে!");
        window.dispatchEvent(new CustomEvent("site-content-updated", { detail: { key, value } }));
      } else setToast("❌ সেভ করতে সমস্যা হয়েছে।");
    } catch { setToast("❌ নেটওয়ার্ক এরর।"); }
    finally { setSaving(false); setTimeout(() => setToast(""), 4000); }
  };

  const addTeamMember = () => {
    if (!newMember.name || !newMember.designation) return;
    const member: TeamMember = { ...newMember, id: `member-${Date.now()}` };
    setTeamMembers((p) => [...p, member]);
    setNewMember({ name: "", designation: "", dept: "", photo: "", skills: "", experience: "", isPublic: true });
    setShowAddMember(false);
  };

  const addFaq = () => {
    if (!newFaq.questionEn) return;
    setFaqs((p) => [...p, { ...newFaq, id: `faq-${Date.now()}` }]);
    setNewFaq({ questionEn: "", questionBn: "", answerEn: "", answerBn: "" });
    setShowAddFaq(false);
  };

  const SECTIONS: { key: ActiveSection; label: string }[] = [
    { key: "about", label: "📖 About" },
    { key: "team", label: "👥 Team" },
    { key: "faq", label: "❓ FAQ" },
    { key: "contact", label: "📍 Contact" },
    { key: "footer", label: "📌 Footer" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">📝</div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Content Manager</h2>
          <p className="text-sm text-gray-500">সব টেক্সট, ছবি ও কনটেন্ট এখান থেকে পরিবর্তন করুন</p>
        </div>
      </div>

      {/* Section Nav */}
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map((s) => (
          <button key={s.key} onClick={() => setActive(s.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active === s.key ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── ABOUT ─── */}
      {active === "about" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">📖 About Page Content</h3>
            <button onClick={() => saveKey("about_config", about)} disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? "সেভ হচ্ছে..." : "💾 সেভ করুন"}
            </button>
          </div>

          {/* Cover Image */}
          <CloudinaryUploader value={about.coverImage} onUpload={(url) => setAbout((p) => ({ ...p, coverImage: url }))} folder="about" label="Cover Image" previewType="image" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { field: "titleEn", label: "Page Title (EN)" }, { field: "titleBn", label: "পেজ শিরোনাম (BN)" },
              { field: "subtitleEn", label: "Subtitle (EN)" }, { field: "subtitleBn", label: "সাবটাইটেল (BN)" },
              { field: "visionEn", label: "Vision (EN)" }, { field: "visionBn", label: "ভিশন (BN)" },
              { field: "missionEn", label: "Mission (EN)" }, { field: "missionBn", label: "মিশন (BN)" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
                <input type="text" value={(about as any)[field] || ""}
                  onChange={(e) => setAbout((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Our Story (English)</label>
              <textarea rows={5} value={about.storyEn} onChange={(e) => setAbout((p) => ({ ...p, storyEn: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">আমাদের গল্প (বাংলা)</label>
              <textarea rows={5} value={about.storyBn} onChange={(e) => setAbout((p) => ({ ...p, storyBn: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4 className="font-semibold text-gray-600 text-sm mb-3">📊 পরিসংখ্যান</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {about.stats.map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2">
                  <input type="text" placeholder="Value e.g. 96+" value={stat.value}
                    onChange={(e) => setAbout((p) => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, value: e.target.value } : s) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center font-bold focus:outline-none focus:border-blue-400"
                  />
                  <input type="text" placeholder="Label EN" value={stat.labelEn}
                    onChange={(e) => setAbout((p) => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, labelEn: e.target.value } : s) }))}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400"
                  />
                  <input type="text" placeholder="লেবেল BN" value={stat.labelBn}
                    onChange={(e) => setAbout((p) => ({ ...p, stats: p.stats.map((s, idx) => idx === i ? { ...s, labelBn: e.target.value } : s) }))}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Founder */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
            <h4 className="font-semibold text-gray-600 text-sm">👨‍💼 Founder Section</h4>
            <CloudinaryUploader value={about.founderPhoto} onUpload={(url) => setAbout((p) => ({ ...p, founderPhoto: url }))} folder="team" label="Founder Photo" previewType="image" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Founder Name" value={about.founderName} onChange={(e) => setAbout((p) => ({ ...p, founderName: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              <input type="text" placeholder="Founder Title" value={about.founderTitle} onChange={(e) => setAbout((p) => ({ ...p, founderTitle: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              <input type="text" placeholder="Quote (EN)" value={about.founderQuoteEn} onChange={(e) => setAbout((p) => ({ ...p, founderQuoteEn: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              <input type="text" placeholder="উদ্ধৃতি (BN)" value={about.founderQuoteBn} onChange={(e) => setAbout((p) => ({ ...p, founderQuoteBn: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* ─── TEAM ─── */}
      {active === "team" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">👥 Team Members</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowAddMember(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ সদস্য যোগ</button>
              <button onClick={() => saveKey("team_config", { ...teamTitle, members: teamMembers })} disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? "সেভ হচ্ছে..." : "💾 সেভ"}</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Section Title EN" value={teamTitle.titleEn}
              onChange={(e) => setTeamTitle((p) => ({ ...p, titleEn: e.target.value }))}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            <input type="text" placeholder="সেকশন শিরোনাম BN" value={teamTitle.titleBn}
              onChange={(e) => setTeamTitle((p) => ({ ...p, titleBn: e.target.value }))}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
          </div>

          {/* Add Member Form */}
          {showAddMember && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-emerald-800 text-sm">নতুন টিম সদস্য</h4>
              <CloudinaryUploader value={newMember.photo} onUpload={(url) => setNewMember((p) => ({ ...p, photo: url }))} folder="team" label="Photo" previewType="image" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="নাম" value={newMember.name} onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="পদবী" value={newMember.designation} onChange={(e) => setNewMember((p) => ({ ...p, designation: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="বিভাগ" value={newMember.dept} onChange={(e) => setNewMember((p) => ({ ...p, dept: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="অভিজ্ঞতা" value={newMember.experience} onChange={(e) => setNewMember((p) => ({ ...p, experience: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="দক্ষতা (কমা দিয়ে)" value={newMember.skills} onChange={(e) => setNewMember((p) => ({ ...p, skills: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddMember(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">বাতিল</button>
                <button onClick={addTeamMember} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">যোগ করুন</button>
              </div>
            </div>
          )}

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-2">
                {member.photo && <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200" />}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.designation}</p>
                  <p className="text-xs text-emerald-600">{member.dept}</p>
                </div>
                <button onClick={() => setTeamMembers((p) => p.filter((m) => m.id !== member.id))}
                  className="text-xs text-red-500 hover:text-red-700 self-start">✕ সরান</button>
              </div>
            ))}
          </div>
          {teamMembers.length === 0 && <p className="text-center text-gray-400 py-8">এখনো কোনো সদস্য যোগ করা হয়নি</p>}
        </div>
      )}

      {/* ─── FAQ ─── */}
      {active === "faq" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">❓ FAQ Items</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowAddFaq(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ প্রশ্ন যোগ</button>
              <button onClick={() => saveKey("faq_config", { ...faqTitle, items: faqs })} disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? "সেভ হচ্ছে..." : "💾 সেভ"}</button>
            </div>
          </div>

          {/* Add FAQ Form */}
          {showAddFaq && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-blue-800 text-sm">নতুন প্রশ্ন</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Question (EN)" value={newFaq.questionEn} onChange={(e) => setNewFaq((p) => ({ ...p, questionEn: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="প্রশ্ন (BN)" value={newFaq.questionBn} onChange={(e) => setNewFaq((p) => ({ ...p, questionBn: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <textarea placeholder="Answer (EN)" rows={3} value={newFaq.answerEn} onChange={(e) => setNewFaq((p) => ({ ...p, answerEn: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                <textarea placeholder="উত্তর (BN)" rows={3} value={newFaq.answerBn} onChange={(e) => setNewFaq((p) => ({ ...p, answerBn: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddFaq(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">বাতিল</button>
                <button onClick={addFaq} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">যোগ করুন</button>
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
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-gray-800 text-sm">{item.questionEn}</p>
                    <p className="text-sm text-gray-500">{item.questionBn}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{item.answerEn}</p>
                  </div>
                  <button onClick={() => setFaqs((p) => p.filter((f) => f.id !== item.id))} className="text-red-500 hover:text-red-700 text-lg">✕</button>
                </div>
              </div>
            )}
          />
          {faqs.length === 0 && <p className="text-center text-gray-400 py-8">এখনো FAQ যোগ করা হয়নি</p>}
        </div>
      )}

      {/* ─── CONTACT ─── */}
      {active === "contact" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">📍 Contact Information</h3>
            <button onClick={() => saveKey("contact_config", contact)} disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? "সেভ হচ্ছে..." : "💾 সেভ"}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { field: "address", label: "📍 Address / ঠিকানা" },
              { field: "phone", label: "📞 Phone" },
              { field: "whatsapp", label: "💬 WhatsApp Number" },
              { field: "email", label: "✉️ Email" },
              { field: "officeHours", label: "🕐 Office Hours" },
              { field: "fbPage", label: "📘 Facebook URL" },
              { field: "instagram", label: "📸 Instagram URL" },
              { field: "youtube", label: "▶️ YouTube URL" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
                <input type="text" value={(contact as any)[field] || ""}
                  onChange={(e) => setContact((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">🗺️ Google Map Embed URL</label>
            <textarea rows={2} value={contact.mapEmbedUrl} onChange={(e) => setContact((p) => ({ ...p, mapEmbedUrl: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400"
              placeholder="Google Maps embed iframe src URL" />
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      {active === "footer" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">📌 Footer Content</h3>
            <button onClick={() => saveKey("footer_config", footer)} disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? "সেভ হচ্ছে..." : "💾 সেভ"}</button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Description (EN)</label>
                <textarea rows={3} value={footer.descriptionEn} onChange={(e) => setFooter((p) => ({ ...p, descriptionEn: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">বিবরণ (BN)</label>
                <textarea rows={3} value={footer.descriptionBn} onChange={(e) => setFooter((p) => ({ ...p, descriptionBn: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Copyright Text</label>
              <input type="text" value={footer.copyrightText} onChange={(e) => setFooter((p) => ({ ...p, copyrightText: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={footer.showNewsletter} onChange={(e) => setFooter((p) => ({ ...p, showNewsletter: e.target.checked }))} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm">Newsletter Section দেখান</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={footer.showSocialLinks} onChange={(e) => setFooter((p) => ({ ...p, showSocialLinks: e.target.checked }))} className="w-4 h-4 accent-blue-600" />
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
