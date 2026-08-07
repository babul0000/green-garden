"use client";

import React from "react";

export default function BlogsTab({
  blogs = [],
  blogTitle,
  setBlogTitle,
  blogUrl,
  setBlogUrl,
  blogCategory,
  setBlogCategory,
  blogContent,
  setBlogContent,
  editingBlog,
  setEditingBlog,
  selectedBlogComments,
  setSelectedBlogComments,
  handleCreateOrUpdateBlog,
  handleEditBlogClick,
  handleDeleteBlog,
  handleDeleteComment
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      {selectedBlogComments ? (
        /* Comment moderator view */
        <div className="flex flex-col gap-6">
          <button type="button" onClick={() => setSelectedBlogComments(null)} className="text-xs font-bold text-[#0c1911] hover:text-[#8ac343] transition-colors w-fit flex items-center gap-1">
            ← Back to Article Manager
          </button>
          <div>
            <h4 className="font-serif font-bold text-lg text-[#0c1911]">Moderate Comments: {selectedBlogComments.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Approve, block, or delete comments written by website visitors.</p>
          </div>

          <div className="flex flex-col gap-3">
            {selectedBlogComments.comments?.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-[#f8faf9] p-6 rounded-2xl text-center">No comments written for this post.</p>
            ) : (
              selectedBlogComments.comments.map(c => (
                <div key={c._id} className="bg-[#f8faf9] border border-slate-100 p-4 rounded-[20px] text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0c1911] block">{c.name}</span>
                    <p className="text-slate-600 leading-relaxed mt-1">{c.text}</p>
                  </div>
                  <button type="button" onClick={() => handleDeleteComment(selectedBlogComments._id, c._id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
                    Delete Comment
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Standard Blogs List & Form */
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0c1911]">Botanical Blogs Manager</h3>
            <p className="text-xs text-slate-400 mt-0.5">Write plant tips, garden maintenance checklists and moderate readers comments.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateOrUpdateBlog} className="bg-[#f8faf9] p-6 rounded-[24px] border border-slate-200/60 flex flex-col gap-4">
            <h4 className="font-bold text-xs text-[#0c1911] uppercase tracking-wider">
              {editingBlog ? `Edit Blog Article: ${editingBlog.title}` : "Compose New Article"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                required
                placeholder="Article Title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
              />
              <input 
                type="text" 
                placeholder="Cover Image URL"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
              />
              <select 
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
                className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option>Rooftop Gardening</option>
                <option>Vertical Garden</option>
                <option>Plant Care</option>
              </select>
            </div>
            <textarea 
              required
              rows={3}
              placeholder="Content layout text (Supports HTML markup)..."
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800 focus:outline-none focus:border-[#0c1911]"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-[#0c1911] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
                {editingBlog ? "Update Post" : "Publish Post"}
              </button>
              {editingBlog && (
                <button type="button" onClick={() => { setEditingBlog(null); setBlogTitle(""); setBlogUrl(""); setBlogContent(""); }} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List Blogs */}
          <div className="flex flex-col gap-2 mt-2">
            <h4 className="font-serif font-bold text-sm text-[#0c1911]">Published Blogs</h4>
            <div className="flex flex-col gap-2">
              {blogs.map(b => (
                <div key={b._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors text-xs">
                  <div>
                    <span className="font-bold text-[#0c1911] block">{b.title}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Category: {b.category} • Comments count: <b>{b.comments?.length || 0}</b></span>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSelectedBlogComments(b)} className="text-amber-600 hover:underline font-bold">Comments</button>
                    <button type="button" onClick={() => handleEditBlogClick(b)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                    <button type="button" onClick={() => handleDeleteBlog(b._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
