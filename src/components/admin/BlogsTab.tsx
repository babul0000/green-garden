"use client";

import React, { useState } from "react";
import { IBlog } from "@/types";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

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
  handleCreateOrUpdateBlog: (e: React.FormEvent, payload?: any) => void;
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
  handleDeleteComment,
}: BlogsTabProps) {
  const [titleBn, setTitleBn] = useState("");
  const [descBn, setDescBn] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [deleteTarget, setDeleteTarget] = useState<IBlog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (editingBlog) {
      setTitleBn(editingBlog.titleBn || "");
      setDescBn(editingBlog.descBn || "");
      setStatus(editingBlog.status || "PUBLISHED");
    } else {
      setTitleBn("");
      setDescBn("");
      setStatus("PUBLISHED");
    }
  }, [editingBlog]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      titleBn,
      descBn,
      coverImage: blogUrl,
      category: blogCategory,
      content: blogContent,
      status,
    };
    handleCreateOrUpdateBlog(e, payload);
  };

  // Toggle Comment Approval
  const handleToggleCommentApproval = async (blogId: string, commentId: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, approved }),
      });
      if (res.ok) {
        showToast(approved ? "✓ মন্তব্য অনুমোদিত হয়েছে" : "মন্তব্য অপ্রকাশিত রাখা হয়েছে");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans text-[#121813]">
      {selectedBlogComments ? (
        /* Comment moderator view */
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col gap-6">
          <button
            type="button"
            onClick={() => setSelectedBlogComments(null)}
            className="text-xs font-bold text-[#2B4D33] hover:text-[#1E3724] transition-colors w-fit flex items-center gap-1 cursor-pointer font-mono min-h-[40px]"
          >
            ← আর্টিকেল তালিকায় ফিরে যান
          </button>
          <div>
            <h4 className="font-display font-light text-lg text-[#121813] uppercase tracking-wide">
              💬 মন্তব্য মডারেশন: {selectedBlogComments.title}
            </h4>
            <p className="text-xs text-[#75787B] mt-0.5">
              ওয়েবসাইটে পাঠকদের মন্তব্য অনুমোদন (Approve), পেন্ডিং রাখা অথবা মুছে ফেলা পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {selectedBlogComments.comments?.length === 0 ? (
              <p className="text-xs text-[#75787B] italic bg-[#F7F6F2] p-6 rounded-2xl text-center border border-[#D6D2C4]">
                এই আর্টিকেলে এখনো কোনো মন্তব্য করা হয়নি।
              </p>
            ) : (
              selectedBlogComments.comments?.map((c) => {
                const commentId = c.id || (c as any)._id;
                const blogId = selectedBlogComments.id || (selectedBlogComments as any)._id;
                const isApproved = c.approved !== false;

                return (
                  <div
                    key={commentId}
                    className="bg-[#F7F6F2] border border-[#D6D2C4] p-4 rounded-2xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#121813]">{c.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          {isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <p className="text-[#323232] leading-relaxed mt-1 bg-white p-2.5 rounded-xl border border-[#D6D2C4]">
                        {c.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleCommentApproval(blogId, commentId, !isApproved)}
                        className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                          isApproved
                            ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        }`}
                      >
                        {isApproved ? "অনুমোদন বাতিল" : "অনুমোদন করুন"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(blogId, commentId)}
                        className="min-h-[40px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer font-mono"
                      >
                        মুছুন
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Standard Blogs List & Form */
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-display font-light tracking-wide uppercase text-[#121813]">
                  📰 ব্লগ ও আর্টিকেল পাবলিশার
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#2B4D33] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] border border-[#2B4D33]/20">
                  Blog Studio
                </span>
              </div>
              <p className="text-xs text-[#75787B] font-light mt-1">
                গাছের যত্ন, ছাদবাগান টিপস ও ল্যান্ডস্কেপিং গাইডলাইন প্রবন্ধ রচনা ও প্রকাশনা।
              </p>
            </div>
          </div>

          {toastMessage && (
            <div className="p-4 bg-[#E8F5E9] border border-[#2B4D33]/40 text-[#121813] rounded-2xl text-xs font-semibold animate-fade-in flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2B4D33] animate-ping"></span>
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-[#75787B] hover:text-[#121813] font-bold cursor-pointer">
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-7 rounded-2xl border border-[#D6D2C4] shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#2B4D33] uppercase tracking-wider font-mono">
                {editingBlog ? `✏️ আর্টিকেল এডিট করুন: ${editingBlog.title}` : "➕ নতুন আর্টিকেল রচনা করুন"}
              </h4>
              {editingBlog && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogTitle("");
                    setBlogUrl("");
                    setBlogContent("");
                    setTitleBn("");
                    setDescBn("");
                  }}
                  className="text-xs font-mono font-bold text-[#75787B] hover:text-[#121813] cursor-pointer min-h-[44px] px-2 flex items-center"
                >
                  ✕ এডিট বাতিল
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">আর্টিকেল শিরোনাম (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Essential Rooftop Drainage Guidelines"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">বাংলা শিরোনাম (Bangla Title)</label>
                <input
                  type="text"
                  placeholder="যেমন: ছাদবাগানে সঠিক ড্রেনেজ ও মাটির প্রস্তুতি"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">ক্যাটাগরি</label>
                <select
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs font-semibold text-[#121813] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
                >
                  <option value="Rooftop Gardening">Rooftop Gardening</option>
                  <option value="Vertical Garden">Vertical Living Wall</option>
                  <option value="Plant Care">Plant Care & Tree Doctor</option>
                  <option value="Company News">Company Updates</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">পাবলিশ স্ট্যাটাস</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs font-semibold text-[#121813] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
                >
                  <option value="PUBLISHED">প্রকাশিত (Published)</option>
                  <option value="DRAFT">ড্রাফট (Draft)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">সংক্ষিপ্ত বাংলা বিবরণ</label>
                <input
                  type="text"
                  placeholder="এক নজরে আর্টিকেল সারসংক্ষেপ..."
                  value={descBn}
                  onChange={(e) => setDescBn(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
                />
              </div>
            </div>

            {/* Cover Image Upload / URL */}
            <div className="border border-[#D6D2C4] rounded-2xl p-4 bg-[#F7F6F2]/50 space-y-3">
              <label className="text-[11px] font-bold text-[#75787B] block">
                কাভার ইমেজ (Cloudinary Uploader অথবা সরাসরি URL)
              </label>
              <CloudinaryUploader
                value={blogUrl}
                onUpload={(url) => setBlogUrl(url)}
                label="কাভার ছবি আপলোড করুন"
              />
              <input
                type="text"
                placeholder="https://..."
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="w-full bg-white border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
              />
            </div>

            {/* Rich text helper toolbar */}
            <div className="flex flex-wrap gap-2 items-center bg-[#F7F6F2] border border-[#D6D2C4] p-2 rounded-xl text-xs font-bold text-[#121813] font-mono">
              <span className="text-[#75787B] border-r border-[#D6D2C4] pr-2">টুলবার:</span>
              <button
                type="button"
                onClick={() => insertTag("b")}
                className="hover:bg-white px-2 py-1 rounded transition-colors cursor-pointer border border-transparent hover:border-[#D6D2C4]"
              >
                <b>B</b> বোল্ড
              </button>
              <button
                type="button"
                onClick={() => insertTag("i")}
                className="hover:bg-white px-2 py-1 rounded transition-colors cursor-pointer border border-transparent hover:border-[#D6D2C4]"
              >
                <i>I</i> ইটালিক
              </button>
              <button
                type="button"
                onClick={() => insertTag("h2")}
                className="hover:bg-white px-2 py-1 rounded transition-colors cursor-pointer border border-transparent hover:border-[#D6D2C4]"
              >
                H2 হেডিং
              </button>
              <button
                type="button"
                onClick={() => insertTag("h3")}
                className="hover:bg-white px-2 py-1 rounded transition-colors cursor-pointer border border-transparent hover:border-[#D6D2C4]"
              >
                H3 শিরোনাম
              </button>
              <button
                type="button"
                onClick={() => insertTag("p")}
                className="hover:bg-white px-2 py-1 rounded transition-colors cursor-pointer border border-transparent hover:border-[#D6D2C4]"
              >
                প্যারাগ্রাফ
              </button>
              <button
                type="button"
                onClick={() => insertTag("li")}
                className="hover:bg-white px-2 py-1 rounded transition-colors cursor-pointer border border-transparent hover:border-[#D6D2C4]"
              >
                • বুলেট লিস্ট
              </button>
            </div>

            <textarea
              id="blogContentTextarea"
              required
              rows={6}
              placeholder="আর্টিকেলের মূল বিষয়বস্তু লিখুন (HTML ও Markdown ফরম্যাটিং সমর্থিত)..."
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2.5 px-4 rounded-xl text-xs resize-none text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33]"
            />

            <div className="flex gap-2 self-end">
              <button
                type="submit"
                className="min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3724] text-white font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-xs transition-all"
              >
                {editingBlog ? "আর্টিকেল আপডেট করুন" : "আর্টিকেল প্রকাশ করুন"}
              </button>
            </div>
          </form>

          {/* List Blogs */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col gap-4">
            <h4 className="font-bold text-sm text-[#121813] font-mono">
              প্রকাশিত ও সংরক্ষিত আর্টিকেলসমূহ ({blogs.length})
            </h4>

            <div className="flex flex-col gap-3">
              {blogs.map((b) => {
                const blogId = b.id || (b as any)._id;

                return (
                  <div
                    key={blogId}
                    className="bg-[#F7F6F2] border border-[#D6D2C4] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-[#2B4D33]/40 transition-colors text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#121813]">{b.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                            b.status === "DRAFT"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          {b.status || "PUBLISHED"}
                        </span>
                      </div>
                      {b.titleBn && (
                        <span className="text-xs text-[#2B4D33] font-medium block mt-0.5">
                          {b.titleBn}
                        </span>
                      )}
                      <span className="text-[10px] text-[#75787B] block mt-1 font-mono">
                        ক্যাটাগরি: {b.category} • মন্তব্য:{" "}
                        <b className="text-[#2B4D33]">{b.comments?.length || 0} টি</b>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedBlogComments(b)}
                        className="min-h-[40px] px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        💬 মন্তব্য ({b.comments?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditBlogClick(b)}
                        className="min-h-[40px] px-3 py-1 bg-white hover:bg-stone-50 text-[#2B4D33] border border-[#2B4D33]/30 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        ✏️ এডিট
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(b)}
                        className="min-h-[40px] px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        🗑️ মুছুন
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Deletion Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            const targetId = deleteTarget.id || (deleteTarget as any)._id;
            handleDeleteBlog(targetId);
            setDeleteTarget(null);
          }}
          title="আর্টিকেল মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে "${deleteTarget.title}" আর্টিকেলটি মুছে ফেলতে চান?`}
          itemName={deleteTarget.title}
          confirmLabel="হ্যাঁ, মুছে ফেলুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
