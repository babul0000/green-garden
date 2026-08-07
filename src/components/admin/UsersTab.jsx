"use client";

import React, { useState, useEffect } from "react";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
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

  const handleCreateUser = async (e) => {
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

  const handleUpdateRole = async (id, newRole) => {
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

  const handleDeleteUser = async (id) => {
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
    <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-sans font-bold text-lg text-[#06120c]">User Management</h3>
        <p className="text-xs text-slate-400 mt-0.5">Control platform users, access authority, and administrative staff list.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateUser} className="bg-[#f8faf9] p-6 rounded-[20px] border border-slate-200/60 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-[#06120c] uppercase tracking-wider">Register New System User</h4>
        
        {success && (
          <div className="bg-emerald-50 text-emerald-600 text-xs font-semibold p-3 rounded-xl border border-emerald-100">
            ✓ User registered successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-100">
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
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
          />
          <input 
            type="email" 
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
          />
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="client">Client (Default)</option>
            <option value="admin">Super Admin</option>
            <option value="editor">Editor</option>
            <option value="support">Support Staff</option>
          </select>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#06120c] hover:bg-black text-[#8fc63f] font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
          >
            {loading ? "Registering..." : "Add User"}
          </button>
        </div>
      </form>

      {/* Users List */}
      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-sans font-bold text-sm text-[#06120c]">Platform Users ({users.length})</h4>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-semibold text-[#06120c]">{u.name}</td>
                  <td className="py-3 text-slate-500">{u.email}</td>
                  <td className="py-3">
                    <select 
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      className="bg-white border border-slate-200 py-1 px-2 rounded-lg text-[10px] font-semibold text-slate-700"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Super Admin</option>
                      <option value="editor">Editor</option>
                      <option value="support">Support</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-700 font-semibold px-2"
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
