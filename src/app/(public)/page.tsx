"use client";

import React from "react";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import BeforeAfterSection from "@/components/home/BeforeAfterSection";
import Gallery from "@/components/home/Gallery";
import DesignYourGardenWizard from "@/components/home/DesignYourGardenWizard";
import TeamPreview from "@/components/home/TeamPreview";
import ReviewsSection from "@/components/home/ReviewsSection";
import WhyUs from "@/components/home/WhyUs";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      {/* 1. Hero Section with Bengali Headline, Subheadline & 5 CTAs */}
      <Hero />

      {/* 2. আমাদের সেবা (Our Services Portfolio) */}
      <Services />

      {/* 3. Featured Projects & Gallery Showcase */}
      <Gallery />

      {/* 4. Before & After Interactive Transformation Slider */}
      <BeforeAfterSection />

      {/* 5. "Design Your Garden" Interactive 6-Step Multi-Stage Wizard */}
      <div id="estimator" className="px-4">
        <DesignYourGardenWizard />
      </div>

      {/* 6. Our Professional Team (Tree Doctors, Architects, Horticulturists) */}
      <TeamPreview />

      {/* 7. Customer Reviews & Ratings */}
      <ReviewsSection />

      {/* 8. Why A R Green Garden (কেন এ আর গ্রিন গার্ডেন?) */}
      <WhyUs />

      {/* 9. Contact & Location (42/A Dhanmondi, Google Map, Call, WhatsApp, Directions) */}
      <Contact />
    </>
  );
}
