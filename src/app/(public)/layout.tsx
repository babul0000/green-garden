"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Estimator from "@/components/home/Estimator";
import EmergencyTreeDoctorModal from "@/components/shared/EmergencyTreeDoctorModal";
import MobileQuickContact from "@/components/layout/MobileQuickContact";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/" || !pathname;
  const [showEstimatorModal, setShowEstimatorModal] = useState(false);

  useEffect(() => {
    const handleOpen = () => setShowEstimatorModal(true);
    window.addEventListener("open-estimator", handleOpen);
    return () => window.removeEventListener("open-estimator", handleOpen);
  }, []);

  // On the Home page, Home/Desktop renders its own pixel-perfect World Peas navigation and footer
  if (isHome) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-[#000000] font-sans selection:bg-[#DEF358]">
        <main className="flex-grow">{children}</main>
        {showEstimatorModal && (
          <Estimator isModal={true} onClose={() => setShowEstimatorModal(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Navbar Layout */}
      <Navbar onOpenEstimator={() => setShowEstimatorModal(true)} />

      {/* Main Page Area */}
      <main className="flex-grow">{children}</main>

      {/* Emergency Tree Doctor Floating Quick Hotline & Booking Modal */}
      <EmergencyTreeDoctorModal />

      {/* Sticky Mobile Quick Call & WhatsApp Action Bar */}
      <MobileQuickContact />

      {/* Footer Layout */}
      <Footer />

      {/* Overlay Dialog Cost Estimator Modal */}
      {showEstimatorModal && (
        <Estimator isModal={true} onClose={() => setShowEstimatorModal(false)} />
      )}
    </div>
  );
}
