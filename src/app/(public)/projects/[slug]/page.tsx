"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { IProject } from "@/types";
import { optimizeImageUrl } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function ProjectDetailsPage() {
  const { t } = useLanguage();
  const { config, txt } = useSiteConfig();
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = typeof rawSlug === "string" ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : "";

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            setProject(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Backend project fetch error:", err);
      }

      // Static Fallback
      setProject({
        name: slug.replace(/-/g, " ").toUpperCase(),
        slug: slug,
        client: "Private Client",
        category: "Landscaping",
        imageUrl: "/hero_plants.png",
        location: "Dhaka, Bangladesh",
        duration: "3 Weeks",
        budgetRange: "BDT 3.5 Lakhs",
        challenges: "Ensuring adequate soil drainage cells and lightweight material load distribution over structural concrete pillars.",
        solution: "Configured multi-layered geo-textile drainage plates and custom organic coco-peat substrates.",
        clientTestimonial: { name: "Client Partner", text: "Stunning craftsmanship and botanical expertise.", rating: 5 }
      });
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-8 h-8 border-3 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in-up">
        
        {/* Navigation */}
        <a 
          href="/projects"
          className="text-xs font-bold text-[#1a3020] hover:text-primary-green transition-all"
        >
          ← Back to Completed Case Studies
        </a>

        {/* Title */}
        <div>
          <span className="text-xs text-primary-green font-bold uppercase tracking-wider bg-primary-green/10 px-3 py-1 rounded-full">
            {project.category} Case Study
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3020] mt-3 leading-tight">
            {project.name}
          </h1>
          <p className="text-xs text-foreground/45 mt-2">
            Location: {project.location} • Client: {project.client || "Confidential"} • Duration: {project.duration}
          </p>
        </div>

        {/* Hero image */}
        <div className="h-64 md:h-[450px] rounded-3xl overflow-hidden shadow-md">
          <img src={optimizeImageUrl(project.imageUrl, 1200)} className="w-full h-full object-cover" alt={project.name} />
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-4">
          {/* Main Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/60">Project Challenges</h3>
              <p className="text-xs md:text-sm text-foreground/75 leading-relaxed mt-2">{project.challenges}</p>
            </div>
            
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/60">Our Architectural Solution</h3>
              <p className="text-xs md:text-sm text-foreground/75 leading-relaxed mt-2">{project.solution}</p>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="bg-sage-light/20 border border-primary-green/10 p-5 rounded-2xl flex flex-col gap-4 text-xs">
            <h4 className="font-serif font-bold text-[#1a3020] text-sm border-b border-primary-green/10 pb-2">Specs & Budget</h4>
            
            <div className="flex justify-between">
              <span className="text-foreground/45">Budget Settled:</span>
              <span className="font-bold text-[#1a3020]">{project.budgetRange}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-foreground/45">Timeline:</span>
              <span className="font-bold text-[#1a3020]">{project.duration}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-foreground/45">Audit Status:</span>
              <span className="font-bold text-primary-green">Completed</span>
            </div>
          </div>
        </div>

        {/* Testimonial block */}
        {project.clientTestimonial?.text && (
          <div className="bg-[#f8faf9] border-l-4 border-primary-green p-6 rounded-r-3xl mt-6 shadow-sm">
            <p className="text-xs md:text-sm italic text-foreground/80">"{project.clientTestimonial.text}"</p>
            <div className="flex justify-between items-center mt-4 text-xs font-bold text-[#1a3020]">
              <span>— {project.clientTestimonial.name}</span>
              <span className="text-yellow-500">{"★".repeat(project.clientTestimonial.rating || 5)}</span>
            </div>
          </div>
        )}

        {/* Dynamic Studio CTA */}
        <div className="bg-[#142a1b] text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div>
            <h4 className="font-serif font-bold text-lg">
              {t("এই ধরনের প্রজেক্ট তৈরি করতে চান?", "Interested in a similar landscape design?")}
            </h4>
            <p className="text-xs text-emerald-100/80 mt-1">
              {config.site_config.phone} • {config.site_config.contactEmail}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold"
            >
              {txt("common.bookConsultation", "সাইট ভিজিট বুক করুন", "Book Site Audit")}
            </Link>
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
            >
              ← {t("সব প্রজেক্ট", "All Projects")}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
