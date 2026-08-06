"use client";

import { useState, useRef } from "react";

export default function BeforeAfterPage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

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
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-12 text-center">
        <div>
          <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">Visual transformation</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a3020] mt-3">Before & After Slider</h1>
          <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded mt-3"></div>
          <p className="text-xs md:text-sm text-foreground/75 mt-3 max-w-xl mx-auto">
            Interact with our slider by dragging the bar sideways to view complete garden conversions.
          </p>
        </div>

        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative h-[250px] md:h-[480px] w-full overflow-hidden rounded-[32px] border border-white/50 shadow-2xl select-none cursor-ew-resize mx-auto"
        >
          {/* Before */}
          <div className="absolute inset-0 bg-[#f4f7f5]">
            <img 
              src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1200&auto=format&fit=crop" 
              alt="Before"
              className="w-full h-full object-cover pointer-events-none"
              onContextMenu={e => e.preventDefault()}
            />
            <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg">
              Empty Concrete Roof
            </span>
          </div>

          {/* After */}
          <div 
            className="absolute inset-0 z-10"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <img 
              src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop" 
              alt="After"
              className="w-full h-full object-cover pointer-events-none"
              onContextMenu={e => e.preventDefault()}
            />
            <span className="absolute bottom-4 right-4 bg-primary-green/85 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg">
              AR Green Garden
            </span>
            <span className="absolute bottom-4 left-4 bg-primary-green/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg z-20">
              Transform Finished
            </span>
          </div>

          {/* Handler */}
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
    </div>
  );
}
