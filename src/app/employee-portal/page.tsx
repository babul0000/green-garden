"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function EmployeePortalPage() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"tasks" | "attendance" | "projects" | "profile">("tasks");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(true);
    setCheckInTime(time);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    alert(`Checked out successfully at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-light/30">
        <div className="w-10 h-10 border-4 border-primary-green/30 border-t-primary-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-light/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : "E"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-gray-900">{user?.name || "Employee Portal"}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Active Staff
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ID: EMP-101 • Role: <span className="text-emerald-700 font-medium">Senior Tree Doctor & Landscape Specialist</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <span>🕒</span> Daily Check-In
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  Checked In at: <strong>{checkInTime}</strong>
                </span>
                <button
                  onClick={handleCheckOut}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition-all"
                >
                  Check Out
                </button>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100/70 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Tasks</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-gray-900">3</span>
              <span className="text-xs text-emerald-600 font-medium">2 On-Site, 1 Diagnosis</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100/70 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Projects</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-gray-900">4</span>
              <span className="text-xs text-blue-600 font-medium">Gulshan & Dhanmondi</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100/70 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-emerald-700">96.5%</span>
              <span className="text-xs text-gray-500">22 / 23 Days</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100/70 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tree Doctor Visits</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-purple-700">12</span>
              <span className="text-xs text-purple-600 font-medium">This Month</span>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "tasks" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📋 Today's Work & Schedule
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "projects" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            🌿 Assigned Projects
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "attendance" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            ⏱️ Monthly Attendance
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "profile" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            👤 My Profile & Qualifications
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Today's Site Schedule</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">10:00 AM - 12:00 PM</span>
                    <h4 className="font-semibold text-gray-900 text-sm mt-1">Dhanmondi Penthouse Rooftop Inspection</h4>
                    <p className="text-xs text-gray-500">Location: Road 9/A, Dhanmondi • Client: Tanvir Ahmed</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                    In Progress
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-700 bg-gray-200 px-2 py-0.5 rounded">02:30 PM - 04:00 PM</span>
                    <h4 className="font-semibold text-gray-900 text-sm mt-1">Gulshan Villa Tree Health Diagnosis</h4>
                    <p className="text-xs text-gray-500">Location: Road 55, Gulshan-2 • Tree: Large Mango Tree (Leaf Spot Disease)</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-serif">My Assigned Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900 text-sm">Dhanmondi Luxury Rooftop Retreat</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    75% Progress
                  </span>
                </div>
                <p className="text-xs text-gray-500">Role: Lead Arborist & Plant Specialist</p>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-serif">Attendance Record</h3>
            <p className="text-xs text-gray-500">Daily check-in logs are synced directly with PostgreSQL attendance database.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-100 text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Check In</th>
                    <th className="py-2.5 px-3">Check Out</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-gray-800">Today</td>
                    <td className="py-2.5 px-3">{isCheckedIn ? checkInTime : "Not yet"}</td>
                    <td className="py-2.5 px-3">-</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-700 font-semibold">{isCheckedIn ? "Present" : "Pending"}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-gray-800">Yesterday</td>
                    <td className="py-2.5 px-3">09:15 AM</td>
                    <td className="py-2.5 px-3">06:05 PM</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-700 font-semibold">Present</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-serif">Profile & Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Department</span>
                <span className="font-semibold text-gray-800">Tree Doctor & Plant Health</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Experience</span>
                <span className="font-semibold text-gray-800">4 Years, 6 Months (Auto-calculated)</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Specialization</span>
                <span className="font-semibold text-gray-800">Pathology Diagnosis, Soil Testing, Tree Surgery</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Education</span>
                <span className="font-semibold text-gray-800">B.Sc in Agriculture & Horticulture, BAU</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 text-center">
          <Link href="/" className="text-xs text-emerald-700 hover:underline">
            ← Back to AR Green Garden Home
          </Link>
        </div>
      </div>
    </div>
  );
}
