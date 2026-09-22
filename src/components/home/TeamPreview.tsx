import React from "react";
import Link from "next/link";

export default function TeamPreview() {
  const team = [
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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-sage-light/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
              আমাদের বিশেষজ্ঞ টিম
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3">
              Our Professional Team
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1 max-w-xl">
              অভিজ্ঞ ল্যান্ডস্কেপ আর্কিটেক্ট, সার্টিফায়েড ট্রি ডক্টর এবং দক্ষ ইরিগেশন ইঞ্জিনিয়ারদের সমন্বয়ে আমাদের নিবেদিত টিম।
            </p>
          </div>

          <Link
            href="/contact"
            className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-emerald-300 text-emerald-800 font-semibold rounded-xl text-xs shadow-sm transition-all"
          >
            Meet Full Team →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-emerald-100/70 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/4] overflow-hidden bg-gray-100">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-800/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {member.experience}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-gray-900 text-base font-serif">{member.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700">{member.designation}</p>
                  <p className="text-[11px] text-gray-500">{member.education}</p>
                  <p className="text-xs text-gray-600 pt-1 leading-relaxed">{member.specialty}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href="#contact"
                  className="w-full block text-center py-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold border border-gray-200 transition-colors"
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
