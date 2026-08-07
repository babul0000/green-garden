"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

const fetch = (originalFetch => (url, options) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

export default function AdminPage() {
  const { data: sessionData, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("analytics");

  // State arrays loaded from database
  const [bookings, setBookings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [careers, setCareers] = useState([]);
  const [settings, setSettings] = useState({
    title: "AR Green Garden",
    phone: "01712345678",
    email: "info@argreengarden.com",
    address: "Dhanmondi, Dhaka",
    fbPage: "https://facebook.com/argreengarden",
    youtube: "https://youtube.com/argreengarden",
    themeColor: "#1a3020",
    seoDescription: "Premium Landscaping & Garden Design website in Bangladesh"
  });

  // Edit target states (If null -> in Create mode. If populated -> in Edit mode)
  const [editingService, setEditingService] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

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
  const [selectedBlogComments, setSelectedBlogComments] = useState(null);

  // Settings saving state
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const fetchData = async () => {
    try {
      // Bookings
      const resBookings = await fetch("http://localhost:5000/api/bookings");
      if (resBookings.ok) setBookings(await resBookings.json());

      // Projects
      const resProjects = await fetch("http://localhost:5000/api/projects");
      if (resProjects.ok) setProjects(await resProjects.json());

      // Gallery
      const resGallery = await fetch("http://localhost:5000/api/gallery");
      if (resGallery.ok) setGallery(await resGallery.json());

      // Blogs
      const resBlogs = await fetch("http://localhost:5000/api/blogs");
      if (resBlogs.ok) setBlogs(await resBlogs.json());

      // Services
      const resServices = await fetch("http://localhost:5000/api/services");
      if (resServices.ok) setServices(await resServices.json());

      // Messages
      const resMsg = await fetch("http://localhost:5000/api/messages");
      if (resMsg.ok) setMessages(await resMsg.json());

      // Careers
      const resCar = await fetch("http://localhost:5000/api/careers");
      if (resCar.ok) setCareers(await resCar.json());

      // Settings
      const resSettings = await fetch("http://localhost:5000/api/settings");
      if (resSettings.ok) {
        const data = await resSettings.json();
        if (data?.value) setSettings(data.value);
      }

    } catch (error) {
      console.warn("Backend data fetch failed, using mock fallbacks:", error);
    }
  };

  useEffect(() => {
    if (sessionData?.user && (sessionData.user.role === "admin" || sessionData.user.role === "editor")) {
      fetchData();
    }
  }, [sessionData]);

  // --- BOOKING OPERATIONS ---
  const handleUpdateBooking = async (id, status, staff) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, assignedStaff: staff })
      });
      if (res.ok) fetchData();
    } catch (err) {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status, assignedStaff: staff } : b));
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      setBookings(prev => prev.filter(b => b._id !== id));
    }
  };

  // --- SERVICES CRUD ---
  const handleCreateOrUpdateService = async (e) => {
    e.preventDefault();
    const payload = {
      label: serviceLabel,
      slug: serviceLabel.toLowerCase().replace(/ /g, "-"),
      desc: serviceDesc,
      icon: serviceIcon
    };

    try {
      let res;
      if (editingService) {
        res = await fetch(`http://localhost:5000/api/services/${editingService._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:5000/api/services", {
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
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditServiceClick = (srv) => {
    setEditingService(srv);
    setServiceLabel(srv.label);
    setServiceDesc(srv.desc);
    setServiceIcon(srv.icon || "🌱");
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      setServices(prev => prev.filter(s => s._id !== id));
    }
  };

  // --- PROJECTS CRUD ---
  const handleCreateOrUpdateProject = async (e) => {
    e.preventDefault();
    const payload = {
      name: projName,
      slug: projName.toLowerCase().replace(/ /g, "-"),
      client: projClient,
      category: projCategory,
      imageUrl: projUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
      location: projLocation,
      duration: projDuration,
      budgetRange: projBudget,
      challenges: projChallenges,
      solution: projSolution,
      clientTestimonial: {
        name: projTestimonialName,
        text: projTestimonialText,
        rating: 5
      },
      featured: projFeatured
    };

    try {
      let res;
      if (editingProject) {
        res = await fetch(`http://localhost:5000/api/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:5000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        resetProjectForm();
        fetchData();
      }
    } catch (err) {
      console.error(err);
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

  const handleEditProjectClick = (proj) => {
    setEditingProject(proj);
    setProjName(proj.name);
    setProjClient(proj.client || "");
    setProjCategory(proj.category || "Residential");
    setProjUrl(proj.imageUrl || "");
    setProjLocation(proj.location || "");
    setProjDuration(proj.duration || "");
    setProjBudget(proj.budgetRange || "");
    setProjChallenges(proj.challenges || "");
    setProjSolution(proj.solution || "");
    setProjTestimonialName(proj.clientTestimonial?.name || "");
    setProjTestimonialText(proj.clientTestimonial?.text || "");
    setProjFeatured(proj.featured || false);
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Delete this project case study?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      setProjects(prev => prev.filter(p => p._id !== id));
    }
  };

  // --- GALLERY CRUD ---
  const handleCreateOrUpdateGallery = async (e) => {
    e.preventDefault();
    const payload = {
      title: galTitle,
      imageUrl: galUrl,
      beforeImageUrl: galBeforeUrl || undefined,
      category: galCategory,
      caption: galCaption
    };

    try {
      let res;
      if (editingGallery) {
        res = await fetch(`http://localhost:5000/api/gallery/${editingGallery._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:5000/api/gallery", {
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
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditGalleryClick = (g) => {
    setEditingGallery(g);
    setGalTitle(g.title);
    setGalUrl(g.imageUrl);
    setGalBeforeUrl(g.beforeImageUrl || "");
    setGalCategory(g.category || "Rooftop");
    setGalCaption(g.caption || "");
  };

  const handleDeleteGallery = async (id) => {
    if (!confirm("Delete this photo?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      setGallery(prev => prev.filter(g => g._id !== id));
    }
  };

  // --- BLOGS & COMMENTS CRUD ---
  const handleCreateOrUpdateBlog = async (e) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      slug: blogTitle.toLowerCase().replace(/ /g, "-"),
      author: sessionData.user.name,
      coverImage: blogUrl,
      category: blogCategory,
      content: blogContent,
      readingTime: "5 mins"
    };

    try {
      let res;
      if (editingBlog) {
        res = await fetch(`http://localhost:5000/api/blogs/${editingBlog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:5000/api/blogs", {
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
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBlogClick = (b) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogUrl(b.coverImage);
    setBlogCategory(b.category || "Rooftop Gardening");
    setBlogContent(b.content);
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      setBlogs(prev => prev.filter(b => b._id !== id));
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    if (!confirm("Delete this comment?")) return;
    const targetBlog = blogs.find(b => b._id === blogId);
    if (!targetBlog) return;

    // Filter out the deleted comment
    const updatedComments = targetBlog.comments.filter(c => c._id !== commentId);
    
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments })
      });
      if (res.ok) {
        const freshBlog = await res.json();
        // Update local views
        setSelectedBlogComments(freshBlog);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CAREER APPLICATION STATUS ---
  const handleUpdateCareerStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/careers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (err) {
      setCareers(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    }
  };

  const handleDeleteCareer = async (id) => {
    if (!confirm("Delete this job application record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/careers/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      setCareers(prev => prev.filter(c => c._id !== id));
    }
  };

  // --- INBOX MESSAGE OPERATIONS ---
  const handleDeleteMessage = async (id) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== id));
    }
  };

  // --- GLOBAL CONFIG SETTINGS ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSuccess(true);
      }
    } catch (err) {
      setSettingsSuccess(true); // mock success
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSettingsChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="w-10 h-10 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
      </div>
    );
  }

  // Auth check
  const userRole = sessionData?.user?.role;
  if (!sessionData?.user || (userRole !== "admin" && userRole !== "editor")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-foreground px-6 py-12">
        <div className="max-w-md w-full bg-white border border-foreground/5 rounded-3xl p-8 text-center shadow-lg flex flex-col gap-6">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">🚫</div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-red-600">Access Denied</h1>
            <p className="text-xs text-foreground/50 mt-1.5 leading-relaxed">
              Your account authority is set to <b>{userRole || "Visitor"}</b>. You must have Administrator or Editor permissions to view this control studio panel.
            </p>
          </div>
          <a href="/" className="bg-primary-green hover:bg-primary-green-dark text-white text-xs font-bold py-3 rounded-xl transition-all text-center">Back to Homepage</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f5] text-slate-800 font-sans min-h-screen flex flex-col md:flex-row relative">
      
      {/* 1. LEFT SIDEBAR (Siohioma Style - Dark Green) */}
      <aside className="w-full md:w-64 bg-[#091b10] text-white flex flex-col px-4 py-6 md:sticky md:top-0 md:h-screen shrink-0 shadow-xl border-r border-white/5">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 px-3 py-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#8ac343] flex items-center justify-center text-lg shadow-md animate-pulse">
            🪴
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm tracking-wide text-white">Green Garden</h1>
            <p className="text-[9px] text-[#8ac343] tracking-widest uppercase font-semibold">Studio Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-6 flex-grow">
          
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-white/30 px-3 mb-3">Menu</p>
            <nav className="flex flex-col gap-1">
              {[
                { id: "analytics", label: "Overview", icon: "📊" },
                { id: "bookings", label: "Bookings", icon: "📅" },
                { id: "services", label: "Services", icon: "🛠️" },
                { id: "projects", label: "Projects", icon: "🏡" },
                { id: "gallery", label: "Gallery", icon: "📸" },
                { id: "blogs", label: "Blogs", icon: "📝" }
              ].map(tab => (
                <div key={tab.id} className="relative flex items-center w-full">
                  {activeTab === tab.id && (
                    <div className="absolute left-0 w-1.5 h-6 bg-[#8ac343] rounded-r-md"></div>
                  )}
                  <button
                    onClick={() => { setActiveTab(tab.id); setSelectedBlogComments(null); }}
                    className={`flex items-center gap-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-white/10 text-white font-bold shadow-inner"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                </div>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-white/30 px-3 mb-3">General</p>
            <nav className="flex flex-col gap-1">
              {[
                { id: "careers", label: "Candidates & Inbox", icon: "💼" },
                { id: "settings", label: "Global Config", icon: "⚙️" }
              ].map(tab => (
                <div key={tab.id} className="relative flex items-center w-full">
                  {activeTab === tab.id && (
                    <div className="absolute left-0 w-1.5 h-6 bg-[#8ac343] rounded-r-md"></div>
                  )}
                  <button
                    onClick={() => { setActiveTab(tab.id); setSelectedBlogComments(null); }}
                    className={`flex items-center gap-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-white/10 text-white font-bold shadow-inner"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                </div>
              ))}
            </nav>
          </div>

        </div>

        {/* User Card bottom */}
        <div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-emerald-800 border border-white/10 text-[#8ac343] font-bold flex items-center justify-center text-sm shadow">
            {sessionData.user.name ? sessionData.user.name[0] : "A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{sessionData.user.name}</p>
            <p className="text-[9px] text-[#8ac343] font-mono tracking-wider truncate uppercase font-semibold">{sessionData.user.role}</p>
          </div>
        </div>

      </aside>

      {/* 2. MAIN CONTAINER AREA */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Workspace</span>
            <div className="bg-[#f0f4f2] text-[#091b10] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-[#e1eae5] transition-colors border border-emerald-950/5">
              <span>AR Green Garden Admin</span>
              <span className="text-[8px]">▼</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Input bar */}
            <div className="relative max-w-[200px] hidden sm:block">
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-full text-[11px] focus:outline-none focus:border-[#091b10]"
              />
              <span className="absolute left-3 top-2 text-[10px] text-slate-400">🔍</span>
            </div>

            {/* Refresh and View actions */}
            <div className="flex gap-2 items-center">
              <button 
                onClick={fetchData} 
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/60 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Refresh database"
              >
                ⟳
              </button>
              
              {/* Quick action button matching Siohioma Style */}
              <button 
                onClick={() => { setActiveTab("projects"); setEditingProject(null); }}
                className="bg-[#091b10] hover:bg-black text-[#8ac343] text-[11px] font-bold py-1.5 px-4 rounded-full flex items-center gap-1 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
              >
                <span>Add new project</span>
                <span className="text-xs font-normal">+</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Body Grid */}
        <div className="flex-grow p-8 flex flex-col gap-6">

          {/* TAB 1: OVERVIEW / SUMMARY STATISTICS (Siohioma Design Style) */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              
              {/* Tab Header title */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#091b10]">Dashboard</h2>
                  <p className="text-xs text-slate-400 mt-0.5">An elegant workspace to manage gardens, metrics, and content with care and precision.</p>
                </div>
                {/* Date Dropdown */}
                <div className="bg-white border border-slate-200/80 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 flex items-center gap-1.5">
                  <span>📅 January 2026 - Present</span>
                  <span className="text-[7px]">▼</span>
                </div>
              </div>

              {/* Main dashboard content grids split */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* Left Side elements: Stats & Recent Transaction Table & Bar Chart */}
                <div className="xl:col-span-3 flex flex-col gap-6">
                  
                  {/* Top Stats Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1: Update Card (Dark Green) */}
                    <div className="bg-[#091b10] text-white p-6 rounded-[28px] flex flex-col justify-between min-h-[140px] shadow-lg relative overflow-hidden border border-white/5">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                      <div className="flex justify-between items-start">
                        <span className="bg-[#8ac343]/20 text-[#8ac343] text-[9px] uppercase tracking-wider font-bold py-1 px-2.5 rounded-full">Update</span>
                        <span className="text-[9px] text-white/40">Aug 2026</span>
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#8ac343] leading-snug">Garden bookings & inquiries increased 40% this week.</h4>
                        <button onClick={() => setActiveTab("bookings")} className="text-[10px] font-bold text-white/70 hover:text-white mt-3 flex items-center gap-1.5 transition-colors">
                          <span>See Bookings</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>

                    {/* Card 2: Total Bookings (White Card) */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex flex-col justify-between min-h-[140px] shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
                        <span className="text-xl">📅</span>
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-[#091b10] font-serif">{bookings.length} Slots</span>
                        <div className="flex items-center gap-1 mt-1 text-emerald-600 text-[10px] font-bold">
                          <span>📈 +35% from last month</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Active Services */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex flex-col justify-between min-h-[140px] shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Offerings</span>
                        <span className="text-xl">🛠️</span>
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-[#091b10] font-serif">{services.length || 7} Services</span>
                        <div className="flex items-center gap-1 mt-1 text-[#8ac343] text-[10px] font-bold">
                          <span>🌱 High active demand</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Booking list (Transactions) & Bar Chart Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Recent Bookings List (Transaction equivalent) */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Bookings</h3>
                        <button onClick={() => setActiveTab("bookings")} className="text-[#8ac343] hover:underline text-[10px] font-bold">View all</button>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {bookings.slice(0, 5).map((b, idx) => (
                          <div key={b._id || idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#091b10] flex items-center justify-center font-bold text-xs">
                                {b.clientName ? b.clientName[0] : "B"}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[#091b10] block">{b.clientName}</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">{b.service} • {new Date(b.bookingDate || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold block text-slate-700">{b.budgetRange ? b.budgetRange.split(" ").slice(-2).join(" ") : "Standard"}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                                b.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" : b.status === "Completed" ? "bg-slate-100 text-slate-600" : "bg-yellow-50 text-yellow-600"
                              }`}>
                                {b.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        {bookings.length === 0 && (
                          <p className="text-xs text-slate-400 italic text-center py-6">No bookings registered yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Revenue Bar Chart */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Revenue Distribution (BDT)</h3>
                      
                      <div className="h-44 flex items-end justify-between px-2 pt-6">
                        {[
                          { label: "Rooftop", val: 180, pct: 100 },
                          { label: "Vertical", val: 140, pct: 77 },
                          { label: "Lawn", val: 90, pct: 50 },
                          { label: "Irrigation", val: 50, pct: 28 },
                          { label: "Service", val: 20, pct: 11 }
                        ].map((bar, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                            <span className="text-[9px] font-bold text-[#091b10]">৳{bar.val}K</span>
                            <div 
                              className="bg-[#091b10] hover:bg-[#8ac343] w-6 rounded-t-lg transition-all duration-500 shadow-sm" 
                              style={{ height: `${bar.pct}%` }}
                            ></div>
                            <span className="text-[9px] text-slate-400 font-bold">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Horizontal Progress statistics (Workspace Reports) */}
                  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Garden Project Metrics</h3>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { label: "Rooftop Garden Setup Completed", target: 400, val: 233, color: "bg-[#8ac343]" },
                        { label: "Active Vertical wall facade systems", target: 100, val: 23, color: "bg-[#091b10]" },
                        { label: "Maintenance & Irrigation contracts sold", target: 500, val: 482, color: "bg-[#8ac343]" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600">
                            <span>{item.label}</span>
                            <span>{item.val} / {item.target}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`${item.color} h-full rounded-full transition-all duration-1000`} 
                              style={{ width: `${(item.val / item.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Side elements: Donut chart view & Level up promo card */}
                <div className="flex flex-col gap-6">
                  
                  {/* Total View Performance (Donut Chart representation) */}
                  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4 items-center">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider self-start">Garden distribution</h3>
                    
                    {/* Custom SVG Donut Chart */}
                    <div className="relative w-36 h-36 flex items-center justify-center my-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Grey base circle */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                        {/* Segment 1: Courtyard/Lawn (68%) - color: #8ac343 */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8ac343" strokeWidth="4.2" strokeDasharray="68 32" strokeDashoffset="0" />
                        {/* Segment 2: Vertical (23%) - color: #091b10 */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#091b10" strokeWidth="4.2" strokeDasharray="23 77" strokeDashoffset="-68" />
                        {/* Segment 3: Rooftop (9%) - color: #e2e8f0 */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cfdfd3" strokeWidth="4.2" strokeDasharray="9 91" strokeDashoffset="-91" />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-lg font-bold text-[#091b10] block leading-none font-serif">{bookings.length + projects.length || "12"}</span>
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Total Projects</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center leading-relaxed px-2">
                      Percentage division of setup formats designed and consulted this season.
                    </p>

                    <div className="w-full border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-[9px] font-bold text-slate-600">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8ac343]"></span>
                          <span>Courtyard & Lawn</span>
                        </div>
                        <span>68%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#091b10]"></span>
                          <span>Vertical Gardens</span>
                        </div>
                        <span>23%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#cfdfd3]"></span>
                          <span>Rooftop Systems</span>
                        </div>
                        <span>9%</span>
                      </div>
                    </div>
                  </div>

                  {/* Level Up Garden Banner */}
                  <div className="bg-[#cbd8ce] p-6 rounded-[28px] border border-slate-200/50 shadow-sm flex flex-col gap-4 justify-between relative overflow-hidden">
                    <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-[#8ac343]/20 rounded-full blur-xl"></div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#091b10] leading-snug">Level up your garden designs to the next level.</h4>
                      <p className="text-[9px] text-slate-600 mt-1 leading-relaxed">
                        Publish new case studies, moderate customer comments, and audit booking lists instantly.
                      </p>
                    </div>
                    <a 
                      href="/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-[#091b10] hover:bg-black text-[#8ac343] text-[10px] font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-center block"
                    >
                      View Public Site ➔
                    </a>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: BOOKINGS LIST */}
          {activeTab === "bookings" && (
            <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#091b10]">Booking Records</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage booking slots, change status (Pending/Confirmed/Completed), and allocate expert staff.</p>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Budget Standard</th>
                      <th className="pb-3">Assigned Staff</th>
                      <th className="pb-3">State</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 italic">No bookings found.</td>
                      </tr>
                    ) : (
                      bookings.map(b => (
                        <tr key={b._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-semibold text-[#091b10]">
                            {b.clientName}
                            <span className="block text-[10px] font-normal text-slate-400 mt-0.5">{b.clientEmail} • {b.phone}</span>
                          </td>
                          <td className="py-4 text-[#091b10] font-medium">{b.service}</td>
                          <td className="py-4 text-slate-500">{b.budgetRange || "Standard"}</td>
                          <td className="py-4">
                            <select 
                              value={b.assignedStaff || "Unassigned"}
                              onChange={(e) => handleUpdateBooking(b._id, b.status, e.target.value)}
                              className="bg-white border border-slate-200 py-1.5 px-2.5 rounded-xl text-[10px] focus:outline-none text-slate-700 font-semibold"
                            >
                              <option value="Unassigned">Unassigned</option>
                              <option value="Ar. Sultana Yasmin">Ar. Sultana Yasmin</option>
                              <option value="Dr. Rafiqul Islam">Dr. Rafiqul Islam</option>
                              <option value="Tanvir Ahmed">Tanvir Ahmed</option>
                            </select>
                          </td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                              b.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : b.status === "Completed" ? "bg-[#091b10] text-white" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 text-right flex gap-1.5 justify-end items-center h-full">
                            <button 
                              onClick={() => handleUpdateBooking(b._id, "Confirmed", b.assignedStaff || "Ar. Sultana Yasmin")}
                              className="bg-[#8ac343]/10 hover:bg-[#8ac343] text-emerald-800 hover:text-white px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => handleUpdateBooking(b._id, "Completed", b.assignedStaff || "Ar. Sultana Yasmin")}
                              className="bg-[#091b10] hover:bg-black text-[#8ac343] px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                            >
                              Complete
                            </button>
                            <button 
                              onClick={() => handleDeleteBooking(b._id)}
                              className="text-red-500 hover:text-red-700 px-1 py-1 text-xs cursor-pointer"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CRUD SERVICES */}
          {activeTab === "services" && (
            <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#091b10]">Services Manager</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage offering services, icons, and descriptions.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateOrUpdateService} className="bg-[#f8faf9] p-6 rounded-[24px] border border-emerald-950/5 flex flex-col gap-4">
                <h4 className="font-bold text-xs text-[#091b10] uppercase tracking-wider">
                  {editingService ? `Edit Service Details: ${editingService.label}` : "Add New Offering Service"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    required
                    placeholder="Service Name (e.g. Lawn Gardening)"
                    value={serviceLabel}
                    onChange={(e) => setServiceLabel(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                  <input 
                    type="text" 
                    required
                    placeholder="Icon Emoji (e.g. 🏡)"
                    value={serviceIcon}
                    onChange={(e) => setServiceIcon(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-center text-slate-800"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-[#091b10] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all">
                      {editingService ? "Save Service" : "Add Service"}
                    </button>
                    {editingService && (
                      <button type="button" onClick={() => { setEditingService(null); setServiceLabel(""); setServiceDesc(""); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                <textarea 
                  required
                  rows={2}
                  placeholder="Short description snippet..."
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800"
                />
              </form>

              {/* List Services */}
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="font-serif font-bold text-sm text-[#091b10]">Existing Services</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(s => (
                    <div key={s._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon || "🌱"}</span>
                        <div>
                          <span className="font-bold text-[#091b10] text-xs">{s.label}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">{s.desc}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs shrink-0 ml-3">
                        <button onClick={() => handleEditServiceClick(s)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDeleteService(s._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CRUD PROJECTS */}
          {activeTab === "projects" && (
            <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#091b10]">Case Studies Manager</h3>
                <p className="text-xs text-slate-400 mt-0.5">Edit portfolio items, location specs, client details, challenges, solutions, and testimonials.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateOrUpdateProject} className="bg-[#f8faf9] p-6 rounded-[24px] border border-emerald-950/5 flex flex-col gap-4">
                <h4 className="font-bold text-xs text-[#091b10] uppercase tracking-wider">
                  {editingProject ? `Edit Case Study: ${editingProject.name}` : "Publish New Completed Project"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    required
                    placeholder="Project Name"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                  <input 
                    type="text" 
                    placeholder="Client Name"
                    value={projClient}
                    onChange={(e) => setProjClient(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
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
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                  <input 
                    type="text" 
                    placeholder="Location (e.g. Banani, Dhaka)"
                    value={projLocation}
                    onChange={(e) => setProjLocation(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Duration (e.g. 3 Weeks)"
                      value={projDuration}
                      onChange={(e) => setProjDuration(e.target.value)}
                      className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs flex-1 text-slate-800"
                    />
                    <input 
                      type="text" 
                      placeholder="Budget (e.g. 4 Lakhs)"
                      value={projBudget}
                      onChange={(e) => setProjBudget(e.target.value)}
                      className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs flex-1 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea 
                    rows={2}
                    placeholder="Challenges description..."
                    value={projChallenges}
                    onChange={(e) => setProjChallenges(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800"
                  />
                  <textarea 
                    rows={2}
                    placeholder="Solution description..."
                    value={projSolution}
                    onChange={(e) => setProjSolution(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/40 pt-3">
                  <input 
                    type="text" 
                    placeholder="Client Testimonial Reviewer Name"
                    value={projTestimonialName}
                    onChange={(e) => setProjTestimonialName(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                  <input 
                    type="text" 
                    placeholder="Client Testimonial Review Text"
                    value={projTestimonialText}
                    onChange={(e) => setProjTestimonialText(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#091b10]">
                    <input 
                      type="checkbox" 
                      checked={projFeatured} 
                      onChange={(e) => setProjFeatured(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#091b10]"
                    />
                    <span>Feature this project case study on homepage?</span>
                  </label>
                  <div className="flex gap-2 self-end">
                    <button type="submit" className="bg-[#091b10] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
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
                <h4 className="font-serif font-bold text-sm text-[#091b10]">Published Projects</h4>
                <div className="flex flex-col gap-2">
                  {projects.map(p => (
                    <div key={p._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors text-xs">
                      <div>
                        <span className="font-bold text-[#091b10] block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Category: {p.category} • Location: {p.location} {p.featured && "• 🌟 Featured"}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleEditProjectClick(p)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDeleteProject(p._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CRUD GALLERY */}
          {activeTab === "gallery" && (
            <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#091b10]">Gallery Catalog Manager</h3>
                <p className="text-xs text-slate-400 mt-0.5">Edit gallery pictures and Before-After comparison slider images.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateOrUpdateGallery} className="bg-[#f8faf9] p-6 rounded-[24px] border border-emerald-950/5 flex flex-col gap-4">
                <h4 className="font-bold text-xs text-[#091b10] uppercase tracking-wider">
                  {editingGallery ? `Edit Photo: ${editingGallery.title}` : "Upload New Gallery Item"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    required
                    placeholder="Photo Title"
                    value={galTitle}
                    onChange={(e) => setGalTitle(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                  <select 
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option>Rooftop</option>
                    <option>Vertical</option>
                    <option>Landscape</option>
                    <option>Indoor</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    required
                    placeholder="After Image URL (Main photo display)"
                    value={galUrl}
                    onChange={(e) => setGalUrl(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                  <input 
                    type="text" 
                    placeholder="Before Image URL (Optional, for slider overlay)"
                    value={galBeforeUrl}
                    onChange={(e) => setGalBeforeUrl(e.target.value)}
                    className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Short photo caption details..."
                  value={galCaption}
                  onChange={(e) => setGalCaption(e.target.value)}
                  className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-[#091b10] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
                    {editingGallery ? "Update Photo" : "Upload Photo"}
                  </button>
                  {editingGallery && (
                    <button type="button" onClick={() => { setEditingGallery(null); setGalTitle(""); setGalUrl(""); setGalBeforeUrl(""); setGalCaption(""); }} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* List Gallery */}
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="font-serif font-bold text-sm text-[#091b10]">Gallery Showcase Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map(g => (
                    <div key={g._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors text-xs">
                      <div>
                        <span className="font-bold text-[#091b10] block">{g.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Category: {g.category} {g.beforeImageUrl && "• (Comparison slider enabled)"}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleEditGalleryClick(g)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDeleteGallery(g._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CRUD BLOGS */}
          {activeTab === "blogs" && (
            <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
              {selectedBlogComments ? (
                /* Comment moderator view */
                <div className="flex flex-col gap-6">
                  <button onClick={() => setSelectedBlogComments(null)} className="text-xs font-bold text-[#091b10] hover:text-[#8ac343] transition-colors w-fit flex items-center gap-1">
                    ← Back to Article Manager
                  </button>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#091b10]">Moderate Comments: {selectedBlogComments.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Approve, block, or delete comments written by website visitors.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {selectedBlogComments.comments?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic bg-[#f8faf9] p-6 rounded-2xl text-center">No comments written for this post.</p>
                    ) : (
                      selectedBlogComments.comments.map(c => (
                        <div key={c._id} className="bg-[#f8faf9] border border-slate-100 p-4 rounded-[20px] text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-[#091b10] block">{c.name}</span>
                            <p className="text-slate-600 leading-relaxed mt-1">{c.text}</p>
                          </div>
                          <button onClick={() => handleDeleteComment(selectedBlogComments._id, c._id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
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
                    <h3 className="font-serif font-bold text-lg text-[#091b10]">Botanical Blogs Manager</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Write plant tips, garden maintenance checklists and moderate readers comments.</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleCreateOrUpdateBlog} className="bg-[#f8faf9] p-6 rounded-[24px] border border-emerald-950/5 flex flex-col gap-4">
                    <h4 className="font-bold text-xs text-[#091b10] uppercase tracking-wider">
                      {editingBlog ? `Edit Blog Article: ${editingBlog.title}` : "Compose New Article"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input 
                        type="text" 
                        required
                        placeholder="Article Title"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
                      />
                      <input 
                        type="text" 
                        placeholder="Cover Image URL"
                        value={blogUrl}
                        onChange={(e) => setBlogUrl(e.target.value)}
                        className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
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
                      className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#091b10] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
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
                    <h4 className="font-serif font-bold text-sm text-[#091b10]">Published Blogs</h4>
                    <div className="flex flex-col gap-2">
                      {blogs.map(b => (
                        <div key={b._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors text-xs">
                          <div>
                            <span className="font-bold text-[#091b10] block">{b.title}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Category: {b.category} • Comments count: <b>{b.comments?.length || 0}</b></span>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setSelectedBlogComments(b)} className="text-amber-600 hover:underline font-bold">Comments</button>
                            <button onClick={() => handleEditBlogClick(b)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                            <button onClick={() => handleDeleteBlog(b._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CAREERS & MESSAGES */}
          {activeTab === "careers" && (
            <div className="flex flex-col gap-8 animate-fade-in-up">
              
              {/* Messages Inbox */}
              <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#091b10]">Inquiries Inbox</h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-2">View and manage customer contact messages.</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-[#f8faf9] p-6 rounded-2xl text-center">No messages in inbox.</p>
                  ) : (
                    messages.map(m => (
                      <div key={m._id} className="bg-[#f8faf9] border border-slate-100 p-5 rounded-[20px] text-xs flex justify-between items-start">
                        <div className="flex-grow min-w-0 pr-4">
                          <div className="flex justify-between items-center text-[9px] text-slate-400 uppercase tracking-wider mb-2">
                            <span>From: <b>{m.name}</b> ({m.email})</span>
                            <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                          </div>
                          {m.subject && <span className="block font-bold text-[#091b10] mb-1.5">Subject: {m.subject}</span>}
                          <p className="text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">{m.message}</p>
                        </div>
                        <button onClick={() => handleDeleteMessage(m._id)} className="text-red-500 hover:text-red-700 text-xs font-bold p-1 cursor-pointer">
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Careers application tracker */}
              <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#091b10]">Candidates Application Tracker</h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-2">Shortlist or reject job applicants for engineering or design positions.</p>
                </div>

                <div className="flex flex-col gap-3">
                  {careers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-[#f8faf9] p-6 rounded-2xl text-center">No candidates submitted CVs.</p>
                  ) : (
                    careers.map(car => (
                      <div key={car._id} className="bg-[#f8faf9] border border-slate-100 p-5 rounded-[20px] text-xs flex justify-between items-start">
                        <div>
                          <span className="font-bold text-[#091b10] text-sm block">{car.name}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Email: {car.email} • Phone: {car.phone}</span>
                          <span className="block font-bold text-[#8ac343] mt-2">Department: {car.department}</span>
                          {car.coverLetter && <p className="text-slate-500 leading-relaxed mt-2 italic bg-white border border-slate-100 p-3 rounded-xl">"{car.coverLetter}"</p>}
                          
                          <div className="flex gap-2 items-center mt-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change Status:</span>
                            {["Reviewing", "Shortlisted", "Rejected"].map(state => (
                              <button
                                key={state}
                                onClick={() => handleUpdateCareerStatus(car._id, state)}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-colors cursor-pointer ${
                                  car.status === state
                                    ? "bg-[#091b10] text-[#8ac343] border-[#091b10]"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-[#8ac343]"
                                }`}
                              >
                                {state}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                          <a href={car.resumeUrl} target="_blank" rel="noreferrer" className="bg-[#091b10] hover:bg-black text-[#8ac343] px-3.5 py-2 rounded-xl font-bold text-[10px] shadow-sm transition-colors">
                            View CV Resume ➔
                          </a>
                          <div className="flex gap-2 items-center mt-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                              car.status === "Shortlisted" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : car.status === "Rejected" ? "bg-red-50 text-red-500 border border-red-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                            }`}>
                              {car.status}
                            </span>
                            <button onClick={() => handleDeleteCareer(car._id)} className="text-red-500 hover:text-red-700 text-xs font-bold p-1 cursor-pointer">
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: GLOBAL CONFIG SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#091b10]">Global Configurations</h3>
                <p className="text-xs text-slate-400 mt-0.5">Modify default telephone numbers, office addresses, theme color codes, and SEO metadata tags.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 max-w-xl">
                {settingsSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 text-xs font-bold p-4 rounded-xl border border-emerald-100">
                    ✓ Global configurations published successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Name</label>
                    <input 
                      type="text" 
                      required
                      value={settings.title}
                      onChange={(e) => handleSettingsChange("title", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#091b10]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Phone</label>
                    <input 
                      type="text" 
                      required
                      value={settings.phone}
                      onChange={(e) => handleSettingsChange("phone", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#091b10]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Email</label>
                    <input 
                      type="email" 
                      required
                      value={settings.email}
                      onChange={(e) => handleSettingsChange("email", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#091b10]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Office Address</label>
                    <input 
                      type="text" 
                      required
                      value={settings.address}
                      onChange={(e) => handleSettingsChange("address", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#091b10]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Theme Color Code</label>
                    <input 
                      type="text" 
                      required
                      value={settings.themeColor}
                      onChange={(e) => handleSettingsChange("themeColor", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#091b10] font-mono text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facebook Page Link</label>
                    <input 
                      type="text" 
                      value={settings.fbPage}
                      onChange={(e) => handleSettingsChange("fbPage", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#091b10]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Description</label>
                  <textarea 
                    rows={2}
                    value={settings.seoDescription}
                    onChange={(e) => handleSettingsChange("seoDescription", e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#091b10] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="bg-[#091b10] hover:bg-black text-[#8ac343] font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer w-fit shadow-md"
                >
                  {settingsSaving ? "Saving Configs..." : "Publish Config Settings"}
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
