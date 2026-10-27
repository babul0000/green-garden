"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type { IBooking, IProject, IGalleryItem, IBlog, IService, IMessage, ICareerApplication, ISetting } from "@/types";

// Import modular admin components
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import OverviewTab from "@/components/admin/OverviewTab";
import BookingsTab from "@/components/admin/BookingsTab";
import ServicesTab from "@/components/admin/ServicesTab";
import ProjectsTab from "@/components/admin/ProjectsTab";
import GalleryTab from "@/components/admin/GalleryTab";
import BlogsTab from "@/components/admin/BlogsTab";
import CareersTab from "@/components/admin/CareersTab";
import SettingsTab from "@/components/admin/SettingsTab";
import NavbarConfigTab from "@/components/admin/NavbarConfigTab";
import HeroConfigTab from "@/components/admin/HeroConfigTab";
import SecurityTab from "@/components/admin/SecurityTab";
import ContactInboxTab from "@/components/admin/ContactInboxTab";

// Import new modular admin components
import UsersTab from "@/components/admin/UsersTab";
import RolesTab from "@/components/admin/RolesTab";
import ContentTab from "@/components/admin/ContentTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import ActivityLogTab from "@/components/admin/ActivityLogTab";

// Import ERP Masterplan Components (Steps 4 - 10)
import DesignRequestsTab from "@/components/admin/DesignRequestsTab";
import TreeDoctorTab from "@/components/admin/TreeDoctorTab";
import EmployeesTab from "@/components/admin/EmployeesTab";
import MaintenanceSchedulerTab from "@/components/admin/MaintenanceSchedulerTab";
import FinanceInventoryTab from "@/components/admin/FinanceInventoryTab";
import DigitalServiceCardTab from "@/components/admin/DigitalServiceCardTab";

// New Phase 2 Tabs
import HomepageSectionsTab from "@/components/admin/HomepageSectionsTab";
import ContentManagerTab from "@/components/admin/ContentManagerTab";

// Mobile Shell Navigation (Phase 1)
import MobileBottomBar from "@/components/admin/MobileBottomBar";

// RBAC Permissions
import { canAccessTab, canEnterAdmin, getDefaultTabForRole } from "@/lib/rbac";

