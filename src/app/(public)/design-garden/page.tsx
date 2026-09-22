"use client";

import React from "react";
import DesignYourGardenWizard from "@/components/home/DesignYourGardenWizard";
import Link from "next/link";

export default function DesignGardenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <span className="text-emerald-800 font-semibold">Design Your Garden</span>
        </div>

        <DesignYourGardenWizard />
      </div>
    </div>
  );
}
