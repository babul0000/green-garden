"use client";

import React, { useRef, useState, useCallback } from "react";

interface CloudinaryUploaderProps {
  value?: string; // current URL
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  previewType?: "image" | "video" | "auto";
  className?: string;
  disabled?: boolean;
}

/**
 * Universal Cloudinary file uploader with:
 * - Drag & Drop file drop zone
 * - Click to browse
 * - Upload progress bar
 * - Image/Video preview
 * - Error handling
 */
export default function CloudinaryUploader({
  value = "",
  onUpload,
  folder = "green-garden",
  accept = "image/*,video/*",
  label = "ফাইল আপলোড করুন",
  placeholder = "এখানে ছবি বা ভিডিও ড্র্যাগ করুন অথবা ক্লিক করুন",
  showPreview = true,
  previewType = "auto",
  className = "",
  disabled = false,
}: CloudinaryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>(value);

  const currentUrl = uploadedUrl || value;

  // Detect media type from URL
  const getMediaType = (url: string): "image" | "video" | "none" => {
    if (!url) return "none";
    if (previewType === "image") return "image";
    if (previewType === "video") return "video";
    const lower = url.toLowerCase();
    if (lower.match(/\.(mp4|webm|mov|avi|mkv)($|\?)/)) return "video";
    return "image";
  };

  const upload = useCallback(async (file: File) => {
    if (disabled) return;
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Simulate progress (XHR with real progress)
      const xhr = new XMLHttpRequest();
      
      const result = await new Promise<{ url: string }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 90));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.url) {
                resolve(data);
              } else {
                reject(new Error(data.error || "Upload failed"));
              }
            } catch {
              reject(new Error("Invalid response from server"));
            }
          } else {
            reject(new Error(`Upload failed: HTTP ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

        xhr.open("POST", `/api/upload?_t=${Date.now()}`);
        xhr.send(formData);
      });

      setProgress(100);
      setUploadedUrl(result.url);
      onUpload(result.url);
    } catch (err: any) {
      setError(err.message || "আপলোড ব্যর্থ হয়েছে");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  }, [folder, onUpload, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) upload(files[0]);
  }, [upload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files[0]) upload(files[0]);
    e.target.value = ""; // Reset so same file can be re-selected
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedUrl("");
    onUpload("");
    setError(null);
  };

  const mediaType = getMediaType(currentUrl);

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
          ${isDragging
            ? "border-emerald-400 bg-emerald-50 scale-[1.01]"
            : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 bg-gray-50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${uploading ? "pointer-events-none" : ""}
          ${currentUrl ? "p-3" : "p-6"}
        `}
      >
        {/* Preview Area */}
        {showPreview && currentUrl && !uploading && (
          <div className="relative w-full rounded-lg overflow-hidden mb-3 group">
            {mediaType === "video" ? (
              <video
                src={currentUrl}
                className="w-full max-h-40 object-cover rounded-lg"
                muted
                controls={false}
                playsInline
              />
            ) : (
              <img
                src={currentUrl}
                alt="Preview"
                className="w-full max-h-40 object-cover rounded-lg"
              />
            )}
            {/* Clear button */}
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              ×
            </button>
            {/* Change overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <span className="text-white text-sm font-medium">ক্লিক করে পরিবর্তন করুন</span>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="w-full flex flex-col items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-emerald-600 font-medium">আপলোড হচ্ছে... {progress}%</span>
          </div>
        )}

        {/* Empty State */}
        {!uploading && !currentUrl && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP, MP4 সমর্থিত</p>
          </div>
        )}

        {/* Compact "Change" text when preview shown */}
        {!uploading && currentUrl && (
          <p className="text-xs text-center text-gray-500">
            ☁️ Cloudinary · ক্লিক বা ড্র্যাগ করে পরিবর্তন করুন
          </p>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || uploading}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2 border border-red-200">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* URL input fallback */}
      {currentUrl && !uploading && (
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => { setUploadedUrl(e.target.value); onUpload(e.target.value); }}
          className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5 border border-gray-200 focus:outline-none focus:border-emerald-400 w-full"
          placeholder="অথবা সরাসরি URL পেস্ট করুন"
        />
      )}
    </div>
  );
}
