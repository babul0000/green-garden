"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Estimator from "@/components/home/Estimator";

export default function PublicLayout({ children }) {
  const [showEstimatorModal, setShowEstimatorModal] = useState(false);

  useEffect(() => {
    const handleOpen = () => setShowEstimatorModal(true);
    window.addEventListener("open-estimator", handleOpen);
    return () => window.removeEventListener("open-estimator", handleOpen);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Navbar Layout */}
      <Navbar onOpenEstimator={() => setShowEstimatorModal(true)} />

      {/* Main Page Area */}
      <main className="flex-grow">{children}</main>

      {/* Footer Layout */}
      <Footer />

      {/* Overlay Dialog Cost Estimator Modal */}
      {showEstimatorModal && (
        <Estimator isModal={true} onClose={() => setShowEstimatorModal(false)} />
      )}
    </div>
  );
}
