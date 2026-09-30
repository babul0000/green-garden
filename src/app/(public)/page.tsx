"use client";

import React from "react";
import ShmaHeroVideo from "@/components/home/ShmaHeroVideo";
import ShmaAnimatedManifesto from "@/components/home/ShmaAnimatedManifesto";
import ShmaHighlightProjects from "@/components/home/ShmaHighlightProjects";
import ShmaServicesFlip from "@/components/home/ShmaServicesFlip";
import ShmaProcess from "@/components/home/ShmaProcess";
import ShmaCampaign from "@/components/home/ShmaCampaign";
import ShmaRecentActivities from "@/components/home/ShmaRecentActivities";
import ShmaLife from "@/components/home/ShmaLife";

export default function Home() {
  return (
    <>
      {/* 1. Full-Screen Cinematic Video Hero (100vh) */}
      <ShmaHeroVideo />

      {/* 2. GSAP 4-State Animated Manifesto Container ("ENABLE CHANGE FOR A BETTER EARTH") */}
      <ShmaAnimatedManifesto />

      {/* 3. Highlight Project Showcase (Staggered 2-Column Editorial Grid with Authentic Video Loops) */}
      <ShmaHighlightProjects />

      {/* 4. 3D Flip-Box Service Section (Clean Beige Cards) */}
      <ShmaServicesFlip />

      {/* 5. Process: A Thoughtful Journey to Transformative Solutions */}
      <ShmaProcess />

      {/* 6. Campaign Swiper Banner ("A R GREEN GARDEN 10 TH Participating in the future") */}
      <ShmaCampaign />

      {/* 7. Recent Activities (5-Column Photo Stream of Studio Lectures & Exhibitions) */}
      <ShmaRecentActivities />

      {/* 8. Studio Life (Architectural Culture & Community Hub Manifesto) */}
      <ShmaLife />
    </>
  );
}
