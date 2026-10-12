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
  const [videoError, setVideoError] = React.useState(false);

  // Reset video error when videoUrl changes
  React.useEffect(() => {
    setVideoError(false);
    if (videoRef.current && mediaType === "video" && videoUrl) {
      videoRef.current.load();
      if (autoPlay) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [videoUrl, mediaType, autoPlay, videoRef]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {mediaType === "video" && !videoError ? (
        <video
          ref={videoRef}
          key={videoUrl}
          src={videoUrl}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          preload="auto"
          controls={false}
          poster={posterImageUrl}
          onError={() => {
            console.warn("Video failed to play from URL:", videoUrl, "falling back to poster image");
            setVideoError(true);
          }}
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
