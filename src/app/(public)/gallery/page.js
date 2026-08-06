"use client";

import { useState, useEffect, useRef } from "react";

const fetch = (originalFetch => (url, options) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Before & After comparison slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/gallery");
        if (res.ok) {
          const data = await res.json();
          setGallery(data);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.warn("Backend unavailable, using static fallback for gallery:", err);
        setGallery([
          {
            _id: "1",
            title: "Gulshan Rooftop Paradise",
            imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
            beforeImageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop",
            category: "Rooftop",
            caption: "A 1200 sq. ft concrete rooftop transformed into a lush sanctuary with fruit trees, lawn, and pergolas."
          },
          {
            _id: "2",
            title: "Corporate Green Facade",
            imageUrl: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
            beforeImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
            category: "Vertical",
            caption: "Gulshan commercial reception feature wall utilizing automated drip-irrigation geo-fabric pocket grid."
          },
          {
            _id: "3",
            title: "Banani Patio Oasis",
            imageUrl: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
            category: "Landscape",
            caption: "Monsoon-resilient pathway garden with stepping stones and custom uplighting arrays."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) { // Left-click dragged
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Prevent downloading/right click on image
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const categories = ["All", "Rooftop", "Vertical", "Landscape", "Indoor"];
  const filteredGallery = selectedCategory === "All"
    ? gallery
    : gallery.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-5 animate-fade-in-up">
          <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">Visual Gallery</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">
            Transformational <br />
            <span className="text-primary-green italic font-medium">Before & After Showcase</span>
          </h1>
          <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/75 leading-relaxed text-sm">
            Drag the slider horizontally to view the incredible transformation from raw concrete to beautiful gardens.
          </p>
        </div>

        {/* Before and After Slider Showcase */}
        <div className="max-w-3xl mx-auto w-full">
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[250px] md:h-[450px] w-full overflow-hidden rounded-[32px] border border-white/50 shadow-2xl select-none cursor-ew-resize"
          >
            {/* Before Image (Bottom) */}
            <div className="absolute inset-0 bg-[#f4f7f5]">
              <img 
                src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1200&auto=format&fit=crop" 
                alt="Before"
                className="w-full h-full object-cover pointer-events-none"
                onContextMenu={handleContextMenu}
              />
              <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg">
                Before Setup
              </span>
            </div>

            {/* After Image (Top, Clipped) */}
            <div 
              className="absolute inset-0 z-10"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop" 
                alt="After"
                className="w-full h-full object-cover pointer-events-none"
                onContextMenu={handleContextMenu}
              />
              {/* Watermark */}
              <span className="absolute bottom-4 right-4 bg-primary-green/85 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg">
                AR Green Garden ©
              </span>
              <span className="absolute bottom-4 left-4 bg-primary-green/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg z-20">
                After Transformation
              </span>
            </div>

            {/* Slider Line Handler */}
            <div 
              className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-primary-green shadow-lg flex items-center justify-center font-bold text-sm border-2 border-primary-green">
                ↔
              </div>
            </div>
          </div>
        </div>

        {/* Photo Grid Section */}
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-foreground/5 pb-4">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1a3020]">Photo Catalog</h3>
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-primary-green text-white border-primary-green"
                      : "bg-white text-foreground/60 border-foreground/10 hover:border-primary-green/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <span className="w-8 h-8 border-3 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredGallery.map((item, idx) => (
                <div 
                  key={item._id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative bg-[#f8faf9] rounded-2xl overflow-hidden border border-foreground/5 shadow-sm cursor-zoom-in hover:shadow-lg transition-all duration-300"
                >
                  {/* Photo Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onContextMenu={handleContextMenu}
                      loading="lazy"
                    />
                    
                    {/* Watermark Overlay */}
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-white/50 text-[9px] font-bold px-2 py-0.5 rounded select-none uppercase tracking-wider">
                      AR Green Garden
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="p-4 bg-white flex flex-col gap-1.5 border-t border-foreground/5">
                    <span className="text-[10px] text-primary-green font-bold uppercase tracking-wider">{item.category}</span>
                    <h4 className="text-sm font-bold text-[#1a3020] truncate">{item.title}</h4>
                    {item.caption && <p className="text-[11px] text-foreground/60 leading-relaxed truncate">{item.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-fade-in">
          {/* Top Bar */}
          <div className="flex justify-between items-center text-white px-4 py-2">
            <span className="text-xs font-semibold tracking-widest uppercase">
              {filteredGallery[lightboxIndex].category} • {lightboxIndex + 1} / {filteredGallery.length}
            </span>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="text-white hover:text-white/70 text-2xl font-bold cursor-pointer p-2"
            >
              ✕
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex justify-between items-center h-full max-w-5xl mx-auto w-full gap-4">
            {/* Prev Btn */}
            <button 
              onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length)}
              className="text-white hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors cursor-pointer"
            >
              ‹
            </button>

            {/* Current Image */}
            <div className="relative max-h-[70vh] flex flex-col items-center">
              <img 
                src={filteredGallery[lightboxIndex].imageUrl} 
                alt={filteredGallery[lightboxIndex].title} 
                className="max-h-[65vh] object-contain rounded-lg shadow-xl"
                onContextMenu={handleContextMenu}
              />
              {/* Overlay Watermark inside Lightbox */}
              <div className="absolute top-4 right-4 bg-black/45 text-white/40 text-[10px] tracking-wider select-none font-bold uppercase px-3 py-1 rounded">
                AR Green Garden Watermark Protected
              </div>
            </div>

            {/* Next Btn */}
            <button 
              onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredGallery.length)}
              className="text-white hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors cursor-pointer"
            >
              ›
            </button>
          </div>

          {/* Bottom Bar Info */}
          <div className="text-center text-white/90 p-4 max-w-lg mx-auto flex flex-col gap-2">
            <h3 className="text-[17px] font-bold font-serif">{filteredGallery[lightboxIndex].title}</h3>
            {filteredGallery[lightboxIndex].caption && (
              <p className="text-xs text-white/60 leading-relaxed">{filteredGallery[lightboxIndex].caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
