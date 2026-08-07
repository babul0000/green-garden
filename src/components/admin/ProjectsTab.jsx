"use client";

import React from "react";

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
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#0c1911]">Statistics (Case Studies Editor)</h3>
        <p className="text-xs text-slate-400 mt-0.5">Edit portfolio items, location specs, client details, challenges, solutions, and testimonials.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateOrUpdateProject} className="bg-[#f8faf9] p-6 rounded-[24px] border border-slate-200/60 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-[#0c1911] uppercase tracking-wider">
          {editingProject ? `Edit Case Study: ${editingProject.name}` : "Publish New Completed Project"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            required
            placeholder="Project Name"
            value={projName}
            onChange={(e) => setProjName(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <input 
            type="text" 
            placeholder="Client Name"
            value={projClient}
            onChange={(e) => setProjClient(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <select 
            value={projCategory}
            onChange={(e) => setProjCategory(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option>Residential</option>
            <option>Commercial</option>
            <option>Villa</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Photo Image URL"
            value={projUrl}
            onChange={(e) => setProjUrl(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <input 
            type="text" 
            placeholder="Location (e.g. Banani, Dhaka)"
            value={projLocation}
            onChange={(e) => setProjLocation(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Duration (e.g. 3 Weeks)"
              value={projDuration}
              onChange={(e) => setProjDuration(e.target.value)}
              className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs flex-1 text-slate-800 focus:outline-none focus:border-[#0c1911]"
            />
            <input 
              type="text" 
              placeholder="Budget (e.g. 4 Lakhs)"
              value={projBudget}
              onChange={(e) => setProjBudget(e.target.value)}
              className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs flex-1 text-slate-800 focus:outline-none focus:border-[#0c1911]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea 
            rows={2}
            placeholder="Challenges description..."
            value={projChallenges}
            onChange={(e) => setProjChallenges(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <textarea 
            rows={2}
            placeholder="Solution description..."
            value={projSolution}
            onChange={(e) => setProjSolution(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/40 pt-3">
          <input 
            type="text" 
            placeholder="Client Testimonial Name"
            value={projTestimonialName}
            onChange={(e) => setProjTestimonialName(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <input 
            type="text" 
            placeholder="Client Testimonial Review Text"
            value={projTestimonialText}
            onChange={(e) => setProjTestimonialText(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#0c1911]">
            <input 
              type="checkbox" 
              checked={projFeatured} 
              onChange={(e) => setProjFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0c1911]"
            />
            <span>Feature this project case study on homepage?</span>
          </label>
          <div className="flex gap-2 self-end">
            <button type="submit" className="bg-[#0c1911] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
              {editingProject ? "Update Project" : "Publish Project"}
            </button>
            {editingProject && (
              <button type="button" onClick={resetProjectForm} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* List Projects */}
      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-serif font-bold text-sm text-[#0c1911]">Published Projects</h4>
        <div className="flex flex-col gap-2">
          {projects.map(p => (
            <div key={p._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors text-xs">
              <div>
                <span className="font-bold text-[#0c1911] block">{p.name}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Category: {p.category} • Location: {p.location} {p.featured && "• 🌟 Featured"}</span>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleEditProjectClick(p)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                <button type="button" onClick={() => handleDeleteProject(p._id)} className="text-red-500 hover:underline font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
