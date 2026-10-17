"use client";

import React, { useState } from "react";
import { IProject } from "@/types";
import ProjectCreateModal, { ProjectFormData } from "./projects/ProjectCreateModal";
import ProjectDetailModal from "./projects/ProjectDetailModal";
import ProjectList from "./projects/ProjectList";
import ConfirmModal from "./shared/ConfirmModal";

interface ProjectsTabProps {
  projects?: IProject[];
  onRefresh?: () => void;
  // Optional backward compatible props
  projName?: string;
  setProjName?: (val: string) => void;
  projClient?: string;
  setProjClient?: (val: string) => void;
  projCategory?: string;
  setProjCategory?: (val: string) => void;
  projUrl?: string;
  setProjUrl?: (val: string) => void;
  projLocation?: string;
  setProjLocation?: (val: string) => void;
  projDuration?: string;
  setProjDuration?: (val: string) => void;
  projBudget?: string;
  setProjBudget?: (val: string) => void;
  projChallenges?: string;
  setProjChallenges?: (val: string) => void;
  projSolution?: string;
  setProjSolution?: (val: string) => void;
  projTestimonialName?: string;
  setProjTestimonialName?: (val: string) => void;
  projTestimonialText?: string;
  setProjTestimonialText?: (val: string) => void;
  projFeatured?: boolean;
  setProjFeatured?: (val: boolean) => void;
  editingProject?: IProject | null;
  handleCreateOrUpdateProject?: (e: React.FormEvent) => void;
  handleEditProjectClick?: (proj: IProject) => void;
  handleDeleteProject?: (id?: string) => void;
  resetProjectForm?: () => void;
}

const CATEGORIES = [
  "Residential",
  "Commercial",
  "Villa",
  "Rooftop Garden",
  "Vertical Living Wall",
  "Resort & Hospitality",
  "Urban Forestry",
];

const STATUS_OPTIONS = [
  { value: "RUNNING", label: "চলমান (Running)", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "COMPLETED", label: "সম্পন্ন (Completed)", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "PLANNING", label: "পরিকল্পনাধীন (Planning)", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "MAINTENANCE", label: "রক্ষণাবেক্ষণাধীন (Maintenance)", color: "bg-purple-100 text-purple-800 border-purple-300" },
];

