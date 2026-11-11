"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface ModeratorBlog {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  status: string;
  createdAt: string;
  _count?: { comments: number };
}

interface ModeratorReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  service?: string | null;
  location?: string | null;
  status: string;
  featured: boolean;
  adminReply?: string | null;
  createdAt: string;
}

interface ModeratorComment {
  id: string;
  name: string;
  text: string;
  approved: boolean;
  createdAt: string;
  blogId: string;
  blog?: { title: string; slug: string } | null;
}

interface ModeratorMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ModeratorCareer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  coverLetter?: string | null;
  resumeUrl: string;
  status: string;
  createdAt: string;
}

interface ModeratorCounts {
  pendingReviews: number;
  pendingComments: number;
  unreadMessages: number;
  pendingCareers: number;
  draftBlogs: number;
}

type ModMenuId = "overview" | "content-queue" | "blogs" | "reviews" | "comments" | "support" | "careers";

export default function ModeratorPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { config } = useSiteConfig();
  const companyName = config?.site_config?.companyName || "A R Green Garden";

  const [activeMenu, setActiveMenu] = useState<ModMenuId>("content-queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [blogs, setBlogs] = useState<ModeratorBlog[]>([]);
  const [reviews, setReviews] = useState<ModeratorReview[]>([]);
  const [comments, setComments] = useState<ModeratorComment[]>([]);
  const [messages, setMessages] = useState<ModeratorMessage[]>([]);
  const [careers, setCareers] = useState<ModeratorCareer[]>([]);
  const [counts, setCounts] = useState<ModeratorCounts>({
    pendingReviews: 0,
    pendingComments: 0,
    unreadMessages: 0,
    pendingCareers: 0,
    draftBlogs: 0,
  });
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const userRole = String(user?.role || "").toUpperCase();
  const isAuthorized = ["MODERATOR", "ADMIN"].includes(userRole);
  const isAdmin = userRole === "ADMIN";

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const fetchQueue = useCallback(async () => {
    if (!isAuthorized) {
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gg_auth_token") : null;
      const res = await fetch("/api/moderator", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice("error", data.error || "Failed to load moderation queue.");
        return;
      }
      setBlogs(data.blogs || []);
      setReviews(data.reviews || []);
      setComments(data.comments || []);
      setMessages(data.messages || []);
      setCareers(data.careers || []);
      if (data.counts) setCounts(data.counts);
      const initialReplies: Record<string, string> = {};
      (data.reviews || []).forEach((r: ModeratorReview) => {
        if (r.adminReply) initialReplies[r.id] = r.adminReply;
      });
      setReplyDrafts((prev) => ({ ...initialReplies, ...prev }));
    } catch {
      showNotice("error", "Unable to reach moderation API.");
    } finally {
      setDataLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (!authLoading) {
      fetchQueue();
    }
  }, [authLoading, fetchQueue]);

  const handlePatch = async (
    entity: "blog" | "review" | "comment" | "message" | "career",
    id: string,
    data: Record<string, any>,
    successMsg: string
  ) => {
    setBusyId(id);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gg_auth_token") : null;
      const res = await fetch("/api/moderator", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ entity, id, data }),
      });
      const payload = await res.json();
      if (!res.ok) {
        showNotice("error", payload.error || "Update failed.");
        return;
      }
      showNotice("success", successMsg);
      await fetchQueue();
    } catch {
      showNotice("error", "Network error updating item.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (
    entity: "blog" | "review" | "comment" | "message" | "career",
    id: string,
    label: string
  ) => {
    if (!confirm(`Delete "${label}" permanently from PostgreSQL?`)) return;
    setBusyId(id);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gg_auth_token") : null;
      const res = await fetch(`/api/moderator?entity=${encodeURIComponent(entity)}&id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: "include",
      });
      const payload = await res.json();
      if (!res.ok) {
        showNotice("error", payload.error || "Delete failed.");
        return;
      }
      showNotice("success", `Deleted "${label}".`);
      await fetchQueue();
    } catch {
      showNotice("error", "Network error deleting item.");
    } finally {
      setBusyId(null);
    }
  };

  const q = searchQuery.trim().toLowerCase();
  const match = (vals: Array<string | null | undefined>) =>
    !q || vals.some((v) => String(v || "").toLowerCase().includes(q));

  const filteredBlogs = useMemo(
    () => blogs.filter((b) => match([b.title, b.author, b.category, b.status])),
    [blogs, q]
  );
  const filteredReviews = useMemo(
    () => reviews.filter((r) => match([r.name, r.text, r.service, r.location, r.status])),
    [reviews, q]
  );
  const filteredComments = useMemo(
    () => comments.filter((c) => match([c.name, c.text, c.blog?.title])),
    [comments, q]
  );
  const filteredMessages = useMemo(
    () => messages.filter((m) => match([m.name, m.email, m.phone, m.subject, m.message])),
    [messages, q]
  );
  const filteredCareers = useMemo(
    () => careers.filter((c) => match([c.name, c.email, c.phone, c.department, c.status])),
    [careers, q]
  );

  const totalPendingCount =
    counts.pendingReviews +
    counts.pendingComments +
    counts.unreadMessages +
    counts.pendingCareers +
    counts.draftBlogs;

  const pendingUnifiedQueue = useMemo(() => {
    const items: Array<{
      key: string;
      entity: "blog" | "review" | "comment" | "message" | "career";
      id: string;
      badge: string;
      title: string;
      meta: string;
      detail: string;
      date: string;
      approveLabel: string;
      approveData: Record<string, any>;
    }> = [];

    reviews
      .filter((r) => r.status !== "Approved")
      .forEach((r) =>
        items.push({
          key: `review-${r.id}`,
          entity: "review",
          id: r.id,
          badge: "Review",
          title: `${r.name} (${r.rating}★)`,
          meta: r.service || r.location || "Client Review",
          detail: r.text,
          date: r.createdAt,
          approveLabel: "Approve Review",
          approveData: { status: "Approved" },
        })
      );

    comments
      .filter((c) => !c.approved)
      .forEach((c) =>
        items.push({
          key: `comment-${c.id}`,
          entity: "comment",
          id: c.id,
          badge: "Comment",
          title: c.name,
          meta: c.blog?.title || "Blog Comment",
          detail: c.text,
          date: c.createdAt,
          approveLabel: "Approve Comment",
          approveData: { approved: true },
        })
      );

    messages
      .filter((m) => !m.isRead)
      .forEach((m) =>
        items.push({
          key: `message-${m.id}`,
          entity: "message",
          id: m.id,
          badge: "Inbox",
          title: m.subject || m.name,
          meta: `${m.name} • ${m.email}`,
          detail: m.message,
          date: m.createdAt,
          approveLabel: "Mark Read",
          approveData: { isRead: true },
        })
      );

    blogs
      .filter((b) => b.status !== "PUBLISHED")
      .forEach((b) =>
        items.push({
          key: `blog-${b.id}`,
          entity: "blog",
          id: b.id,
          badge: "Blog Draft",
          title: b.title,
          meta: `${b.author} • ${b.category}`,
          detail: `Current status: ${b.status}`,
          date: b.createdAt,
          approveLabel: "Publish Blog",
          approveData: { status: "PUBLISHED" },
        })
      );

    careers
      .filter((c) => c.status === "Pending")
      .forEach((c) =>
        items.push({
          key: `career-${c.id}`,
          entity: "career",
          id: c.id,
          badge: "Career",
          title: `${c.name} — ${c.department}`,
          meta: `${c.email} • ${c.phone}`,
          detail: c.coverLetter || "No cover letter provided.",
          date: c.createdAt,
          approveLabel: "Shortlist Candidate",
          approveData: { status: "Shortlisted" },
        })
      );

    return items
      .filter((item) => match([item.badge, item.title, item.meta, item.detail]))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, comments, messages, blogs, careers, q]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121A14] flex items-center justify-center text-[#E4E2D7] font-mono text-xs">
        Loading Moderator Studio...
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#121A14] flex items-center justify-center p-6 text-[#E4E2D7] font-sans">
        <div className="max-w-md w-full bg-[#18221A] border border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="text-3xl">🛡️</div>
          <h1 className="text-2xl font-display font-bold">Moderator Studio Access Required</h1>
          <p className="text-xs text-white/60 leading-relaxed">
            {!user
              ? "Please sign in with a Moderator or Admin account to moderate live studio records."
              : `Signed in as ${user.email} (${user.role}). Only Moderator or Admin roles can access this workspace.`}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            {!user ? (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-stone-950 font-mono font-bold text-xs"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-stone-950 font-mono font-bold text-xs"
              >
                Return Home
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const menuItems: Array<{ id: ModMenuId; label: string; badge?: number }> = [
    { id: "overview", label: "Dashboard Overview" },
    { id: "content-queue", label: "Pending Queue", badge: totalPendingCount },
    { id: "reviews", label: "Review Moderation", badge: counts.pendingReviews },
    { id: "comments", label: "Blog Comments", badge: counts.pendingComments },
    { id: "blogs", label: "Editorial Articles", badge: counts.draftBlogs },
    { id: "support", label: "Contact Inquiries", badge: counts.unreadMessages },
    { id: "careers", label: "Career Applications", badge: counts.pendingCareers },
  ];

  return (
    <div className="min-h-screen bg-[#121A14] text-[#E4E2D7] relative overflow-hidden flex p-3 md:p-6 font-sans studio-portal-dark">
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[1600px] mx-auto bg-[#18221A]/85 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-white/10 flex flex-col lg:flex-row overflow-hidden min-h-[860px] relative z-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-68 bg-[#0d1610]/95 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/10 text-white flex flex-col justify-between p-6 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shadow-inner text-emerald-400">
                🌿
              </div>
              <div>
                <span className="text-base font-display font-bold tracking-tight text-[#E4E2D7] block leading-none">
                  {companyName}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-1 block">
                  Moderator Studio
                </span>
              </div>
            </div>

            <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5">
              {menuItems.map((item) => {
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "text-stone-950 bg-emerald-400 font-bold shadow-lg shadow-emerald-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {typeof item.badge === "number" && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isActive
                            ? "bg-stone-950 text-emerald-300"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-300 shrink-0">
                {user.name?.[0]?.toUpperCase() || "M"}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-white/40 uppercase block">{userRole}</span>
                <span className="text-xs font-bold text-[#E4E2D7] truncate block">{user.name}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-[11px] font-mono text-rose-300 hover:text-rose-200 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 cursor-pointer shrink-0"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col p-5 md:p-8 overflow-y-auto space-y-6">
          {/* Topbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7] tracking-tight">
                Live Moderation Console
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                PostgreSQL Live
              </span>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Admin Studio →
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search reviews, blogs, comments, inbox..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 sm:w-72 bg-black/40 border border-white/15 rounded-full px-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400 transition-all"
              />
              <button
                type="button"
                onClick={fetchQueue}
                className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-white cursor-pointer"
              >
                ↻ Sync
              </button>
            </div>
          </div>

          {notice && (
            <div
              className={`px-4 py-3 rounded-2xl border text-xs font-medium flex items-center justify-between ${
                notice.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <span>{notice.text}</span>
              <button onClick={() => setNotice(null)} className="ml-3 text-white/60 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
          )}

          {/* Overview Metrics */}
          {(activeMenu === "overview" || activeMenu === "content-queue") && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Pending Reviews", val: counts.pendingReviews, tab: "reviews" as ModMenuId },
                { label: "Pending Comments", val: counts.pendingComments, tab: "comments" as ModMenuId },
                { label: "Unread Inquiries", val: counts.unreadMessages, tab: "support" as ModMenuId },
                { label: "Draft Blogs", val: counts.draftBlogs, tab: "blogs" as ModMenuId },
                { label: "Pending Careers", val: counts.pendingCareers, tab: "careers" as ModMenuId },
              ].map((stat) => (
                <button
                  key={stat.label}
                  type="button"
                  onClick={() => setActiveMenu(stat.tab)}
                  className="bg-black/30 hover:bg-black/45 border border-white/10 rounded-2xl p-4 text-left transition-all cursor-pointer"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-display font-bold text-emerald-300 mt-1 block">
                    {stat.val}
                  </span>
                </button>
              ))}
            </div>
          )}

          {dataLoading ? (
            <div className="py-16 text-center text-xs font-mono text-white/50">
              Synchronizing records from database...
            </div>
          ) : (
            <div className="space-y-4">
              {/* OVERVIEW & PENDING QUEUE */}
              {(activeMenu === "overview" || activeMenu === "content-queue") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-display font-bold text-[#E4E2D7]">
                      Unified Action Queue ({pendingUnifiedQueue.length})
                    </h2>
                    <span className="text-[11px] font-mono text-white/40">
                      Total Loaded Records: {blogs.length + reviews.length + comments.length + messages.length + careers.length}
                    </span>
                  </div>

                  {pendingUnifiedQueue.length === 0 ? (
                    <div className="bg-black/25 border border-white/10 rounded-3xl p-10 text-center text-xs text-white/60">
                      ✓ Moderation queue is completely clear. Use the left tabs to inspect all published/historical items.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingUnifiedQueue.map((item) => (
                        <div
                          key={item.key}
                          className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                                {item.badge}
                              </span>
                              <span className="font-bold text-sm text-[#E4E2D7]">{item.title}</span>
                              <span className="text-[11px] font-mono text-white/40">• {item.meta}</span>
                            </div>
                            <p className="text-xs text-white/70 line-clamp-2">{item.detail}</p>
                            <span className="text-[10px] font-mono text-white/35 block">
                              {new Date(item.date).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              disabled={busyId === item.id}
                              onClick={() =>
                                handlePatch(item.entity, item.id, item.approveData, `${item.badge} updated.`)
                              }
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono font-bold text-xs cursor-pointer disabled:opacity-50"
                            >
                              ✓ {item.approveLabel}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === item.id}
                              onClick={() => handleDelete(item.entity, item.id, item.title)}
                              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-mono text-xs cursor-pointer disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeMenu === "reviews" && (
                <div className="space-y-3">
                  <h2 className="text-base font-display font-bold text-[#E4E2D7]">
                    Client Reviews ({filteredReviews.length})
                  </h2>
                  {filteredReviews.map((rev) => (
                    <div key={rev.id} className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-white">{rev.name}</span>
                            <span className="text-amber-400 text-xs font-mono">{"★".repeat(rev.rating)}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                rev.status === "Approved"
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {rev.status}
                            </span>
                            {rev.featured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-white/45 mt-0.5">
                            {rev.service || "General Service"} • {rev.location || "Dhaka"} •{" "}
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={busyId === rev.id}
                            onClick={() =>
                              handlePatch(
                                "review",
                                rev.id,
                                { status: rev.status === "Approved" ? "Rejected" : "Approved" },
                                `Review marked as ${rev.status === "Approved" ? "Rejected" : "Approved"}.`
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono cursor-pointer"
                          >
                            {rev.status === "Approved" ? "Reject" : "✓ Approve"}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === rev.id}
                            onClick={() =>
                              handlePatch(
                                "review",
                                rev.id,
                                { featured: !rev.featured },
                                `Featured flag ${!rev.featured ? "enabled" : "removed"}.`
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                          >
                            {rev.featured ? "Unfeature" : "★ Feature"}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === rev.id}
                            onClick={() => handleDelete("review", rev.id, rev.name)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-mono cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">{rev.text}</p>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Write studio reply..."
                          value={replyDrafts[rev.id] ?? rev.adminReply ?? ""}
                          onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [rev.id]: e.target.value }))}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/30"
                        />
                        <button
                          type="button"
                          disabled={busyId === rev.id}
                          onClick={() =>
                            handlePatch(
                              "review",
                              rev.id,
                              { adminReply: replyDrafts[rev.id] ?? "" },
                              "Admin reply saved."
                            )
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono font-bold text-xs cursor-pointer"
                        >
                          Save Reply
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredReviews.length === 0 && (
                    <p className="text-xs text-white/50 text-center py-8">No matching reviews.</p>
                  )}
                </div>
              )}

              {/* COMMENTS TAB */}
              {activeMenu === "comments" && (
                <div className="space-y-3">
                  <h2 className="text-base font-display font-bold text-[#E4E2D7]">
                    Blog Comments ({filteredComments.length})
                  </h2>
                  {filteredComments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{c.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                              c.approved ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
                            }`}
                          >
                            {c.approved ? "Approved" : "Hidden"}
                          </span>
                          <span className="text-[11px] font-mono text-white/40">on {c.blog?.title || "Article"}</span>
                        </div>
                        <p className="text-xs text-white/75">{c.text}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={busyId === c.id}
                          onClick={() =>
                            handlePatch(
                              "comment",
                              c.id,
                              { approved: !c.approved },
                              c.approved ? "Comment hidden." : "Comment approved."
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono cursor-pointer"
                        >
                          {c.approved ? "Hide" : "✓ Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === c.id}
                          onClick={() => handleDelete("comment", c.id, c.name)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-mono cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredComments.length === 0 && (
                    <p className="text-xs text-white/50 text-center py-8">No matching comments.</p>
                  )}
                </div>
              )}

              {/* BLOGS TAB */}
              {activeMenu === "blogs" && (
                <div className="space-y-3">
                  <h2 className="text-base font-display font-bold text-[#E4E2D7]">
                    Editorial Articles ({filteredBlogs.length})
                  </h2>
                  {filteredBlogs.map((b) => (
                    <div
                      key={b.id}
                      className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{b.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                              b.status === "PUBLISHED"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-amber-500/15 text-amber-300"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-white/50 mt-0.5">
                          By {b.author} • {b.category} • {b._count?.comments || 0} comments
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={busyId === b.id}
                          onClick={() =>
                            handlePatch(
                              "blog",
                              b.id,
                              { status: b.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
                              b.status === "PUBLISHED" ? "Moved blog to DRAFT." : "Published blog article."
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono cursor-pointer"
                        >
                          {b.status === "PUBLISHED" ? "Move to Draft" : "Publish"}
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            disabled={busyId === b.id}
                            onClick={() => handleDelete("blog", b.id, b.title)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-mono cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredBlogs.length === 0 && (
                    <p className="text-xs text-white/50 text-center py-8">No matching blog articles.</p>
                  )}
                </div>
              )}

              {/* CONTACT MESSAGES TAB */}
              {activeMenu === "support" && (
                <div className="space-y-3">
                  <h2 className="text-base font-display font-bold text-[#E4E2D7]">
                    Contact & Consultation Inquiries ({filteredMessages.length})
                  </h2>
                  {filteredMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        m.isRead ? "bg-black/20 border-white/10" : "bg-emerald-950/35 border-emerald-500/30"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <span className="text-xs font-mono text-emerald-300">{m.email}</span>
                          {m.phone && <span className="text-xs font-mono text-white/60">• {m.phone}</span>}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                              m.isRead ? "bg-white/10 text-white/60" : "bg-emerald-500/20 text-emerald-300 font-bold"
                            }`}
                          >
                            {m.isRead ? "Read" : "Unread"}
                          </span>
                        </div>
                        {m.subject && <p className="text-xs font-semibold text-white/90">{m.subject}</p>}
                        <p className="text-xs text-white/70">{m.message}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={busyId === m.id}
                          onClick={() =>
                            handlePatch(
                              "message",
                              m.id,
                              { isRead: !m.isRead },
                              m.isRead ? "Marked unread." : "Marked as read."
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                        >
                          {m.isRead ? "Mark Unread" : "✓ Mark Read"}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === m.id}
                          onClick={() => handleDelete("message", m.id, m.name)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-mono cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredMessages.length === 0 && (
                    <p className="text-xs text-white/50 text-center py-8">No matching inquiries.</p>
                  )}
                </div>
              )}

              {/* CAREERS TAB */}
              {activeMenu === "careers" && (
                <div className="space-y-3">
                  <h2 className="text-base font-display font-bold text-[#E4E2D7]">
                    Career Applications ({filteredCareers.length})
                  </h2>
                  {filteredCareers.map((c) => (
                    <div
                      key={c.id}
                      className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{c.name}</span>
                          <span className="text-xs font-mono text-emerald-300">{c.department}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white/80">
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-white/50">
                          {c.email} • {c.phone}
                        </p>
                        {c.coverLetter && <p className="text-xs text-white/75 line-clamp-2">{c.coverLetter}</p>}
                        {c.resumeUrl && (
                          <a
                            href={c.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[11px] font-mono text-emerald-400 hover:underline"
                          >
                            View Resume / Portfolio ↗
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0 flex-wrap">
                        <button
                          type="button"
                          disabled={busyId === c.id}
                          onClick={() =>
                            handlePatch("career", c.id, { status: "Shortlisted" }, `${c.name} shortlisted.`)
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono cursor-pointer"
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          disabled={busyId === c.id}
                          onClick={() =>
                            handlePatch("career", c.id, { status: "Rejected" }, `${c.name} rejected.`)
                          }
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                        >
                          Reject
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            disabled={busyId === c.id}
                            onClick={() => handleDelete("career", c.id, c.name)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-mono cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredCareers.length === 0 && (
                    <p className="text-xs text-white/50 text-center py-8">No matching career applications.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
