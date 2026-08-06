"use client";

import Hero from "@/components/home/Hero";
import FeaturedSection from "@/components/home/FeaturedSection";
import Services from "@/components/home/Services";
import Estimator from "@/components/home/Estimator";
import Gallery from "@/components/home/Gallery";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* About / Featured Section */}
      <FeaturedSection />
      
      {/* Services Showcase */}
      <Services />
      
      {/* Inline Cost Estimator Section */}
      <Estimator isModal={false} />
      
      {/* Image Gallery Showcase */}
      <Gallery />
      
      {/* Contact Form Callback Section */}
      <Contact />
    </>
  );
}
