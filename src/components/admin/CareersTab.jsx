"use client";

import React from "react";

export default function CareersTab({
  messages = [],
  careers = [],
  handleDeleteMessage,
  handleUpdateCareerStatus,
  handleDeleteCareer
}) {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      
      {/* Messages Inbox */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#0c1911]">Messages Inquiries</h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-2">View and manage customer contact messages.</p>
        </div>
        
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-[#f8faf9] p-6 rounded-2xl text-center">No messages in inbox.</p>
          ) : (
            messages.map(m => (
              <div key={m._id} className="bg-[#f8faf9] border border-slate-100 p-5 rounded-[20px] text-xs flex justify-between items-start">
                <div className="flex-grow min-w-0 pr-4">
                  <div className="flex justify-between items-center text-[9px] text-slate-400 uppercase tracking-wider mb-2">
                    <span>From: <b>{m.name}</b> ({m.email})</span>
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  {m.subject && <span className="block font-bold text-[#0c1911] mb-1.5">Subject: {m.subject}</span>}
                  <p className="text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">{m.message}</p>
                </div>
                <button type="button" onClick={() => handleDeleteMessage(m._id)} className="text-red-500 hover:text-red-700 text-xs font-bold p-1 cursor-pointer">
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Careers application tracker */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#0c1911]">Job Candidates CV Applications</h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-2">Shortlist or reject job applicants for engineering or design positions.</p>
        </div>

        <div className="flex flex-col gap-3">
          {careers.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-[#f8faf9] p-6 rounded-2xl text-center">No candidates submitted CVs.</p>
          ) : (
            careers.map(car => (
              <div key={car._id} className="bg-[#f8faf9] border border-slate-100 p-5 rounded-[20px] text-xs flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#0c1911] text-sm block">{car.name}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Email: {car.email} • Phone: {car.phone}</span>
                  <span className="block font-bold text-[#8ac343] mt-2">Department: {car.department}</span>
                  {car.coverLetter && <p className="text-slate-500 leading-relaxed mt-2 italic bg-white border border-slate-100 p-3 rounded-xl">"{car.coverLetter}"</p>}
                  
                  <div className="flex gap-2 items-center mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change Status:</span>
                    {["Reviewing", "Shortlisted", "Rejected"].map(state => (
                      <button
                        key={state}
                        type="button"
                        onClick={() => handleUpdateCareerStatus(car._id, state)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-colors cursor-pointer ${
                          car.status === state
                            ? "bg-[#0c1911] text-[#8ac343] border-[#0c1911]"
                            : "bg-white text-slate-500 border-slate-200 hover:border-[#8ac343]"
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                  <a href={car.resumeUrl} target="_blank" rel="noreferrer" className="bg-[#0c1911] hover:bg-black text-[#8ac343] px-3.5 py-2 rounded-xl font-bold text-[10px] shadow-sm transition-colors">
                    View CV Resume ➔
                  </a>
                  <div className="flex gap-2 items-center mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                      car.status === "Shortlisted" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : car.status === "Rejected" ? "bg-red-50 text-red-500 border border-red-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                    }`}>
                      {car.status}
                    </span>
                    <button type="button" onClick={() => handleDeleteCareer(car._id)} className="text-red-500 hover:text-red-700 text-xs font-bold p-1 cursor-pointer">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
