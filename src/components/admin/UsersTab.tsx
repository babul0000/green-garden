"use client";

import React, { useState, useEffect } from "react";
import { IUser, UserRole } from "@/types";

export default function UsersTab() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setRole("client");
        fetchUsers();
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id?: string, newRole?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      <div>
        <h3 className="font-sans font-bold text-lg text-white">ইউজার ম্যানেজমেন্ট • User Management</h3>
        <p className="text-xs text-stone-400 mt-0.5">Control platform users, access authority, and administrative staff list.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateUser} className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">Register New System User</h4>
        
        {success && (
          <div className="bg-emerald-500/10 text-emerald-300 text-xs font-semibold p-3 rounded-xl border border-emerald-500/25">
            ✓ User registered successfully!
          </div>
        )}
        {error && (
          <div className="bg-rose-500/10 text-rose-300 text-xs font-semibold p-3 rounded-xl border border-rose-500/25">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
          />
          <input 
            type="email" 
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
          />
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none"
          >
            <option value="client" className="bg-[#121A14] text-white">Client (Default)</option>
            <option value="admin" className="bg-[#121A14] text-white">Super Admin</option>
            <option value="editor" className="bg-[#121A14] text-white">Editor</option>
            <option value="moderator" className="bg-[#121A14] text-white">Moderator</option>
          </select>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {loading ? "Registering..." : "Add User"}
          </button>
        </div>
      </form>

      {/* Users List */}
      <div className="flex flex-col gap-3 mt-2">
        <h4 className="font-sans font-bold text-sm text-white font-mono">Platform Users ({users.length})</h4>
        <div className="overflow-x-auto w-full rounded-2xl border border-white/10 bg-black/30">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-stone-400 font-bold font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id || u._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{u.name}</td>
                  <td className="py-3.5 px-4 text-stone-300 font-mono">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <select 
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u.id || u._id, e.target.value)}
                      className="bg-black/50 border border-white/15 py-1 px-2.5 rounded-lg text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="client" className="bg-[#121A14]">Client</option>
                      <option value="admin" className="bg-[#121A14]">Super Admin</option>
                      <option value="editor" className="bg-[#121A14]">Editor</option>
                      <option value="moderator" className="bg-[#121A14]">Moderator</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(u.id || u._id)}
                      className="text-rose-400 hover:text-rose-300 font-semibold px-2 cursor-pointer transition-colors"
                    >
                      Remove 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
