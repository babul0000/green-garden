"use client";

import React from "react";

interface HeroBackgroundMediaProps {
  mediaType: "video" | "image";
  videoUrl: string;
  posterImageUrl: string;
  imageUrl?: string;
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function HeroBackgroundMedia({
  mediaType,
  videoUrl,
  posterImageUrl,
  imageUrl,
  autoPlay,
  muted,
  loop,
  videoRef,
}: HeroBackgroundMediaProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {mediaType === "video" ? (
        <video
          ref={videoRef}
          key={videoUrl}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          controls={false}
          poster={posterImageUrl}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageUrl || posterImageUrl}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
      )}
    </div>
  );
}