export default function ProjectsTab({
  projects = [],
  onRefresh,
}: ProjectsTabProps) {
  // Modal State: 'create' | 'edit' | 'view' | 'delete' | null
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | "delete" | null>(null);
  const [activeProject, setActiveProject] = useState<IProject | null>(null);
  const [activeViewMediaTab, setActiveViewMediaTab] = useState<"after" | "before">("after");

  // Form Fields State for Create & Edit
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    titleBn: "",
    slug: "",
    clientName: "",
    clientPhone: "",
    category: "Residential",
    location: "",
    status: "RUNNING",
    progress: 50,
    budget: "",
    totalExpense: "",
    duration: "4 Weeks",
    warrantyMonths: 12,
    afterImage: "",
    beforeImage: "",
    galleryImagesText: "",
    description: "",
    descBn: "",
    challenges: "",
    solution: "",
    testimonialName: "",
    testimonialText: "",
    featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getStatusBadge = (statusName?: string) => {
    const s = (statusName || "RUNNING").toUpperCase();
    const found = STATUS_OPTIONS.find((opt) => opt.value === s);
    return found || STATUS_OPTIONS[0];
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormData({
      name: "",
      titleBn: "",
      slug: "",
      clientName: "",
      clientPhone: "",
      category: "Residential",
      location: "ধানমন্ডি, ঢাকা",
      status: "RUNNING",
      progress: 30,
      budget: "350000",
      totalExpense: "120000",
      duration: "3 Weeks",
      warrantyMonths: 12,
      afterImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
      galleryImagesText: "",
      description: "আধুনিক বায়োফিলিক ল্যান্ডস্কেপ আর্কিটেকচার ও উন্নত ড্রেনেজ সিস্টেম সমন্বিত ছাদবাগান প্রকল্প।",
      descBn: "প্রাকৃতিক আলো ও সবুজের সমন্বয়ে একটি টেকসই ও সুন্দর ছাদবাগান বাস্তবায়ন।",
      challenges: "ছাদ স্লাবের মাইক্রো ফ্র্যাকচার ওয়াটারপ্রুফিং ও অতিরিক্ত ওজন বহন করার সীমাবদ্ধতা।",
      solution: "৩ স্তরের ইলাস্টোমেরিক মেমব্রেন এবং হালকা ওজনের প্রসারিত ক্লে অ্যাগ্রিগেট সাবস্ট্রেট স্থাপন।",
      testimonialName: "",
      testimonialText: "",
      featured: false,
    });
    setActiveProject(null);
    setModalMode("create");
  };

  // Open Edit Modal
  const handleOpenEditModal = (proj: IProject) => {
    const materials = proj.materialsUsed as any;
    const notesStr = proj.notes || "";
    
    let dur = proj.duration || "";
    if (!dur && notesStr.includes("Duration:")) {
      const match = notesStr.match(/Duration:\s*([^|]+)/);
      if (match) dur = match[1].trim();
    }

    setFormData({
      name: proj.name || proj.title || "",
      titleBn: proj.titleBn || "",
      slug: proj.slug || "",
      clientName: proj.clientName || proj.client || "",
      clientPhone: proj.clientPhone || "",
      category: proj.category || "Residential",
      location: proj.location || "",
      status: proj.status || "RUNNING",
      progress: typeof proj.progress === "number" ? proj.progress : 50,
      budget: proj.budget ? String(proj.budget) : (proj.budgetRange || ""),
      totalExpense: proj.totalExpense ? String(proj.totalExpense) : "",
      duration: dur || "4 Weeks",
      warrantyMonths: proj.warrantyMonths || 12,
      afterImage: proj.afterImage || proj.imageUrl || "",
      beforeImage: proj.beforeImage || "",
      galleryImagesText: Array.isArray(proj.images) ? proj.images.join("\n") : "",
      description: proj.description || "",
      descBn: proj.descBn || "",
      challenges: proj.challenges || materials?.challenges || "",
      solution: proj.solution || materials?.solution || "",
      testimonialName: proj.clientTestimonial?.name || materials?.testimonial?.name || "",
      testimonialText: proj.clientTestimonial?.text || materials?.testimonial?.text || "",
      featured: Boolean(proj.featured),
    });
    setActiveProject(proj);
    setModalMode("edit");
  };

  // Open View Details Modal
  const handleOpenViewModal = (proj: IProject) => {
    setActiveProject(proj);
    setActiveViewMediaTab("after");
    setModalMode("view");
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (proj: IProject) => {
    setActiveProject(proj);
    setModalMode("delete");
  };

  // Close Any Modal
  const handleCloseModal = () => {
    setModalMode(null);
    setActiveProject(null);
  };

  // Submit Handler: Create or Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("প্রজেক্টের নাম আবশ্যক!");
      return;
    }

    setIsSubmitting(true);
    try {
      const allGalleryImages = formData.galleryImagesText
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        titleBn: formData.titleBn?.trim() || null,
        slug:
          formData.slug.trim() ||
          formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now()}`,
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim(),
        category: formData.category,
        location: formData.location.trim(),
        status: formData.status,
        progress: Number(formData.progress) || 0,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        totalExpense: formData.totalExpense ? parseFloat(formData.totalExpense) : 0,
        afterImage: formData.afterImage.trim() || null,
        beforeImage: formData.beforeImage.trim() || null,
        images: allGalleryImages.length > 0 ? allGalleryImages : formData.afterImage ? [formData.afterImage] : [],
        description: formData.description.trim() || null,
        descBn: formData.descBn?.trim() || null,
        notes: `Duration: ${formData.duration} | Challenges: ${formData.challenges} | Solution: ${formData.solution} | Warranty: ${formData.warrantyMonths} Months`,
        materialsUsed: {
          duration: formData.duration,
          challenges: formData.challenges,
          solution: formData.solution,
          warrantyMonths: formData.warrantyMonths,
          testimonial: {
            name: formData.testimonialName,
            text: formData.testimonialText,
          },
        },
        featured: formData.featured,
      };

      if (modalMode === "create") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "প্রজেক্ট সংরক্ষণ ব্যর্থ হয়েছে");
        }

        showToast("✓ নতুন প্রজেক্ট সফলভাবে ডাটাবেজে তৈরি হয়েছে!");
      } else if (modalMode === "edit" && activeProject) {
        const projId = activeProject.id || (activeProject as any)._id;
        const res = await fetch(`/api/projects/${projId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "প্রজেক্ট আপডেট ব্যর্থ হয়েছে");
        }

        showToast("✓ প্রজেক্টের যাবতীয় তথ্য সফলভাবে আপডেট হয়েছে!");
      }

      handleCloseModal();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("ত্রুটি: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Handler: Delete
  const handleConfirmDelete = async () => {
    if (!activeProject) return;
    const projId = activeProject.id || (activeProject as any)._id;
    if (!projId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "প্রজেক্ট ডিলিট করা যায়নি");
      }
      showToast("🗑️ প্রজেক্ট সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে!");
      handleCloseModal();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("ত্রুটি: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Project Listing with Filters & KPIs */}
      <ProjectList
        projects={projects}
        onOpenCreate={handleOpenCreateModal}
        onOpenView={handleOpenViewModal}
        onOpenEdit={handleOpenEditModal}
        onOpenDelete={handleOpenDeleteModal}
        getStatusBadge={getStatusBadge}
        categories={CATEGORIES}
        statusOptions={STATUS_OPTIONS}
        toastMessage={toastMessage}
        onClearToast={() => setToastMessage(null)}
      />

      {/* Modal 1 & 2: Create / Edit Project Modal */}
      {(modalMode === "create" || modalMode === "edit") && (
        <ProjectCreateModal
          modalMode={modalMode}
          formData={formData}
          setFormData={setFormData}
          activeProject={activeProject}
          onClose={handleCloseModal}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          categories={CATEGORIES}
          statusOptions={STATUS_OPTIONS}
        />
      )}

      {/* Modal 3: View Details Modal */}
      {modalMode === "view" && activeProject && (
        <ProjectDetailModal
          activeProject={activeProject}
          activeViewMediaTab={activeViewMediaTab}
          setActiveViewMediaTab={setActiveViewMediaTab}
          onClose={handleCloseModal}
          onEdit={(proj) => {
            handleCloseModal();
            handleOpenEditModal(proj);
          }}
          onDelete={(proj) => {
            handleCloseModal();
            handleOpenDeleteModal(proj);
          }}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Modal 4: Delete Confirmation Modal */}
      {modalMode === "delete" && activeProject && (
        <ConfirmModal
          isOpen={true}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="প্রজেক্ট মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে "${activeProject.name}" প্রজেক্টটি স্থায়ীভাবে মুছে ফেলতে চান?`}
          itemName={activeProject.name}
          confirmLabel="হ্যাঁ, প্রজেক্ট মুছুন"
          cancelLabel="বাতিল"
          variant="danger"
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
