"use client";

import React, { useState } from "react";

export default function RolesTab() {
  const [permissions, setPermissions] = useState({
    admin: { dashboard: true, users: true, content: true, bookings: true, reviews: true, settings: true },
    editor: { dashboard: true, users: false, content: true, bookings: true, reviews: true, settings: false },
    support: { dashboard: true, users: false, content: false, bookings: true, reviews: false, settings: false }
  });

  const togglePermission = (role, key) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key]
      }
    }));
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-sans font-bold text-lg text-[#06120c]">Roles & Permissions</h3>
        <p className="text-xs text-slate-400 mt-0.5">Define role permission matrix values for dashboard views, settings configs and database edits.</p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-3">
              <th className="pb-3">Permission Access Point</th>
              <th className="pb-3 text-center">Super Admin</th>
              <th className="pb-3 text-center">Editor</th>
              <th className="pb-3 text-center">Support Staff</th>
            </tr>
          </thead>
          <tbody>
            {[
              { key: "dashboard", label: "Access Analytics & Overview Studio" },
              { key: "users", label: "Assign Roles & Permissions Control" },
              { key: "content", label: "Perform full CRUD on Services, Projects, Blogs, Gallery" },
              { key: "bookings", label: "Update booking status & assign experts" },
              { key: "reviews", label: "Moderate & Publish customer reviews" },
              { key: "settings", label: "Edit backend settings and theme colors" }
            ].map(p => (
              <tr key={p.key} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 font-semibold text-slate-700">{p.label}</td>
                <td className="py-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={permissions.admin[p.key]} 
                    onChange={() => togglePermission("admin", p.key)}
                    className="w-4 h-4 accent-[#91cd3d] rounded cursor-pointer"
                  />
                </td>
                <td className="py-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={permissions.editor[p.key]} 
                    onChange={() => togglePermission("editor", p.key)}
                    className="w-4 h-4 accent-[#91cd3d] rounded cursor-pointer"
                  />
                </td>
                <td className="py-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={permissions.support[p.key]} 
                    onChange={() => togglePermission("support", p.key)}
                    className="w-4 h-4 accent-[#91cd3d] rounded cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#f8faf9] p-4 rounded-xl border border-slate-200/40 text-[10px] text-slate-400 mt-2">
        <p className="leading-relaxed">
          <b>Note:</b> Changes made here apply instantly to all current user sessions matching the selected role types. Ensure permissions align with project workflow standards.
        </p>
      </div>
    </div>
  );
}
