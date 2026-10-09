"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface TeamMember {
  name: string;
  designationBn: string;
  designationEn: string;
  experienceBn: string;
  experienceEn: string;
  specialtyBn: string;
  specialtyEn: string;
  education: string;
  photo: string;
  skillsBn: string[];
  skillsEn: string[];
}

const initialTeam: TeamMember[] = [
  {
    name: "তানভীর আহমেদ",
    designationBn: "প্রধান কৃষিবিদ ও সিনিয়র ট্রি ডক্টর",
    designationEn: "Senior Tree Doctor & Agronomist",
    experienceBn: "৮ বছরের অভিজ্ঞতা",
    experienceEn: "8+ Years Experience",
    specialtyBn: "উদ্ভিদের রোগতত্ত্ব, প্যাথলজি ও গাছের কান্ডে সার্জারি",
    specialtyEn: "Plant Pathology, Fungicide Surgery & Soil Optimization",
    education: "B.Sc in Horticulture, BAU",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    skillsBn: ["রোগ নির্ণয়", "কীটপতঙ্গ দমন", "মাটি পরীক্ষা", "বৃক্ষ সার্জারি"],
    skillsEn: ["Disease Pathology", "Pest Management", "Soil Testing", "Tree Surgery"],
  },
  {
    name: "স্থপতি সুলতানা ইয়াসমিন",
    designationBn: "প্রিন্সিপাল ল্যান্ডস্কেপ আর্কিটেক্ট",
    designationEn: "Principal Landscape Architect",
    experienceBn: "৬ বছরের অভিজ্ঞতা",
    experienceEn: "6+ Years Experience",
    specialtyBn: "ছাদবাগান, থ্রিডি ল্যান্ডস্কেপ মডেলিং ও পারগোলা ডিজাইন",
    specialtyEn: "Rooftop Biophilia, 3D Modeling & Hardscape Design",
    education: "B.Arch, BUET",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    skillsBn: ["ছাদের লোড অ্যানালাইসিস", "ইকো ব্যালকনি", "মার্বেল ফোয়ারা", "টেরেস আর্কিটেকচার"],
    skillsEn: ["Rooftop Load Analysis", "Eco-Balcony", "Water Features", "Terrace Design"],
  },
  {
    name: "প্রকৌ. মোঃ বেলাল",
    designationBn: "স্মার্ট ইরিগেশন ও হাইড্রলিক্স স্পেশালিস্ট",
    designationEn: "Smart Irrigation & Hydraulics Specialist",
    experienceBn: "৭ বছরের অভিজ্ঞতা",
    experienceEn: "7+ Years Experience",
    specialtyBn: "মাইক্রো ড্রিপ সেচ, অটোমেটিক টাইমার ও ড্রেনেজ সলিউশন",
    specialtyEn: "Micro Drip Networks, Automatic Timers & Drainage Hydraulics",
    education: "B.Sc in Water Resources Engineering",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    skillsBn: ["স্মার্ট কন্ট্রোলার", "রোটারি স্প্রিংকলার", "সাব-সারফেস ড্রিপ", "বৃষ্টির পানি সংরক্ষণ"],
    skillsEn: ["Automated Controllers", "Rotary Sprinklers", "Sub-surface Drip", "Rainwater Harvesting"],
  },
  {
    name: "আব্দুল হালিম",
    designationBn: "চিফ হর্টিকালচারিস্ট ও নার্সারি ইন-চার্জ",
    designationEn: "Chief Horticulturist & Nursery Lead",
    experienceBn: "১০+ বছরের অভিজ্ঞতা",
    experienceEn: "10+ Years Experience",
    specialtyBn: "ট্রপিক্যাল উদ্ভিদ, জাপানিজ বনসাই ও জৈব পুষ্টি ফর্মুলা",
    specialtyEn: "Tropical Species, Bonsai Master, Organic Nutrition Formulation",
    education: "Certified Master Gardener, Dhaka",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80",
    skillsBn: ["প্রুনিং আর্ট", "মাটি প্রস্তুতকরণ", "ঘাসের লন পরিচর্যা", "কলম তৈরি"],
    skillsEn: ["Pruning Artistry", "Soil Media Formulation", "Lawn Sod Care", "Grafting"],
  },
];

export default function TeamPreview() {
  const { language, t } = useLanguage();
  const [team, setTeam] = useState(initialTeam);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                {t("Multidisciplinary Leadership", "Multidisciplinary Leadership")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                {t("Landscape Architects & Agronomists", "Landscape Architects & Agronomists")}
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              {t(
                "আমাদের দলে বুয়েট থেকে স্নাতকপ্রাপ্ত স্থপতি, সার্টিফাইড কৃষিবিদ এবং পানি প্রকৌশলীদের সমন্বিত মেধা কাজ করে।",
                "Our team combines architectural excellence from BUET with certified plant pathologists and irrigation engineers."
              )}
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-[#F7F6F2] rounded-3xl overflow-hidden border border-stone-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#2B4D33] flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/4] overflow-hidden bg-stone-200">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-black/75 text-white font-mono text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {language === "bn" ? member.experienceBn : member.experienceEn}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-display font-bold text-[#121813] text-lg">
                    {member.name}
                  </h3>
                  <p className="font-mono text-xs font-semibold text-[#2B4D33]">
                    {language === "bn" ? member.designationBn : member.designationEn}
                  </p>
                  <p className="font-mono text-[11px] text-[#75787B]">
                    {member.education}
                  </p>
                  <p className="font-sans text-xs text-stone-600 pt-1 leading-relaxed">
                    {language === "bn" ? member.specialtyBn : member.specialtyEn}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {(language === "bn" ? member.skillsBn : member.skillsEn).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="font-mono text-[9px] bg-white text-[#121813] px-2 py-0.5 rounded border border-stone-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/contact"
                  className="w-full block text-center py-2.5 rounded-full bg-white hover:bg-[#18221A] text-[#121813] hover:text-white font-mono text-[11px] uppercase tracking-wider font-semibold border border-stone-300 hover:border-[#18221A] transition-all"
                >
                  {t("পরামর্শের জন্য যোগাযোগ", "Book Consultation")}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
