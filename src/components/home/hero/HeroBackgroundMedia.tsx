"use client";

import React, { useState, useEffect, useRef } from "react";

interface HeroBackgroundMediaProps {
  mediaType: "video" | "image";
  videoUrl: string;
  posterImageUrl: string;
  imageUrl?: string;
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  version?: number | string;
  mediaFit?: "cover" | "contain" | "fill";
  mediaPosition?: "center" | "top" | "bottom";
  mobileMediaFit?: "cover" | "contain";
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
  version,
  mediaFit = "cover",
  mediaPosition = "center",
  mobileMediaFit,
}: HeroBackgroundMediaProps) {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const prevVideoUrlRef = useRef<string>("");

  const effectiveVideoUrl = React.useMemo(() => {
    if (!videoUrl) return "";
    if (!version) return videoUrl;
    const separator = videoUrl.includes("?") ? "&" : "?";
    return `${videoUrl}${separator}_v=${version}`;
  }, [videoUrl, version]);

  const effectivePosterUrl = React.useMemo(() => {
    if (!posterImageUrl) return "";
    if (!version) return posterImageUrl;
    const separator = posterImageUrl.includes("?") ? "&" : "?";
    return `${posterImageUrl}${separator}_v=${version}`;
  }, [posterImageUrl, version]);

  const effectiveImageUrl = React.useMemo(() => {
    const target = imageUrl || posterImageUrl;
    if (!target) return "/hero_plants.png";
    if (!version) return target;
    const separator = target.includes("?") ? "&" : "?";
    return `${target}${separator}_v=${version}`;
  }, [imageUrl, posterImageUrl, version]);

  const [activeImageSrc, setActiveImageSrc] = useState<string>(() => {
    return imageUrl || posterImageUrl || "/hero_plants.png";
  });
  const [isImgReady, setIsImgReady] = useState(true);

  useEffect(() => {
    const target = effectiveImageUrl;
    if (!target || target === activeImageSrc) return;

    const img = new Image();
    img.src = target;
    img.onload = () => {
      setActiveImageSrc(target);
      setIsImgReady(true);
    };
    img.onerror = () => {
      setActiveImageSrc(target);
      setIsImgReady(true);
    };
  }, [effectiveImageUrl, activeImageSrc]);

  const [preferStaticMedia, setPreferStaticMedia] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSaveData = (navigator as any)?.connection?.saveData === true;
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isSaveData || isReducedMotion) {
        setPreferStaticMedia(true);
      }
    }
  }, []);

  // Only reload video if URL actually changes
  useEffect(() => {
    if (!preferStaticMedia && mediaType === "video" && effectiveVideoUrl && prevVideoUrlRef.current !== effectiveVideoUrl) {
      prevVideoUrlRef.current = effectiveVideoUrl;
      setVideoError(false);
      setIsVideoLoaded(false);
      if (videoRef.current) {
        videoRef.current.load();
        if (autoPlay) {
          videoRef.current.play().catch(() => {});
        }
      }
    }
  }, [effectiveVideoUrl, mediaType, autoPlay, videoRef, preferStaticMedia]);

  const desktopFitClass =
    mediaFit === "contain"
      ? "md:object-contain"
      : mediaFit === "fill"
      ? "md:object-fill"
      : "md:object-cover";

  const effectiveMobileFit = mobileMediaFit || (mediaFit === "contain" ? "contain" : "cover");
  const mobileFitClass =
    effectiveMobileFit === "contain"
      ? "max-md:object-contain"
      : "max-md:object-cover";

  const positionClass =
    mediaPosition === "top"
      ? "object-top"
      : mediaPosition === "bottom"
      ? "object-bottom"
      : "object-center";

  const isContainMode = mediaFit === "contain" || effectiveMobileFit === "contain";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#041a2e] flex items-center justify-center">
      {/* Ambient background glow when contain is active for full video/photo visibility */}
      {isContainMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45 select-none" aria-hidden="true">
          <img
            src={activeImageSrc || effectivePosterUrl}
            alt=""
            className="w-full h-full object-cover blur-3xl scale-125"
          />
        </div>
      )}

      {!preferStaticMedia && mediaType === "video" && !videoError && effectiveVideoUrl ? (
        <>
          {/* Smooth poster preview layer */}
          {effectivePosterUrl && (
            <img
              src={effectivePosterUrl}
              alt="Hero Preview"
              className={`absolute inset-0 w-full h-full ${desktopFitClass} ${mobileFitClass} ${positionClass} transition-opacity duration-1000 ${
                isVideoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
          )}

          <video
            ref={videoRef}
            src={effectiveVideoUrl}
            poster={effectivePosterUrl || "/hero_plants.png"}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            preload="metadata"
            controls={false}
            onLoadedData={() => setIsVideoLoaded(true)}
            onPlaying={() => setIsVideoLoaded(true)}
            onError={() => {
              console.warn("Video failed to play from URL:", videoUrl, "falling back to poster/image");
              setVideoError(true);
            }}
            className={`w-full h-full ${desktopFitClass} ${mobileFitClass} ${positionClass} transition-opacity duration-700 ${
              isVideoLoaded ? "opacity-100" : "opacity-90"
            }`}
          />
        </>
      ) : (
        <img
          key={activeImageSrc}
          src={activeImageSrc}
          alt="Hero Background"
          className={`w-full h-full ${desktopFitClass} ${mobileFitClass} ${positionClass} transition-opacity duration-700 ${
            isImgReady ? "opacity-100" : "opacity-90"
          }`}
        />
      )}
    </div>
  );
}
