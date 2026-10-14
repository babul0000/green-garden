"use client";

import React from "react";

// ─── Base Skeleton Pulse ───────────────────────────────────────────────────────
function Pulse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:400%_100%]
      [animation:shimmer_1.5s_ease-in-out_infinite]
      ${className}`}
      style={style}
    />
  );
}

// ─── Card Skeleton ────────────────────────────────────────────────────────────
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 ${className}`}>
      <Pulse className="h-40 w-full rounded-xl" />
      <div className="space-y-2">
        <Pulse className="h-4 w-3/4" />
        <Pulse className="h-3 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Pulse className="h-7 w-20 rounded-full" />
        <Pulse className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ───────────────────────────────────────────────────────
export function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Pulse className="h-4 rounded" style={{ width: `${50 + Math.random() * 40}%` } as any} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── KPI Stat Card Skeleton ───────────────────────────────────────────────────
export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <Pulse className="h-10 w-10 rounded-xl" />
        <Pulse className="h-5 w-14 rounded-full" />
      </div>
      <Pulse className="h-7 w-20 mb-1" />
      <Pulse className="h-3 w-28" />
    </div>
  );
}

// ─── Hero Skeleton ────────────────────────────────────────────────────────────
export function SkeletonHero() {
  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <Pulse className="h-6 w-48 bg-white/20" />
        <Pulse className="h-10 w-80 bg-white/20" />
        <Pulse className="h-4 w-64 bg-white/20" />
      </div>
    </div>
  );
}

// ─── Grid of Cards Skeleton ───────────────────────────────────────────────────
export function SkeletonGrid({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <div className={`grid gap-5 grid-cols-1 md:grid-cols-${Math.min(cols, 2)} lg:grid-cols-${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ─── Text Block Skeleton ──────────────────────────────────────────────────────
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Pulse
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? "60%" : "100%" } as any}
        />
      ))}
    </div>
  );
}
