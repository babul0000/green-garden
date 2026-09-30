"use client";

import React, { useRef, useEffect } from "react";

export default function ShmaHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Fallback handled gracefully
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#041a2e] flex items-center justify-center">
      {/* Background Video (Exact Shma Video Reel & Fallback Poster) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          poster="https://shmadesigns.com/wp-content/uploads/al_opt_content/IMAGE/shmadesigns.com/wp-content/uploads/2025/06/Shma_MBCII_Photo_0013.jpg.bv.webp"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://shmadesigns.com/wp-content/uploads/2026/04/Homepage-260408.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Subtle top & bottom vignette matching Shma for header & scroll readability */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
    </section>
  );
}
