"use client";

import React from "react";
import WorldPeasNav from "@/components/home/world-peas/WorldPeasNav";
import WorldPeasHero from "@/components/home/world-peas/WorldPeasHero";
import WorldPeasCarousel from "@/components/home/world-peas/WorldPeasCarousel";
import WorldPeasNewsstand from "@/components/home/world-peas/WorldPeasNewsstand";
import WorldPeasNewsletterFooter from "@/components/home/world-peas/WorldPeasNewsletterFooter";

export default function Home() {
  return (
    <div className="w-full bg-white text-black min-h-screen">
      {/* 1. Header & Navigation + Big World Peas Wordmark */}
      <WorldPeasNav activeTab="Shop" basketCount={0} />

      {/* 2. Hero Video / Media Frame & Statement */}
      <WorldPeasHero />

      {/* 3. Just Harvested Near You Horizontal Carousel */}
      <WorldPeasCarousel />

      {/* 4. From the Newsstand Editorial Grid */}
      <WorldPeasNewsstand />

      {/* 5. Farm Fresh Email Newsletter & Footer Links */}
      <WorldPeasNewsletterFooter />
    </div>
  );
}
