"use client";

import React, { useState } from "react";

interface RolePermissions {
  dashboard: boolean;
  users: boolean;
  content: boolean;
  bookings: boolean;
  reviews: boolean;
  settings: boolean;
}

export default function RolesTab() {
  const [permissions, setPermissions] = useState<Record<string, RolePermissions>>({
    admin: { dashboard: true, users: true, content: true, bookings: true, reviews: true, settings: true },
    editor: { dashboard: true, users: false, content: true, bookings: true, reviews: true, settings: false },
    support: { dashboard: true, users: false, content: false, bookings: true, reviews: false, settings: false }
  });

  const togglePermission = (role: string, key: keyof RolePermissions) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key]
      }
    }));
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      <div>
        <h3 className="font-sans font-bold text-lg text-white">রোল ও পারমিশন • Roles & Permissions</h3>
        <p className="text-xs text-stone-400 mt-0.5">Define role permission matrix values for dashboard views, settings configs and database edits.</p>
      </div>

      <div className="overflow-x-auto w-full rounded-2xl border border-white/10 bg-black/30">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04] text-stone-400 font-bold font-mono uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Permission Access Point</th>
              <th className="py-3.5 px-4 text-center">Super Admin</th>
              <th className="py-3.5 px-4 text-center">Editor</th>
              <th className="py-3.5 px-4 text-center">Support Staff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(
              [
                { key: "dashboard", label: "Access Analytics & Overview Studio" },
                { key: "users", label: "Assign Roles & Permissions Control" },
                { key: "content", label: "Perform full CRUD on Services, Projects, Blogs, Gallery" },
                { key: "bookings", label: "Update booking status & assign experts" },
                { key: "reviews", label: "Moderate & Publish customer reviews" },
                { key: "settings", label: "Edit backend settings and theme colors" }
              ] as const
            ).map(p => (
              <tr key={p.key} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4 font-semibold text-stone-200">{p.label}</td>
                <td className="py-4 px-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={permissions.admin[p.key]} 
                    onChange={() => togglePermission("admin", p.key)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </td>
                <td className="py-4 px-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={permissions.editor[p.key]} 
                    onChange={() => togglePermission("editor", p.key)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </td>
                <td className="py-4 px-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={permissions.support[p.key]} 
                    onChange={() => togglePermission("support", p.key)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-xs text-stone-400 mt-2">
        <p className="leading-relaxed">
          <b className="text-emerald-400 font-mono">Note:</b> Changes made here apply instantly to all current user sessions matching the selected role types. Ensure permissions align with project workflow standards.
        </p>
      </div>
    </div>
  );
}
