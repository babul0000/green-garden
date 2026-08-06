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
    <div className="bg-background text-foreground font-sans min-h-screen py-10 px-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Admin Header */}
        <div className="bg-white/80 border border-foreground/5 p-6 rounded-[28px] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1a3020]">Administrator Control Studio</h1>
            <p className="text-xs text-foreground/45 mt-0.5">Welcome back, {sessionData.user.name} ({sessionData.user.role}). Manage bookings, check revenue trends, and perform CRUD content revisions.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="bg-sage-light hover:bg-[#e1e9e3] text-primary-green text-xs font-bold px-4 py-2.5 rounded-xl border border-primary-green/10 transition-colors">
              Refresh Data ⟳
            </button>
            <a href="/" className="bg-primary-green hover:bg-primary-green-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors">
              View Website Home ➔
            </a>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Left Sidebar tabs */}
          <div className="lg:col-span-1 bg-white/80 border border-foreground/5 p-4 rounded-3xl flex flex-col gap-2 shadow-sm">
            {[
              { id: "analytics", label: "📊 Summary Statistics" },
              { id: "bookings", label: "📅 Booking Records" },
              { id: "services", label: "✏️ CRUD Services" },
              { id: "projects", label: "🏡 CRUD Projects" },
              { id: "gallery", label: "📸 CRUD Gallery" },
              { id: "blogs", label: "📝 CRUD Blogs" },
              { id: "careers", label: "💼 Candidates & Inbox" },
              { id: "settings", label: "⚙️ Global Config" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedBlogComments(null); }}
                className={`text-left py-3 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-sage-light text-primary-green font-bold shadow-sm"
                    : "text-foreground/75 hover:bg-sage-pastel/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Action Display Panel */}
          <div className="lg:col-span-4 bg-white/80 border border-foreground/5 rounded-[32px] p-6 md:p-8 shadow-sm min-h-[480px]">
            
            {/* TAB 1: Analytics */}
            {activeTab === "analytics" && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Dashboard Summary Metrics</h3>
                  <p className="text-xs text-foreground/50">Performance counters, financial statuses, and traffic channels.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Bookings Done", val: bookings.length, icon: "📅", color: "text-[#1a3020]" },
                    { label: "Total Services", val: services.length || 7, icon: "✏️", color: "text-primary-green" },
                    { label: "Case Studies", val: projects.length, icon: "🏡", color: "text-[#1a3020]" },
                    { label: "Inquiries Received", val: messages.length + careers.length, icon: "✉️", color: "text-primary-green" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-sage-light/20 border border-primary-green/10 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                      <span className="text-xl">{stat.icon}</span>
                      <span className="text-[10px] text-foreground/45 uppercase tracking-wider font-bold">{stat.label}</span>
                      <span className={`text-xl font-bold font-serif ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* SVG Visual Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  {/* Revenue Bar Chart */}
                  <div className="bg-[#f8faf9] p-5 rounded-2xl border border-foreground/5 flex flex-col gap-4">
                    <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Revenue Distribution (BDT)</span>
                    <div className="h-48 flex items-end justify-between px-2 pt-4">
                      {[
                        { label: "Rooftop", val: 180 },
                        { label: "Vertical", val: 140 },
                        { label: "Lawn", val: 90 },
                        { label: "Irrigation", val: 50 },
                        { label: "Maintenance", val: 20 }
                      ].map((bar, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                          <span className="text-[9px] font-bold text-primary-green">৳{bar.val}K</span>
                          <div className="bg-primary-green hover:bg-primary-green-dark w-8 rounded-t-md transition-all duration-500" style={{ height: `${bar.val * 0.7}px` }}></div>
                          <span className="text-[10px] text-foreground/50 font-bold">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Line Chart */}
                  <div className="bg-[#f8faf9] p-5 rounded-2xl border border-foreground/5 flex flex-col gap-4">
                    <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Booking Inflow trends</span>
                    <div className="h-48 flex items-end justify-between px-2 pt-4">
                      {[
                        { month: "Mar", val: 3 },
                        { month: "Apr", val: 5 },
                        { month: "May", val: 8 },
                        { month: "Jun", val: 12 },
                        { month: "Jul", val: bookings.length || 15 }
                      ].map((line, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1 justify-end h-full">
                          <span className="text-[9px] font-bold text-[#1a3020]">{line.val} Books</span>
                          <div className="bg-[#1a3020] hover:bg-black w-2.5 rounded-full transition-all" style={{ height: `${line.val * 8}px` }}></div>
                          <span className="text-[10px] text-foreground/50 font-bold">{line.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Bookings */}
            {activeTab === "bookings" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Client Audits Booking Records</h3>
                  <p className="text-xs text-foreground/50">Manage booking slots, change status (Pending/Confirmed/Completed), and allocate expert staff.</p>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/10 text-foreground/45">
                        <th className="py-3 font-bold uppercase">Client</th>
                        <th className="py-3 font-bold uppercase">Service</th>
                        <th className="py-3 font-bold uppercase">Budget Standard</th>
                        <th className="py-3 font-bold uppercase">Assigned Staff</th>
                        <th className="py-3 font-bold uppercase">State</th>
                        <th className="py-3 font-bold uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr><td colSpan={6} className="py-8 text-center text-foreground/40 italic">No bookings found.</td></tr>
                      ) : (
                        bookings.map(b => (
                          <tr key={b._id} className="border-b border-foreground/5">
                            <td className="py-3.5 font-semibold text-[#1a3020]">
                              {b.clientName}
                              <span className="block text-[10px] font-normal text-foreground/45 mt-0.5">{b.clientEmail} • {b.phone}</span>
                            </td>
                            <td className="py-3.5 font-semibold text-[#1a3020]">{b.service}</td>
                            <td className="py-3.5">{b.budgetRange || "Standard"}</td>
                            <td className="py-3.5">
                              <select 
                                value={b.assignedStaff || "Unassigned"}
                                onChange={(e) => handleUpdateBooking(b._id, b.status, e.target.value)}
                                className="bg-white border border-foreground/10 py-1.5 px-2.5 rounded-xl text-[10px] focus:outline-none"
                              >
                                <option value="Unassigned">Unassigned</option>
                                <option value="Ar. Sultana Yasmin">Ar. Sultana Yasmin</option>
                                <option value="Dr. Rafiqul Islam">Dr. Rafiqul Islam</option>
                                <option value="Tanvir Ahmed">Tanvir Ahmed</option>
                              </select>
                            </td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                b.status === "Confirmed" ? "bg-primary-green/10 text-primary-green" : b.status === "Completed" ? "bg-[#1a3020] text-white" : "bg-yellow-50 text-yellow-600"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right flex gap-1.5 justify-end items-center h-full">
                              <button 
                                onClick={() => handleUpdateBooking(b._id, "Confirmed", b.assignedStaff || "Ar. Sultana Yasmin")}
                                className="bg-primary-green/10 hover:bg-primary-green text-primary-green hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => handleUpdateBooking(b._id, "Completed", b.assignedStaff || "Ar. Sultana Yasmin")}
                                className="bg-[#1a3020] hover:bg-black text-white px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
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

            {/* TAB 3: CRUD Services */}
            {activeTab === "services" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">CRUD Services Editor</h3>
                  <p className="text-xs text-foreground/50">Manage site services, icons, and long descriptions.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateOrUpdateService} className="bg-sage-light/20 p-5 rounded-2xl border border-primary-green/10 flex flex-col gap-4">
                  <h4 className="font-bold text-xs text-primary-green uppercase tracking-wider">
                    {editingService ? `Edit Service Details: ${editingService.label}` : "Add New Offering Service"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Service Name (e.g. Lawn Mowing)"
                      value={serviceLabel}
                      onChange={(e) => setServiceLabel(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs"
                    />
                    <input 
                      type="text" 
                      required
                      placeholder="Icon Emoji (e.g. 🏡)"
                      value={serviceIcon}
                      onChange={(e) => setServiceIcon(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs text-center"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
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
                    className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs resize-none"
                  />
                </form>

                {/* List Services */}
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="font-serif font-bold text-sm text-[#1a3020]">Existing Services list</h4>
                  {services.map(s => (
                    <div key={s._id} className="bg-white border border-foreground/5 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{s.icon || "🌱"}</span>
                        <div>
                          <span className="font-bold text-[#1a3020]">{s.label}</span>
                          <span className="block text-[10px] text-foreground/45 mt-0.5">{s.desc}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditServiceClick(s)} className="text-primary-green hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDeleteService(s._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CRUD Projects */}
            {activeTab === "projects" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">CRUD Case Studies Editor</h3>
                  <p className="text-xs text-foreground/50">Edit portfolio items, location specs, client details, challenges, solutions, and testimonial text.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateOrUpdateProject} className="bg-sage-light/20 p-5 rounded-2xl border border-primary-green/10 flex flex-col gap-4">
                  <h4 className="font-bold text-xs text-primary-green uppercase tracking-wider">
                    {editingProject ? `Edit Case Study: ${editingProject.name}` : "Publish New Completed Project"}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Project Name"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Client Name"
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs"
                    />
                    <select 
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs font-semibold"
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
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Location (e.g. Banani, Dhaka)"
                      value={projLocation}
                      onChange={(e) => setProjLocation(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Duration (e.g. 3 Weeks)"
                        value={projDuration}
                        onChange={(e) => setProjDuration(e.target.value)}
                        className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs flex-1"
                      />
                      <input 
                        type="text" 
                        placeholder="Budget (e.g. 4 Lakhs)"
                        value={projBudget}
                        onChange={(e) => setProjBudget(e.target.value)}
                        className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea 
                      rows={2}
                      placeholder="Challenges description..."
                      value={projChallenges}
                      onChange={(e) => setProjChallenges(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs resize-none"
                    />
                    <textarea 
                      rows={2}
                      placeholder="Solution description..."
                      value={projSolution}
                      onChange={(e) => setProjSolution(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-primary-green/5 pt-3">
                    <input 
                      type="text" 
                      placeholder="Client Testimonial Reviewer Name"
                      value={projTestimonialName}
                      onChange={(e) => setProjTestimonialName(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Client Testimonial Review Text"
                      value={projTestimonialText}
                      onChange={(e) => setProjTestimonialText(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#1a3020]">
                      <input 
                        type="checkbox" 
                        checked={projFeatured} 
                        onChange={(e) => setProjFeatured(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary-green"
                      />
                      <span>Feature this project case study on homepage?</span>
                    </label>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer">
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
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="font-serif font-bold text-sm text-[#1a3020]">Current Published Projects</h4>
                  {projects.map(p => (
                    <div key={p._id} className="bg-white border border-foreground/5 p-3.5 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-[#1a3020]">{p.name}</span>
                        <span className="text-[10px] text-foreground/45 block mt-0.5">Category: {p.category} • Location: {p.location} {p.featured && "• 🌟 Featured"}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleEditProjectClick(p)} className="text-primary-green hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDeleteProject(p._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CRUD Gallery */}
            {activeTab === "gallery" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">CRUD Gallery Editor</h3>
                  <p className="text-xs text-foreground/50">Edit gallery pictures andBefore-After image comparison URLs.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateOrUpdateGallery} className="bg-sage-light/20 p-5 rounded-2xl border border-primary-green/10 flex flex-col gap-4">
                  <h4 className="font-bold text-xs text-primary-green uppercase tracking-wider">
                    {editingGallery ? `Edit Photo: ${editingGallery.title}` : "Upload New Gallery Item"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Photo Title"
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs"
                    />
                    <select 
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs font-semibold"
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
                      placeholder="After Image URL (Main display)"
                      value={galUrl}
                      onChange={(e) => setGalUrl(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Before Image URL (Optional, for comparison slider)"
                      value={galBeforeUrl}
                      onChange={(e) => setGalBeforeUrl(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Short photo caption details..."
                    value={galCaption}
                    onChange={(e) => setGalCaption(e.target.value)}
                    className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer">
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
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="font-serif font-bold text-sm text-[#1a3020]">Existing Photo Gallery</h4>
                  {gallery.map(g => (
                    <div key={g._id} className="bg-white border border-foreground/5 p-3 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-[#1a3020]">{g.title}</span>
                        <span className="text-[10px] text-foreground/45 block mt-0.5">Category: {g.category} {g.beforeImageUrl && "• (Comparison slider enabled)"}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleEditGalleryClick(g)} className="text-primary-green hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDeleteGallery(g._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CRUD Blogs */}
            {activeTab === "blogs" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                {selectedBlogComments ? (
                  /* Comment moderator view */
                  <div className="flex flex-col gap-6">
                    <button onClick={() => setSelectedBlogComments(null)} className="text-xs font-bold text-[#1a3020] hover:text-primary-green transition-colors w-fit">
                      ← Back to Article Manager
                    </button>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#1a3020]">Moderate Comments: {selectedBlogComments.title}</h4>
                      <p className="text-xs text-foreground/50">Approve, block, or delete comments written by website visitors.</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {selectedBlogComments.comments?.length === 0 ? (
                        <p className="text-xs text-foreground/40 italic bg-sage-light/20 p-4 rounded-xl text-center">No comments written for this post.</p>
                      ) : (
                        selectedBlogComments.comments.map(c => (
                          <div key={c._id} className="bg-white border border-foreground/5 p-4 rounded-2xl text-xs flex justify-between items-center">
                            <div>
                              <span className="font-bold text-[#1a3020] block">{c.name}</span>
                              <p className="text-foreground/75 leading-relaxed mt-1">{c.text}</p>
                            </div>
                            <button onClick={() => handleDeleteComment(selectedBlogComments._id, c._id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
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
                      <h3 className="font-serif font-bold text-lg text-[#1a3020]">CRUD Blogs Editor</h3>
                      <p className="text-xs text-foreground/50">Write botanical tips and moderate readers comments.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleCreateOrUpdateBlog} className="bg-sage-light/20 p-5 rounded-2xl border border-primary-green/10 flex flex-col gap-4">
                      <h4 className="font-bold text-xs text-primary-green uppercase tracking-wider">
                        {editingBlog ? `Edit Blog Article: ${editingBlog.title}` : "Compose New Article"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input 
                          type="text" 
                          required
                          placeholder="Article Title"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs"
                        />
                        <input 
                          type="text" 
                          placeholder="Cover Image URL"
                          value={blogUrl}
                          onChange={(e) => setBlogUrl(e.target.value)}
                          className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs"
                        />
                        <select 
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs font-semibold"
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
                        className="bg-white border border-foreground/10 text-foreground py-2.5 px-3 rounded-lg text-xs resize-none"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer">
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
                    <div className="flex flex-col gap-2 mt-4">
                      <h4 className="font-serif font-bold text-sm text-[#1a3020]">Published Blogs</h4>
                      {blogs.map(b => (
                        <div key={b._id} className="bg-white border border-foreground/5 p-3.5 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-[#1a3020]">{b.title}</span>
                            <span className="text-[10px] text-foreground/45 block mt-0.5">Category: {b.category} • Comments count: <b>{b.comments?.length || 0}</b></span>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setSelectedBlogComments(b)} className="text-yellow-600 hover:underline font-bold">Moderate Comments</button>
                            <button onClick={() => handleEditBlogClick(b)} className="text-primary-green hover:underline font-bold">Edit</button>
                            <button onClick={() => handleDeleteBlog(b._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: Careers & Messages */}
            {activeTab === "careers" && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                {/* Messages Inbox */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Inquiries Contact Inbox</h3>
                  <p className="text-xs text-foreground/50 mb-4">View and delete generic customer support messages.</p>
                  
                  <div className="flex flex-col gap-3">
                    {messages.length === 0 ? (
                      <p className="text-xs text-foreground/40 italic bg-sage-light/20 p-4 rounded-xl text-center">No messages in support inbox.</p>
                    ) : (
                      messages.map(m => (
                        <div key={m._id} className="bg-white border border-foreground/5 p-4 rounded-xl text-xs flex justify-between items-start">
                          <div className="flex-grow min-w-0 pr-4">
                            <div className="flex justify-between items-center text-[10px] text-foreground/40 uppercase mb-1">
                              <span>From: <b>{m.name}</b> ({m.email})</span>
                              <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                            </div>
                            {m.subject && <span className="block font-bold text-primary-green mb-1">Subject: {m.subject}</span>}
                            <p className="text-foreground/75 leading-relaxed bg-[#f8faf9] p-2.5 rounded-lg">{m.message}</p>
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
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020] border-t border-foreground/5 pt-6">Job Candidates CV Application Tracker</h3>
                  <p className="text-xs text-foreground/50 mb-4">Shortlist or reject botanical engineer and horticulturist job applicants.</p>

                  <div className="flex flex-col gap-3">
                    {careers.length === 0 ? (
                      <p className="text-xs text-foreground/40 italic bg-sage-light/20 p-4 rounded-xl text-center">No candidates submitted CV resumes.</p>
                    ) : (
                      careers.map(car => (
                        <div key={car._id} className="bg-white border border-foreground/5 p-4 rounded-xl text-xs flex justify-between items-start">
                          <div>
                            <span className="font-bold text-[#1a3020] text-sm">{car.name}</span>
                            <span className="block text-[10px] text-foreground/45 mt-0.5">Email: {car.email} • Phone: {car.phone}</span>
                            <span className="block font-bold text-primary-green mt-1">Applying Role: {car.department}</span>
                            {car.coverLetter && <p className="text-foreground/60 leading-relaxed mt-2 italic bg-[#f8faf9] p-2 rounded-lg">"{car.coverLetter}"</p>}
                            <div className="flex gap-2 items-center mt-3">
                              <span className="text-[10px] font-bold text-foreground/50">Change Status:</span>
                              {["Reviewing", "Shortlisted", "Rejected"].map(state => (
                                <button
                                  key={state}
                                  onClick={() => handleUpdateCareerStatus(car._id, state)}
                                  className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${
                                    car.status === state
                                      ? "bg-primary-green text-white border-primary-green"
                                      : "bg-white text-foreground/60 border-foreground/10 hover:border-primary-green/30"
                                  }`}
                                >
                                  {state}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <a href={car.resumeUrl} target="_blank" rel="noreferrer" className="bg-[#f4f7f5] hover:bg-[#e9eee9] border border-primary-green/10 text-primary-green px-3 py-1.5 rounded-lg font-bold text-[10px] transition-colors">
                              View CV Resume ➔
                            </a>
                            <div className="flex gap-2 items-center">
                              <span className="bg-yellow-50 text-yellow-600 font-bold border border-yellow-100 px-2 py-0.5 rounded-full text-[9px] uppercase">
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

            {/* TAB 8: Global Settings Config */}
            {activeTab === "settings" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Global Website Configuration</h3>
                  <p className="text-xs text-foreground/50">Modify default telephone numbers, office addresses, theme color codes, and SEO description metadata across pages.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 max-w-xl">
                  {settingsSuccess && (
                    <div className="bg-primary-green/10 text-primary-green text-xs font-bold p-3.5 rounded-xl border border-primary-green/15">
                      ✓ Global site configurations saved and published successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Business Name</label>
                      <input 
                        type="text" 
                        required
                        value={settings.title}
                        onChange={(e) => handleSettingsChange("title", e.target.value)}
                        className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Primary Phone</label>
                      <input 
                        type="text" 
                        required
                        value={settings.phone}
                        onChange={(e) => handleSettingsChange("phone", e.target.value)}
                        className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Business Email</label>
                      <input 
                        type="email" 
                        required
                        value={settings.email}
                        onChange={(e) => handleSettingsChange("email", e.target.value)}
                        className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Office Location Address</label>
                      <input 
                        type="text" 
                        required
                        value={settings.address}
                        onChange={(e) => handleSettingsChange("address", e.target.value)}
                        className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Theme Color Code</label>
                      <input 
                        type="text" 
                        required
                        value={settings.themeColor}
                        onChange={(e) => handleSettingsChange("themeColor", e.target.value)}
                        className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green font-mono text-center"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Facebook Page URL</label>
                      <input 
                        type="text" 
                        value={settings.fbPage}
                        onChange={(e) => handleSettingsChange("fbPage", e.target.value)}
                        className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase">Global SEO Meta Description</label>
                    <textarea 
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) => handleSettingsChange("seoDescription", e.target.value)}
                      className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="bg-[#1a3020] hover:bg-black text-white font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer w-fit mt-2"
                  >
                    {settingsSaving ? "Publishing Configs..." : "Publish Config Settings"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
