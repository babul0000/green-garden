"use client";

import React from "react";
import { IBlog } from "@/types";

interface BlogsTabProps {
  blogs?: IBlog[];
  blogTitle: string;
  setBlogTitle: (val: string) => void;
  blogUrl: string;
  setBlogUrl: (val: string) => void;
  blogCategory: string;
  setBlogCategory: (val: string) => void;
  blogContent: string;
  setBlogContent: (val: string) => void;
  editingBlog: IBlog | null;
  setEditingBlog: (val: IBlog | null) => void;
  selectedBlogComments: IBlog | null;
  setSelectedBlogComments: (val: IBlog | null) => void;
  handleCreateOrUpdateBlog: (e: React.FormEvent) => void;
  handleEditBlogClick: (blog: IBlog) => void;
  handleDeleteBlog: (id?: string) => void;
  handleDeleteComment: (blogId?: string, commentId?: string) => void;
}

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
}: BlogsTabProps) {

  const insertTag = (tag: string) => {
    const textarea = document.getElementById("blogContentTextarea") as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = `<${tag}>${selected || "content text"}</${tag}>`;
    setBlogContent(text.substring(0, start) + replacement + text.substring(end));
    textarea.focus();
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      {selectedBlogComments ? (
        /* Comment moderator view */
        <div className="flex flex-col gap-6">
          <button type="button" onClick={() => setSelectedBlogComments(null)} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors w-fit flex items-center gap-1 cursor-pointer font-mono">
            ← Back to Article Manager
          </button>
          <div>
            <h4 className="font-serif font-bold text-lg text-white">Moderate Comments: {selectedBlogComments.title}</h4>
            <p className="text-xs text-stone-400 mt-0.5">Approve, block, or delete comments written by website visitors.</p>
          </div>

          <div className="flex flex-col gap-3">
            {selectedBlogComments.comments?.length === 0 ? (
              <p className="text-xs text-stone-400 italic bg-black/40 p-6 rounded-2xl text-center border border-white/10">No comments written for this post.</p>
            ) : (
              selectedBlogComments.comments?.map(c => (
                <div key={c.id || c._id} className="bg-black/30 border border-white/10 p-4 rounded-2xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">{c.name}</span>
                    <p className="text-stone-300 leading-relaxed mt-1">{c.text}</p>
                  </div>
                  <button type="button" onClick={() => handleDeleteComment(selectedBlogComments.id || selectedBlogComments._id, c.id || c._id)} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-mono">
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
            <h3 className="font-sans font-bold text-lg text-white">ব্লগ ও আর্টিকেলস • Botanical Blogs & News</h3>
            <p className="text-xs text-stone-400 mt-0.5">Write plant tips, garden maintenance checklists, and publish rich HTML article layouts.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateOrUpdateBlog} className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
            <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">
              {editingBlog ? `Edit Blog Article: ${editingBlog.title}` : "Compose New Article"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                required
                placeholder="Article Title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
              <input 
                type="text" 
                placeholder="Cover Image URL"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
              <select 
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
                className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Rooftop Gardening" className="bg-[#121A14]">Rooftop Gardening</option>
                <option value="Vertical Garden" className="bg-[#121A14]">Vertical Garden</option>
                <option value="Plant Care" className="bg-[#121A14]">Plant Care</option>
                <option value="Company News" className="bg-[#121A14]">Company News</option>
              </select>
            </div>

            {/* Rich text helper toolbar */}
            <div className="flex flex-wrap gap-2 items-center bg-black/50 border border-white/15 p-2 rounded-xl text-xs font-bold text-stone-300 font-mono">
              <span className="text-stone-400 border-r border-white/10 pr-2">Composer Helper Tools:</span>
              <button type="button" onClick={() => insertTag("b")} className="hover:text-emerald-400 hover:bg-white/5 px-2 py-1 rounded transition-colors cursor-pointer"><b>B</b> Bold</button>
              <button type="button" onClick={() => insertTag("i")} className="hover:text-emerald-400 hover:bg-white/5 px-2 py-1 rounded transition-colors cursor-pointer"><i>I</i> Italic</button>
              <button type="button" onClick={() => insertTag("h3")} className="hover:text-emerald-400 hover:bg-white/5 px-2 py-1 rounded transition-colors cursor-pointer">H3 Title</button>
              <button type="button" onClick={() => insertTag("p")} className="hover:text-emerald-400 hover:bg-white/5 px-2 py-1 rounded transition-colors cursor-pointer">P Paragraph</button>
              <button type="button" onClick={() => insertTag("li")} className="hover:text-emerald-400 hover:bg-white/5 px-2 py-1 rounded transition-colors cursor-pointer">• List Item</button>
            </div>

            <textarea 
              id="blogContentTextarea"
              required
              rows={4}
              placeholder="Content layout text (Supports HTML markup)..."
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs resize-none text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 transition-all">
                {editingBlog ? "Update Post" : "Publish Post"}
              </button>
              {editingBlog && (
                <button 
                  type="button" 
                  onClick={() => { setEditingBlog(null); setBlogTitle(""); setBlogUrl(""); setBlogContent(""); }} 
                  className="bg-white/10 hover:bg-white/20 text-white font-bold font-mono text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List Blogs */}
          <div className="flex flex-col gap-3 mt-2">
            <h4 className="font-sans font-bold text-sm text-white font-mono">Published Blogs ({blogs.length})</h4>
            <div className="flex flex-col gap-2">
              {blogs.map(b => (
                <div key={b.id || b._id} className="bg-black/30 border border-white/10 p-4 rounded-2xl flex justify-between items-center shadow-lg hover:border-emerald-500/40 transition-colors text-xs">
                  <div>
                    <span className="font-bold text-white block">{b.title}</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">Category: {b.category} • Comments: <b className="text-emerald-400">{b.comments?.length || 0}</b></span>
                  </div>
                  <div className="flex gap-3 font-mono">
                    <button type="button" onClick={() => setSelectedBlogComments(b)} className="text-amber-300 hover:text-amber-200 font-bold cursor-pointer">Comments</button>
                    <button type="button" onClick={() => handleEditBlogClick(b)} className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer">Edit</button>
                    <button type="button" onClick={() => handleDeleteBlog(b.id || b._id)} className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer">Delete</button>
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