export default function AdminPage() {
  const { user, loading: isPending } = useAuth();
  const sessionData = user ? { user } : null;
  const [activeTab, setActiveTab] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper to read ?tab= parameter safely on client without SSR window access
  const getTabFromUrl = (): string | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("tab");
  };

  // Load initial tab on client mount: Priority: ?tab= from URL -> localStorage -> role default
  useEffect(() => {
    if (!user) return;
    if (!canEnterAdmin(user.role)) return;

    const urlTab = getTabFromUrl();
    const savedTab = typeof window !== "undefined" ? localStorage.getItem("adminActiveTab") : null;

    let targetTab: string;
    if (urlTab && canAccessTab(user.role, urlTab)) {
      targetTab = urlTab;
    } else if (savedTab && canAccessTab(user.role, savedTab)) {
      targetTab = savedTab;
    } else {
      targetTab = getDefaultTabForRole(user.role);
    }

    setActiveTab(targetTab);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveTab", targetTab);
      // Synchronize URL without adding an extra history stack entry on initial page load
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.get("tab") !== targetTab) {
        currentUrl.searchParams.set("tab", targetTab);
        window.history.replaceState({ tab: targetTab }, "", currentUrl.toString());
      }
    }
  }, [user]);

  // Listen to browser / Android Back & Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const poppedTab = event.state?.tab || getTabFromUrl();
      if (poppedTab && user && canAccessTab(user.role, poppedTab)) {
        setActiveTab(poppedTab);
        setSidebarOpen(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("adminActiveTab", poppedTab);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user]);

  // Save tab to URL (pushState) and localStorage on tab switch, and auto-close mobile drawer
  const handleTabChange = (tab: string, pushHistory = true) => {
    const targetTab = tab === "quotations" ? "finance" : tab;
    if (user && !canAccessTab(user.role, targetTab)) return;
    
    setActiveTab(targetTab);
    setSidebarOpen(false);

    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveTab", targetTab);
      if (pushHistory) {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.get("tab") !== targetTab) {
          currentUrl.searchParams.set("tab", targetTab);
          window.history.pushState({ tab: targetTab }, "", currentUrl.toString());
        }
      }
    }
  };

  // State for prefilling Quotation from DesignRequests
  const [quotationPrefill, setQuotationPrefill] = useState<{
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  } | null>(null);

  // State arrays loaded from database
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [gallery, setGallery] = useState<IGalleryItem[]>([]);
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [careers, setCareers] = useState<ICareerApplication[]>([]);
  const [settings, setSettings] = useState<ISetting>({
    title: "AR Green Garden",
    phone: "01883012641",
    email: "info@argreengarden.com",
    address: "42/A, Road 9/A, Dhanmondi, Dhaka",
    fbPage: "https://facebook.com/argreengarden",
    youtube: "https://youtube.com/argreengarden",
    themeColor: "#15803d",
    seoDescription: "Premium Landscaping & Garden Design website in Bangladesh"
  });

  // Edit target states (If null -> in Create mode. If populated -> in Edit mode)
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [editingGallery, setEditingGallery] = useState<IGalleryItem | null>(null);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);

  // Form states for Services
  const [serviceLabel, setServiceLabel] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceIcon, setServiceIcon] = useState("🌱");

  // Form states for Projects
  const [projName, setProjName] = useState("");
  const [projClient, setProjClient] = useState("");
  const [projCategory, setProjCategory] = useState("Residential");
  const [projUrl, setProjUrl] = useState("");
  const [projLocation, setProjLocation] = useState("");
  const [projDuration, setProjDuration] = useState("");
  const [projBudget, setProjBudget] = useState("");
  const [projChallenges, setProjChallenges] = useState("");
  const [projSolution, setProjSolution] = useState("");
  const [projTestimonialName, setProjTestimonialName] = useState("");
  const [projTestimonialText, setProjTestimonialText] = useState("");
  const [projFeatured, setProjFeatured] = useState(false);

  // Form states for Gallery
  const [galTitle, setGalTitle] = useState("");
  const [galUrl, setGalUrl] = useState("");
  const [galBeforeUrl, setGalBeforeUrl] = useState("");
  const [galCategory, setGalCategory] = useState("Rooftop");
  const [galCaption, setGalCaption] = useState("");

  // Form states for Blogs
  const [blogTitle, setBlogTitle] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [blogCategory, setBlogCategory] = useState("Rooftop Gardening");
  const [blogContent, setBlogContent] = useState("");

  // Blog comment moderator targets
  const [selectedBlogComments, setSelectedBlogComments] = useState<IBlog | null>(null);

  // Settings saving state
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const norm = (arr: any) =>
    Array.isArray(arr) ? arr.map((x: any) => ({ ...x, _id: x.id || x._id, id: x.id || x._id })) : [];

  const fetchData = async () => {
    try {
      // Bookings
      const resBookings = await fetch("/api/bookings", { cache: "no-store" });
      if (resBookings.ok) setBookings(norm(await resBookings.json()));

      // Projects
      const resProjects = await fetch("/api/projects", { cache: "no-store" });
      if (resProjects.ok) setProjects(norm(await resProjects.json()));

      // Gallery
      const resGallery = await fetch("/api/gallery", { cache: "no-store" });
      if (resGallery.ok) setGallery(norm(await resGallery.json()));

      // Blogs
      const resBlogs = await fetch("/api/blogs", { cache: "no-store" });
      if (resBlogs.ok) setBlogs(norm(await resBlogs.json()));

      // Services
      const resServices = await fetch("/api/services", { cache: "no-store" });
      if (resServices.ok) setServices(norm(await resServices.json()));

      // Messages
      const resMsg = await fetch("/api/messages", { cache: "no-store" });
      if (resMsg.ok) setMessages(norm(await resMsg.json()));

      // Careers
      const resCar = await fetch("/api/careers", { cache: "no-store" });
      if (resCar.ok) setCareers(norm(await resCar.json()));

      // Settings
      const resSettings = await fetch("/api/settings", { cache: "no-store" });
      if (resSettings.ok) {
        const data = await resSettings.json();
        if (data?.value) setSettings(data.value);
      }
    } catch (error) {
      console.error("Database fetch failed:", error);
    }
  };

  useEffect(() => {
    const userRole = String((sessionData?.user as any)?.role || "").toUpperCase();
    if (sessionData?.user && (userRole === "ADMIN" || userRole === "EDITOR" || userRole === "MODERATOR")) {
      fetchData();
    }
  }, [sessionData]);

  // --- BOOKING OPERATIONS ---
  const handleUpdateBooking = async (id: string, status: string, staff: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, assignedStaff: staff })
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to update booking: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Network error updating booking: " + err.message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!id || !confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to delete booking: " + (err.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Network error deleting booking: " + err.message);
    }
  };

  // --- SERVICES CRUD ---
  const handleCreateOrUpdateService = async (e: React.FormEvent, customPayload: any = null) => {
    e.preventDefault();
    const payload = customPayload || {
      label: serviceLabel,
      slug: serviceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      desc: serviceDesc,
      icon: serviceIcon
    };

    try {
      const srvId = editingService?.id || editingService?._id;
      let res;
      if (srvId) {
        res = await fetch(`/api/services/${srvId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        setServiceLabel("");
        setServiceDesc("");
        setServiceIcon("🌱");
        setEditingService(null);
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to save service: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error saving service: " + err.message);
    }
  };

  const handleEditServiceClick = (srv: IService) => {
    setEditingService(srv);
    setServiceLabel(srv.label || srv.title || "");
    setServiceDesc(srv.desc || srv.description || "");
    setServiceIcon(srv.icon || "🌱");
  };

  const handleDeleteService = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to delete service: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error deleting service: " + err.message);
    }
  };

  // --- PROJECTS CRUD ---
  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: projName,
      slug: projName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now()}`,
      clientName: projClient,
      category: projCategory,
      location: projLocation,
      afterImage: projUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
      images: projUrl ? [projUrl] : [],
      budget: projBudget ? parseFloat(projBudget) : null,
      notes: `${projChallenges ? "Challenges: " + projChallenges : ""} ${projSolution ? "Solution: " + projSolution : ""}`.trim(),
      description: projSolution || projChallenges || `Project located in ${projLocation}`,
      featured: projFeatured
    };

    try {
      const projId = editingProject?.id || editingProject?._id;
      let res;
      if (projId) {
        res = await fetch(`/api/projects/${projId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        resetProjectForm();
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to save project: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error saving project: " + err.message);
    }
  };

  const resetProjectForm = () => {
    setProjName("");
    setProjClient("");
    setProjCategory("Residential");
    setProjUrl("");
    setProjLocation("");
    setProjDuration("");
    setProjBudget("");
    setProjChallenges("");
    setProjSolution("");
    setProjTestimonialName("");
    setProjTestimonialText("");
    setProjFeatured(false);
    setEditingProject(null);
  };

  const handleEditProjectClick = (proj: IProject) => {
    setEditingProject(proj);
    setProjName(proj.name || proj.title || "");
    setProjClient(proj.client || (proj as any).clientName || "");
    setProjCategory(proj.category || "Residential");
    setProjUrl(proj.imageUrl || (proj as any).afterImage || "");
    setProjLocation(proj.location || "");
    setProjDuration(proj.duration || "");
    setProjBudget(proj.budgetRange || (proj as any).budget ? String((proj as any).budget) : "");
    setProjChallenges(proj.challenges || "");
    setProjSolution(proj.solution || "");
    setProjTestimonialName(proj.clientTestimonial?.name || "");
    setProjTestimonialText(proj.clientTestimonial?.text || "");
    setProjFeatured(proj.featured || false);
  };

  const handleDeleteProject = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this project case study?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to delete project: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error deleting project: " + err.message);
    }
  };

  // --- GALLERY CRUD ---
  const handleCreateOrUpdateGallery = async (e: React.FormEvent, customPayload: any = null) => {
    e.preventDefault();
    const payload = customPayload || {
      title: galTitle,
      imageUrl: galUrl,
      beforeImageUrl: galBeforeUrl || undefined,
      category: galCategory,
      caption: galCaption
    };

    try {
      const galId = editingGallery?.id || editingGallery?._id;
      let res;
      if (galId) {
        res = await fetch(`/api/gallery/${galId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        setGalTitle("");
        setGalUrl("");
        setGalBeforeUrl("");
        setGalCaption("");
        setEditingGallery(null);
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to save gallery item: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error saving gallery item: " + err.message);
    }
  };

  const handleEditGalleryClick = (g: IGalleryItem) => {
    setEditingGallery(g);
    setGalTitle(g.title);
    setGalUrl(g.imageUrl);
    setGalBeforeUrl(g.beforeImageUrl || "");
    setGalCategory(g.category || "Rooftop");
    setGalCaption(g.caption || "");
  };

  const handleDeleteGallery = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this photo?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to delete gallery item: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error deleting gallery item: " + err.message);
    }
  };

  // --- BLOGS & COMMENTS CRUD ---
  const handleCreateOrUpdateBlog = async (e: React.FormEvent, customPayload: Partial<IBlog> | null = null) => {
    e.preventDefault();
    const payload = customPayload || {
      title: blogTitle,
      slug: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      author: sessionData?.user?.name || "Admin",
      coverImage: blogUrl,
      category: blogCategory,
      content: blogContent,
      readingTime: "5 mins"
    };

    try {
      const blogId = editingBlog?.id || editingBlog?._id;
      let res;
      if (blogId) {
        res = await fetch(`/api/blogs/${blogId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        setBlogTitle("");
        setBlogUrl("");
        setBlogContent("");
        setEditingBlog(null);
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to save blog post: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error saving blog post: " + err.message);
    }
  };

  const handleEditBlogClick = (b: IBlog) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogUrl(b.coverImage || "");
    setBlogCategory(b.category || "Rooftop Gardening");
    setBlogContent(b.content);
  };

  const handleDeleteBlog = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to delete blog post: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Network error deleting blog post: " + err.message);
    }
  };

  const handleDeleteComment = async (blogId: string, commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    const targetBlog = blogs.find(b => (b.id || b._id) === blogId);
    if (!targetBlog || !targetBlog.comments) return;

    const updatedComments = targetBlog.comments.filter(c => (c.id || c._id) !== commentId);
    
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments })
      });
      if (res.ok) {
        const freshBlog = await res.json();
        setSelectedBlogComments(freshBlog);
        await fetchData();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // --- CAREER APPLICATION STATUS ---
  const handleUpdateCareerStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) await fetchData();
    } catch (err: any) {
      alert("Failed to update application: " + err.message);
    }
  };

  const handleDeleteCareer = async (id?: string) => {
    if (!id || !confirm("Delete this job application record?")) return;
    try {
      const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
      if (res.ok) await fetchData();
    } catch (err: any) {
      alert("Failed to delete application: " + err.message);
    }
  };

  // --- INBOX MESSAGE OPERATIONS ---
  const handleDeleteMessage = async (id?: string) => {
    if (!id || !confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) await fetchData();
    } catch (err: any) {
      alert("Failed to delete message: " + err.message);
    }
  };

  // --- GLOBAL CONFIG SETTINGS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSuccess(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: settings }));
        }
        setTimeout(() => setSettingsSuccess(false), 4000);
      } else {
        const err = await res.json();
        alert("Failed to save settings: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSettingsChange = (field: string, val: any) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F6F2]">
        <span className="w-10 h-10 border-4 border-[#2B4D33]/20 border-t-[#2B4D33] rounded-full animate-spin"></span>
      </div>
    );
  }

  // Strict Client & Unauthenticated Guard — Client role cannot access admin portal
  if (!user || !canEnterAdmin(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#142017] text-white p-6 text-center select-none">
        <div className="max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-3xl">
            🚫
          </div>
          <h2 className="text-xl font-bold font-serif text-white">অ্যাক্সেস সংরক্ষিত • Access Restricted</h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            {!user
              ? "অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে অনুগ্রহ করে প্রথমে সাইন ইন করুন।"
              : `আপনার বর্তমান অ্যাকাউন্টের ভূমিকা (${user.role || "Client"}) অ্যাডমিন প্যানেলে প্রবেশের অনুমতিপ্রাপ্ত নয়।`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            {!user ? (
              <a
                href="/login"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all text-center"
              >
                লগইন পেজে যান
              </a>
            ) : (
              <a
                href="/client-dashboard"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all text-center"
              >
                ক্লায়েন্ট ড্যাশবোর্ডে যান
              </a>
            )}
            <a
              href="/"
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-xl transition-all text-center"
            >
              মূল ওয়েবসাইটে ফিরে যান
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentTabAllowed = canAccessTab(user.role, activeTab);

  return (
    <div className="bg-[#F7F6F2] text-[#121813] font-sans min-h-screen flex flex-row relative overflow-x-hidden">
      {/* Background Architectural Ambient Grid & Glow matching Shma Designs Architectural Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(#D6D2C4_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-70 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E4E2D7]/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#2B4D33]/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* 1. LEFT SIDEBAR (Permanent Desktop, Slide-out Drawer on Mobile) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        sessionData={sessionData} 
        inboxCount={messages.length + careers.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 w-full relative z-10">
        
        {/* Top Header */}
        <Header 
          setActiveTab={handleTabChange} 
          setEditingService={setEditingService} 
          fetchData={fetchData}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          activeTab={activeTab}
        />

        {/* Content Body Grid with bottom clearance for Mobile Bottom Bar & Next.js badge */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-6 w-full max-w-full overflow-x-hidden">

          {!isCurrentTabAllowed ? (
            <div className="bg-white/80 border border-rose-500/30 p-10 rounded-3xl shadow-sm text-center flex flex-col items-center gap-3 my-auto max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-2xl font-bold">
                🔒
              </div>
              <h3 className="text-base font-bold text-stone-800">এই সেকশনে প্রবেশের অনুমতি নেই</h3>
              <p className="text-xs text-stone-500 max-w-md leading-relaxed">
                আপনার বর্তমান অ্যাকাউন্টের রোল ({user.role}) এর জন্য এই নির্দিষ্ট ফিচারটি সীমাবদ্ধ রাখা হয়েছে।
              </p>
              <button
                onClick={() => handleTabChange(getDefaultTabForRole(user.role))}
                className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
              >
                অনুমোদিত সেকশনে যান
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW / DASHBOARD */}
              {activeTab === "analytics" && (
            <OverviewTab 
              bookings={bookings}
              projects={projects}
              services={services}
              setActiveTab={handleTabChange}
            />
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === "bookings" && (
            <BookingsTab 
              bookings={bookings}
              handleUpdateBooking={handleUpdateBooking}
              handleDeleteBooking={handleDeleteBooking}
            />
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === "services" && (
            <ServicesTab 
              services={services}
              serviceLabel={serviceLabel}
              setServiceLabel={setServiceLabel}
              serviceDesc={serviceDesc}
              setServiceDesc={setServiceDesc}
              serviceIcon={serviceIcon}
              setServiceIcon={setServiceIcon}
              editingService={editingService}
              setEditingService={setEditingService}
              handleCreateOrUpdateService={handleCreateOrUpdateService}
              handleEditServiceClick={handleEditServiceClick}
              handleDeleteService={handleDeleteService}
            />
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === "projects" && (
            <ProjectsTab 
              projects={projects}
              onRefresh={fetchData}
              projName={projName}
              setProjName={setProjName}
              projClient={projClient}
              setProjClient={setProjClient}
              projCategory={projCategory}
              setProjCategory={setProjCategory}
              projUrl={projUrl}
              setProjUrl={setProjUrl}
              projLocation={projLocation}
              setProjLocation={setProjLocation}
              projDuration={projDuration}
              setProjDuration={setProjDuration}
              projBudget={projBudget}
              setProjBudget={setProjBudget}
              projChallenges={projChallenges}
              setProjChallenges={setProjChallenges}
              projSolution={projSolution}
              setProjSolution={setProjSolution}
              projTestimonialName={projTestimonialName}
              setProjTestimonialName={setProjTestimonialName}
              projTestimonialText={projTestimonialText}
              setProjTestimonialText={setProjTestimonialText}
              projFeatured={projFeatured}
              setProjFeatured={setProjFeatured}
              editingProject={editingProject}
              handleCreateOrUpdateProject={handleCreateOrUpdateProject}
              handleEditProjectClick={handleEditProjectClick}
              handleDeleteProject={handleDeleteProject}
              resetProjectForm={resetProjectForm}
            />
          )}

          {/* TAB 5: GALLERY */}
          {activeTab === "gallery" && (
            <GalleryTab 
              gallery={gallery}
              galTitle={galTitle}
              setGalTitle={setGalTitle}
              galUrl={galUrl}
              setGalUrl={setGalUrl}
              galBeforeUrl={galBeforeUrl}
              setGalBeforeUrl={setGalBeforeUrl}
              galCategory={galCategory}
              setGalCategory={setGalCategory}
              galCaption={galCaption}
              setGalCaption={setGalCaption}
              editingGallery={editingGallery}
              setEditingGallery={setEditingGallery}
              handleCreateOrUpdateGallery={handleCreateOrUpdateGallery}
              handleEditGalleryClick={handleEditGalleryClick}
              handleDeleteGallery={handleDeleteGallery}
            />
          )}

          {/* TAB 6: BLOGS */}
          {activeTab === "blogs" && (
            <BlogsTab 
              blogs={blogs}
              blogTitle={blogTitle}
              setBlogTitle={setBlogTitle}
              blogUrl={blogUrl}
              setBlogUrl={setBlogUrl}
              blogCategory={blogCategory}
              setBlogCategory={setBlogCategory}
              blogContent={blogContent}
              setBlogContent={setBlogContent}
              editingBlog={editingBlog}
              setEditingBlog={setEditingBlog}
              selectedBlogComments={selectedBlogComments}
              setSelectedBlogComments={setSelectedBlogComments}
              handleCreateOrUpdateBlog={handleCreateOrUpdateBlog}
              handleEditBlogClick={handleEditBlogClick}
              handleDeleteBlog={handleDeleteBlog}
              handleDeleteComment={handleDeleteComment}
            />
          )}

          {/* TAB: CONTACT MESSAGES INBOX (OVERVIEW GROUP) */}
          {activeTab === "messages" && (
            <ContactInboxTab 
              messages={messages}
              handleDeleteMessage={handleDeleteMessage}
            />
          )}

          {/* TAB 7: CAREERS & CV APPLICATIONS (STUDIO ERP GROUP) */}
          {activeTab === "careers" && (
            <CareersTab 
              messages={messages}
              careers={careers}
              handleDeleteMessage={handleDeleteMessage}
              handleUpdateCareerStatus={handleUpdateCareerStatus}
              handleDeleteCareer={handleDeleteCareer}
            />
          )}

          {/* TAB: HERO SECTION & CINEMATIC VIDEO */}
          {activeTab === "hero" && (
            <HeroConfigTab />
          )}

          {/* TAB: HEADER & NAVBAR STUDIO */}
          {activeTab === "header-nav" && (
            <NavbarConfigTab />
          )}

          {/* TAB 8: GLOBAL CONFIG */}
          {activeTab === "settings" && (
            <SettingsTab 
              settings={settings}
              settingsSaving={settingsSaving}
              settingsSuccess={settingsSuccess}
              handleSaveSettings={handleSaveSettings}
              handleSettingsChange={handleSettingsChange}
              onOpenNavbarStudio={() => handleTabChange("header-nav")}
              onOpenHeroStudio={() => handleTabChange("hero")}
            />
          )}
          {/* TAB 9: SECURITY */}
          {activeTab === "security" && (
            <SecurityTab 
              sessionData={sessionData}
            />
          )}

          {/* TAB 10: USER MANAGEMENT */}
          {activeTab === "users" && (
            <UsersTab />
          )}

          {/* TAB 11: ROLES & PERMISSIONS */}
          {activeTab === "roles" && (
            <RolesTab />
          )}

          {/* TAB: ACTIVITY & AUDIT LOG */}
          {activeTab === "activity-logs" && (
            <ActivityLogTab />
          )}

          {/* TAB 12: CONTENT MANAGEMENT */}
          {activeTab === "content" && (
            <ContentTab 
              services={services}
              projects={projects}
              gallery={gallery}
              blogs={blogs}
              setActiveTab={handleTabChange}
            />
          )}

          {/* TAB 13: REVIEWS */}
          {activeTab === "reviews" && (
            <ReviewsTab />
          )}

          {/* TAB 14: DESIGN REQUESTS (STEP 4) */}
          {activeTab === "design-requests" && (
            <DesignRequestsTab 
              setActiveTab={handleTabChange}
              onSelectForQuotation={(client) => {
                setQuotationPrefill(client);
                handleTabChange("finance");
              }}
            />
          )}

          {/* TAB 15: TREE DOCTOR & PLANT HEALTH (STEPS 5 & 6) */}
          {activeTab === "tree-doctor" && (
            <TreeDoctorTab />
          )}

          {/* TAB 16: EMPLOYEES & ATTENDANCE (STEP 7) */}
          {activeTab === "employees" && (
            <EmployeesTab />
          )}

          {/* TAB 17: RUNNING PROJECTS & MAINTENANCE (STEP 8) */}
          {activeTab === "maintenance" && (
            <MaintenanceSchedulerTab />
          )}

          {/* TAB 18: FINANCE, INVENTORY & P&L (STEP 9) */}
          {activeTab === "finance" && (
            <FinanceInventoryTab initialQuotationClient={quotationPrefill} />
          )}

          {/* TAB 19: DIGITAL SERVICE CARD (STEP 10) */}
          {activeTab === "service-card" && (
            <DigitalServiceCardTab />
          )}

          {/* TAB 20: HOMEPAGE SECTIONS MANAGER (Phase 2) */}
          {activeTab === "homepage-sections" && (
            <HomepageSectionsTab />
          )}

          {/* TAB 21: CONTENT MANAGER — All Text Dynamic (Phase 2) */}
          {activeTab === "content-manager" && (
            <ContentManagerTab />
          )}
          </>
        )}
        </div>
      </main>

      {/* 3. MOBILE FIXED BOTTOM NAVIGATION BAR (Phase 1) */}
      <MobileBottomBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenMenu={() => setSidebarOpen(true)}
      />

    </div>
  );
}
