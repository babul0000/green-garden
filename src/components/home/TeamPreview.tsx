"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const initialTeam = [
  {
    name: "Md. Rahim",
    designation: "Senior Tree Doctor & Agronomist",
    experience: "৮ বছরের অভিজ্ঞতা",
    specialty: "Tree Diagnosis • Plant Health • Fungicide Surgery",
    education: "B.Sc in Horticulture, BAU",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    skills: ["Disease Pathology", "Pest Management", "Soil Testing", "Tree Surgery"],
  },
  {
    name: "Ar. Sultana Yasmin",
    designation: "Principal Landscape Architect",
    experience: "৬ বছরের অভিজ্ঞতা",
    specialty: "Rooftop Oasis • 3D Landscape Modeling • Hardscape Design",
    education: "B.Arch, BUET",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    skills: ["Rooftop Load Analysis", "Eco-Balcony", "Water Features", "Terrace Design"],
  },
  {
    name: "Engr. Md. Belal",
    designation: "Smart Irrigation & Hydraulics Specialist",
    experience: "৭ বছরের অভিজ্ঞতা",
    specialty: "Micro Drip Irrigation • Automatic Timers • Drainage Solutions",
    education: "B.Sc in Water Resources Engineering",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    skills: ["Automated Controllers", "Rotary Sprinklers", "Sub-surface Drip", "Rainwater Harvesting"],
  },
  {
    name: "Abdul Halim",
    designation: "Chief Horticulturist & Nursery Lead",
    experience: "১০+ বছরের অভিজ্ঞতা",
    specialty: "Tropical Species • Japanese Bonsai • Organic Nutrition",
    education: "Certified Master Gardener, Dhaka",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80",
    skills: ["Pruning Artistry", "Soil Media Formulation", "Lawn Sod Maintenance", "Grafting"],
  },
];

export default function TeamPreview() {
  const [team, setTeam] = useState(initialTeam);

  useEffect(() => {
    fetch("/api/employees?public=true")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d: any) => ({
            name: d.name,
            designation: d.designation,
            experience: d.experience || "অভিজ্ঞ পেশাদার",
            specialty: d.responsibility || d.department || "Landscape Specialist",
            education: d.education || "Certified Expert",
            photo: d.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
            skills: Array.isArray(d.skills) && d.skills.length > 0 ? d.skills : ["Landscape", "Horticulture", "Planning"],
          }));
          setTeam(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Shma Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                Multidisciplinary Team • বিশেষজ্ঞ টিম
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                Landscape <span className="font-bold text-[#2B4D33]">Architects & Agronomists</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              Our multidisciplinary team combines architectural excellence from BUET with certified plant pathologists and irrigation engineers.
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
                    {member.experience}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-display font-bold text-[#121813] text-lg">
                    {member.name}
                  </h3>
                  <p className="font-mono text-xs font-semibold text-[#2B4D33]">
                    {member.designation}
                  </p>
                  <p className="font-mono text-[11px] text-[#75787B]">
                    {member.education}
                  </p>
                  <p className="font-sans text-xs text-stone-600 pt-1 leading-relaxed">
                    {member.specialty}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {member.skills.map((skill, sIdx) => (
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
                <a
                  href="#contact"
                  className="w-full block text-center py-2.5 rounded-full bg-white hover:bg-[#18221A] text-[#121813] hover:text-white font-mono text-[11px] uppercase tracking-wider font-semibold border border-stone-300 hover:border-[#18221A] transition-all"
                >
                  Book Consultation
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
