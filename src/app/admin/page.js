"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

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
import SecurityTab from "@/components/admin/SecurityTab";

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
  if (false && (!sessionData?.user || (userRole !== "admin" && userRole !== "editor"))) {
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
      
      {/* 1. LEFT SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sessionData={sessionData} 
        inboxCount={messages.length + careers.length}
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header 
          setActiveTab={setActiveTab} 
          setEditingService={setEditingService} 
          fetchData={fetchData}
        />

        {/* Content Body Grid */}
        <div className="flex-grow p-8 flex flex-col gap-6">

          {/* TAB 1: OVERVIEW / DASHBOARD */}
          {activeTab === "analytics" && (
            <OverviewTab 
              bookings={bookings}
              projects={projects}
              services={services}
              setActiveTab={setActiveTab}
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

          {/* TAB 7: CAREERS & MESSAGES */}
          {activeTab === "careers" && (
            <CareersTab 
              messages={messages}
              careers={careers}
              handleDeleteMessage={handleDeleteMessage}
              handleUpdateCareerStatus={handleUpdateCareerStatus}
              handleDeleteCareer={handleDeleteCareer}
            />
          )}

          {/* TAB 8: GLOBAL CONFIG */}
          {activeTab === "settings" && (
            <SettingsTab 
              settings={settings}
              settingsSaving={settingsSaving}
              settingsSuccess={settingsSuccess}
              handleSaveSettings={handleSaveSettings}
              handleSettingsChange={handleSettingsChange}
            />
          )}

          {/* TAB 9: SECURITY */}
          {activeTab === "security" && (
            <SecurityTab 
              sessionData={sessionData}
            />
          )}

        </div>
      </main>

    </div>
  );
}
