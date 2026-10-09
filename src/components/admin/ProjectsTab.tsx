"use client";

import React from "react";
import { IProject } from "@/types";

interface ProjectsTabProps {
  projects?: IProject[];
  projName: string;
  setProjName: (val: string) => void;
  projClient: string;
  setProjClient: (val: string) => void;
  projCategory: string;
  setProjCategory: (val: string) => void;
  projUrl: string;
  setProjUrl: (val: string) => void;
  projLocation: string;
  setProjLocation: (val: string) => void;
  projDuration: string;
  setProjDuration: (val: string) => void;
  projBudget: string;
  setProjBudget: (val: string) => void;
  projChallenges: string;
  setProjChallenges: (val: string) => void;
  projSolution: string;
  setProjSolution: (val: string) => void;
  projTestimonialName: string;
  setProjTestimonialName: (val: string) => void;
  projTestimonialText: string;
  setProjTestimonialText: (val: string) => void;
  projFeatured: boolean;
  setProjFeatured: (val: boolean) => void;
  editingProject: IProject | null;
  handleCreateOrUpdateProject: (e: React.FormEvent) => void;
  handleEditProjectClick: (proj: IProject) => void;
  handleDeleteProject: (id?: string) => void;
  resetProjectForm: () => void;
}

export default function ProjectsTab({
  projects = [],
  projName,
  setProjName,
  projClient,
  setProjClient,
  projCategory,
  setProjCategory,
  projUrl,
  setProjUrl,
  projLocation,
  setProjLocation,
  projDuration,
  setProjDuration,
  projBudget,
  setProjBudget,
  projChallenges,
  setProjChallenges,
  projSolution,
  setProjSolution,
  projTestimonialName,
  setProjTestimonialName,
  projTestimonialText,
  setProjTestimonialText,
  projFeatured,
  setProjFeatured,
  editingProject,
  handleCreateOrUpdateProject,
  handleEditProjectClick,
  handleDeleteProject,
  resetProjectForm
}: ProjectsTabProps) {
  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      <div>
        <h3 className="font-serif font-bold text-lg text-white">প্রজেক্ট পোর্টফোলিও ও কেস স্টাডিজ • Portfolio & Case Studies</h3>
        <p className="text-xs text-stone-400 mt-0.5">Edit portfolio items, location specs, client details, challenges, solutions, and testimonials.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateOrUpdateProject} className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">
          {editingProject ? `Edit Case Study: ${editingProject.name}` : "Publish New Completed Project"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            required
            placeholder="Project Name"
            value={projName}
            onChange={(e) => setProjName(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <input 
            type="text" 
            placeholder="Client Name"
            value={projClient}
            onChange={(e) => setProjClient(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <select 
            value={projCategory}
            onChange={(e) => setProjCategory(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-emerald-400"
          >
            <option className="bg-[#121A14]">Residential</option>
            <option className="bg-[#121A14]">Commercial</option>
            <option className="bg-[#121A14]">Villa</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Photo Image URL"
            value={projUrl}
            onChange={(e) => setProjUrl(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <input 
            type="text" 
            placeholder="Location (e.g. Banani, Dhaka)"
            value={projLocation}
            onChange={(e) => setProjLocation(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Duration (e.g. 3 Weeks)"
              value={projDuration}
              onChange={(e) => setProjDuration(e.target.value)}
              className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs flex-1 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 font-mono"
            />
            <input 
              type="text" 
              placeholder="Budget (e.g. 4 Lakhs)"
              value={projBudget}
              onChange={(e) => setProjBudget(e.target.value)}
              className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs flex-1 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea 
            rows={2}
            placeholder="Challenges description..."
            value={projChallenges}
            onChange={(e) => setProjChallenges(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs resize-none text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <textarea 
            rows={2}
            placeholder="Solution description..."
            value={projSolution}
            onChange={(e) => setProjSolution(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs resize-none text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-3">
          <input 
            type="text" 
            placeholder="Client Testimonial Name"
            value={projTestimonialName}
            onChange={(e) => setProjTestimonialName(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <input 
            type="text" 
            placeholder="Client Testimonial Review Text"
            value={projTestimonialText}
            onChange={(e) => setProjTestimonialText(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={projFeatured} 
              onChange={(e) => setProjFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span>Feature this project case study on homepage?</span>
          </label>
          <div className="flex gap-2 self-end">
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 transition-all">
              {editingProject ? "Update Project" : "Publish Project"}
            </button>
            {editingProject && (
              <button type="button" onClick={resetProjectForm} className="bg-white/10 hover:bg-white/20 text-white font-bold font-mono text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* List Projects */}
      <div className="flex flex-col gap-3 mt-2">
        <h4 className="font-serif font-bold text-sm text-white font-mono">Published Projects ({projects.length})</h4>
        <div className="flex flex-col gap-2">
          {projects.map(p => (
            <div key={p.id || p._id} className="bg-black/30 border border-white/10 p-4 rounded-2xl flex justify-between items-center shadow-lg hover:border-emerald-500/40 transition-colors text-xs">
              <div>
                <span className="font-bold text-white block">{p.name}</span>
                <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">Category: {p.category} • Location: {p.location} {p.featured && "• 🌟 Featured"}</span>
              </div>
              <div className="flex gap-3 font-mono">
                <button type="button" onClick={() => handleEditProjectClick(p)} className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer">Edit</button>
                <button type="button" onClick={() => handleDeleteProject(p.id || p._id)} className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
