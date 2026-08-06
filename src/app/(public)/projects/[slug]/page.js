"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const fetch = (originalFetch => (url, options) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        if (res.ok) {
          const data = await res.json();
          const matched = data.find(p => p.slug === slug);
          if (matched) {
            setProject(matched);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Backend project fetch failed, using fallback:", err);
      }

      // Static Fallback
      setProject({
        name: slug.replace(/-/g, " ").toUpperCase(),
        client: "Private Client",
        category: "Landscaping",
        imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
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

  if (loading) {
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
          <img src={project.imageUrl} className="w-full h-full object-cover" alt={project.name} />
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

      </div>
    </div>
  );
}
