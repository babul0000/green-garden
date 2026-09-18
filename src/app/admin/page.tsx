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
import SecurityTab from "@/components/admin/SecurityTab";

// Import new modular admin components
import UsersTab from "@/components/admin/UsersTab";
import RolesTab from "@/components/admin/RolesTab";
import ContentTab from "@/components/admin/ContentTab";
import ReviewsTab from "@/components/admin/ReviewsTab";

const cleanApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .split("||")[0]
  .trim();

const fetchProxy = ((originalFetch) => (url: string | URL | Request, options?: RequestInit) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", cleanApiUrl), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

export default function AdminPage() {
  const { user, loading: isPending } = useAuth();
  const sessionData = user ? { user } : null;
  const [activeTab, setActiveTab] = useState("analytics");

  // Load initial tab from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("adminActiveTab");
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Save tab to localStorage on change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveTab", tab);
    }
  };

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
    phone: "01712345678",
    email: "info@argreengarden.com",
    address: "Dhanmondi, Dhaka",
    fbPage: "https://facebook.com/argreengarden",
    youtube: "https://youtube.com/argreengarden",
    themeColor: "#1a3020",
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

  const fetchData = async () => {
    try {
      // Bookings
      const resBookings = await fetchProxy("http://localhost:5000/api/bookings");
      if (resBookings.ok) setBookings(await resBookings.json());

      // Projects
      const resProjects = await fetchProxy("http://localhost:5000/api/projects");
      if (resProjects.ok) setProjects(await resProjects.json());

      // Gallery
      const resGallery = await fetchProxy("http://localhost:5000/api/gallery");
      if (resGallery.ok) setGallery(await resGallery.json());

      // Blogs
      const resBlogs = await fetchProxy("http://localhost:5000/api/blogs");
      if (resBlogs.ok) setBlogs(await resBlogs.json());

      // Services
      const resServices = await fetchProxy("http://localhost:5000/api/services");
      if (resServices.ok) setServices(await resServices.json());

      // Messages
      const resMsg = await fetchProxy("http://localhost:5000/api/messages");
      if (resMsg.ok) setMessages(await resMsg.json());

      // Careers
      const resCar = await fetchProxy("http://localhost:5000/api/careers");
      if (resCar.ok) setCareers(await resCar.json());

      // Settings
      const resSettings = await fetchProxy("http://localhost:5000/api/settings");
      if (resSettings.ok) {
        const data = await resSettings.json();
        if (data?.value) setSettings(data.value);
      }

    } catch (error) {
      console.warn("Backend data fetch failed, using mock fallbacks:", error);
    }
  };

  useEffect(() => {
    const userRole = (sessionData?.user as any)?.role;
    if (sessionData?.user && (userRole === "admin" || userRole === "editor")) {
      fetchData();
    }
  }, [sessionData]);

  // --- BOOKING OPERATIONS ---
  const handleUpdateBooking = async (id: string, status: string, staff: string) => {
    try {
      const res = await fetchProxy(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, assignedStaff: staff })
      });
      if (res.ok) fetchData();
    } catch {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: status as any, assignedStaff: staff } : b));
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetchProxy(`http://localhost:5000/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      setBookings(prev => prev.filter(b => b._id !== id));
    }
  };

  // --- SERVICES CRUD ---
  const handleCreateOrUpdateService = async (e: React.FormEvent, customPayload: any = null) => {
    e.preventDefault();
    const payload = customPayload || {
      label: serviceLabel,
      slug: serviceLabel.toLowerCase().replace(/ /g, "-"),
      desc: serviceDesc,
      icon: serviceIcon
    };

    try {
      let res;
      if (editingService && editingService._id) {
        res = await fetchProxy(`http://localhost:5000/api/services/${editingService._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetchProxy("http://localhost:5000/api/services", {
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

  const handleEditServiceClick = (srv: IService) => {
    setEditingService(srv);
    setServiceLabel(srv.label || srv.title || "");
    setServiceDesc(srv.desc || srv.description || "");
    setServiceIcon(srv.icon || "🌱");
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetchProxy(`http://localhost:5000/api/services/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      setServices(prev => prev.filter(s => s._id !== id));
    }
  };

  // --- PROJECTS CRUD ---
  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
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
      if (editingProject && editingProject._id) {
        res = await fetchProxy(`http://localhost:5000/api/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetchProxy("http://localhost:5000/api/projects", {
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

  const handleEditProjectClick = (proj: IProject) => {
    setEditingProject(proj);
    setProjName(proj.name || proj.title || "");
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

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project case study?")) return;
    try {
      const res = await fetchProxy(`http://localhost:5000/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      setProjects(prev => prev.filter(p => p._id !== id));
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
      let res;
      if (editingGallery && editingGallery._id) {
        res = await fetchProxy(`http://localhost:5000/api/gallery/${editingGallery._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetchProxy("http://localhost:5000/api/gallery", {
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

  const handleEditGalleryClick = (g: IGalleryItem) => {
    setEditingGallery(g);
    setGalTitle(g.title);
    setGalUrl(g.imageUrl);
    setGalBeforeUrl(g.beforeImageUrl || "");
    setGalCategory(g.category || "Rooftop");
    setGalCaption(g.caption || "");
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      const res = await fetchProxy(`http://localhost:5000/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      setGallery(prev => prev.filter(g => g._id !== id));
    }
  };

  // --- BLOGS & COMMENTS CRUD ---
  const handleCreateOrUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      slug: blogTitle.toLowerCase().replace(/ /g, "-"),
      author: sessionData?.user?.name || "Admin",
      coverImage: blogUrl,
      category: blogCategory,
      content: blogContent,
      readingTime: "5 mins"
    };

    try {
      let res;
      if (editingBlog && editingBlog._id) {
        res = await fetchProxy(`http://localhost:5000/api/blogs/${editingBlog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetchProxy("http://localhost:5000/api/blogs", {
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

  const handleEditBlogClick = (b: IBlog) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogUrl(b.coverImage || "");
    setBlogCategory(b.category || "Rooftop Gardening");
    setBlogContent(b.content);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await fetchProxy(`http://localhost:5000/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      setBlogs(prev => prev.filter(b => b._id !== id));
    }
  };

  const handleDeleteComment = async (blogId: string, commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    const targetBlog = blogs.find(b => b._id === blogId);
    if (!targetBlog || !targetBlog.comments) return;

    // Filter out the deleted comment
    const updatedComments = targetBlog.comments.filter(c => c._id !== commentId);
    
    try {
      const res = await fetchProxy(`http://localhost:5000/api/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments })
      });
      if (res.ok) {
        const freshBlog = await res.json();
        setSelectedBlogComments(freshBlog);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CAREER APPLICATION STATUS ---
  const handleUpdateCareerStatus = async (id: string, status: string) => {
    try {
      const res = await fetchProxy(`http://localhost:5000/api/careers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch {
      setCareers(prev => prev.map(c => c._id === id ? { ...c, status: status as any } : c));
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm("Delete this job application record?")) return;
    try {
      const res = await fetchProxy(`http://localhost:5000/api/careers/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      setCareers(prev => prev.filter(c => c._id !== id));
    }
  };

  // --- INBOX MESSAGE OPERATIONS ---
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      const res = await fetchProxy(`http://localhost:5000/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      setMessages(prev => prev.filter(m => m._id !== id));
    }
  };

  // --- GLOBAL CONFIG SETTINGS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess(false);

    try {
      const res = await fetchProxy("http://localhost:5000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSuccess(true);
      }
    } catch {
      setSettingsSuccess(true); // mock success
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSettingsChange = (field: string, val: string) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="w-10 h-10 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f5] text-slate-800 font-sans min-h-screen flex flex-col md:flex-row relative">
      
      {/* 1. LEFT SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        sessionData={sessionData} 
        inboxCount={messages.length + careers.length}
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header 
          setActiveTab={handleTabChange} 
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

          {/* TAB 10: USER MANAGEMENT */}
          {activeTab === "users" && (
            <UsersTab />
          )}

          {/* TAB 11: ROLES & PERMISSIONS */}
          {activeTab === "roles" && (
            <RolesTab />
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
        </div>
      </main>

    </div>
  );
}
