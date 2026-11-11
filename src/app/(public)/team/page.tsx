"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  dept?: string;
  bio: string;
  education?: string;
  experience?: string;
  photo?: string;
  skills: string[];
}

interface TeamConfig {
  badgeEn?: string;
  badgeBn?: string;
  titleEn?: string;
  titleBn?: string;
  subtitleEn?: string;
  subtitleBn?: string;
  members?: TeamMember[];
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "t-1",
    name: "Ar. Rafiqul Islam",
    designation: "Principal Landscape Architect",
    dept: "Architecture Studio",
    bio: "B.Arch (BUET) with 12+ years designing structural rooftop estates and bioclimatic terraces across Dhaka.",
    education: "B.Arch, BUET Dhaka",
    experience: "12+ Years Exp",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    skills: ["Rooftop Engineering", "BIM 3D", "Waterproofing"],
  },
  {
    id: "t-2",
    name: "Dr. Nusrat Jahan",
    designation: "Senior Agronomist & Tree Doctor",
    dept: "Plant Pathology Clinic",
    bio: "Specializes in organic disease therapy, tropical bonsai nutrition, and soil microbiome restoration.",
    education: "PhD Horticulture, BAU",
    experience: "9+ Years Exp",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    skills: ["Plant Pathology", "Organic Pest Control", "Soil Science"],
  },
];

export default function TeamPage() {
  const { language, t } = useLanguage();
  const { config, txt } = useSiteConfig();
  const bn = language === "bn";

  const hideStaticFallbacks = Boolean(config.homepage_sections?.hideStaticFallbacks);
  const teamCfg = (config.team_config as TeamConfig) || {};

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const [empRes, cfgRes] = await Promise.all([
          fetch(`/api/employees?public=true&_t=${Date.now()}`, { cache: "no-store" }),
          fetch(`/api/settings?key=team_config&_t=${Date.now()}`, { cache: "no-store" }),
        ]);

        let dynamicMembers: TeamMember[] = [];
        if (cfgRes.ok) {
          const cfgData = await cfgRes.json();
          if (Array.isArray(cfgData?.value?.members) && cfgData.value.members.length > 0) {
            dynamicMembers = cfgData.value.members;
          }
        }

        if (empRes.ok) {
          const emps = await empRes.json();
          if (Array.isArray(emps) && emps.length > 0) {
            const empCards: TeamMember[] = emps.map((e: any) => ({
              id: `emp-${e.id}`,
              name: e.name,
              designation: e.designation || e.role || "Landscape Specialist",
              dept: e.department || "Studio Operations",
              bio: e.bio || "Dedicated landscape specialist at A R Green Garden.",
              education: e.education || "Certified Specialist",
              experience: e.experience || "5+ Years",
              photo: e.avatar || e.photo || "",
              skills: Array.isArray(e.skills) ? e.skills : [e.role || "Landscaping"],
            }));
            // Combine CMS custom members with DB employees without duplicates by name
            const existingNames = new Set(dynamicMembers.map((m) => m.name.toLowerCase()));
            empCards.forEach((ec) => {
              if (!existingNames.has(ec.name.toLowerCase())) dynamicMembers.push(ec);
            });
          }
        }

        if (dynamicMembers.length > 0) {
          setTeam(dynamicMembers);
        } else {
          setTeam(hideStaticFallbacks ? [] : DEFAULT_TEAM);
        }
      } catch {
        setTeam(hideStaticFallbacks ? [] : DEFAULT_TEAM);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, [hideStaticFallbacks]);

  const badge = bn
    ? teamCfg.badgeBn || "স্টুডিও আর্কিটেক্ট ও বোটানিস্ট টিম"
    : teamCfg.badgeEn || "Professional Landscape Team";
  const title = bn
    ? teamCfg.titleBn || "আমাদের বিশেষজ্ঞ দল"
    : teamCfg.titleEn || "Meet the Experts Behind A R Green Garden";
  const subtitle = bn
    ? teamCfg.subtitleBn || "দক্ষ ল্যান্ডস্কেপ আর্কিটেক্ট, ইঞ্জিনিয়ার ও বৃক্ষ চিকিৎসকদের সমন্বয়ে আমাদের টিম।"
    : teamCfg.subtitleEn || "A multidisciplinary studio of architects, structural engineers, and agronomists.";

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>👥</span> {badge}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142a1b] leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base text-stone-600 leading-relaxed">{subtitle}</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl text-stone-400 text-sm">
            {t("টিম মেম্বার তালিকা এখনো হালনাগাদ করা হয়নি।", "No team profiles configured yet.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/4] overflow-hidden bg-stone-100">
                    <img
                      src={
                        m.photo ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80"
                      }
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                    {m.experience && (
                      <div className="absolute top-3 right-3 bg-emerald-800/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                        {m.experience}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <h3 className="font-bold text-[#142a1b] text-lg font-serif">{m.name}</h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">{m.designation}</p>
                    </div>

                    {m.bio && <p className="text-xs text-stone-600 leading-relaxed">{m.bio}</p>}

                    {m.education && (
                      <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <span className="font-bold text-stone-700 block text-[10px] uppercase">
                          {t("যোগ্যতা:", "Credentials:")}
                        </span>
                        {m.education}
                      </div>
                    )}

                    {Array.isArray(m.skills) && m.skills.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          {t("অভিজ্ঞতা ও দক্ষতা:", "Specialties:")}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/contact?consultant=${encodeURIComponent(m.name)}`}
                    className="w-full block text-center py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    {txt("team.ctaBtn", "টিমের সাথে কথা বলুন", "Consult Our Architects")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
