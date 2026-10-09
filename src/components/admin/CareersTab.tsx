"use client";

import React from "react";

interface CareersTabProps {
  messages?: any[];
  careers?: any[];
  handleDeleteMessage: (id: string) => void;
  handleUpdateCareerStatus: (id: string, status: string) => void;
  handleDeleteCareer: (id: string) => void;
}

export default function CareersTab({
  messages = [],
  careers = [],
  handleDeleteMessage,
  handleUpdateCareerStatus,
  handleDeleteCareer
}: CareersTabProps) {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up font-sans text-[#E4E2D7]">
      
      {/* Messages Inbox */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">গ্রাহক বার্তা ও যোগাযোগ • Messages Inquiries</h3>
          <p className="text-xs text-stone-400 mt-0.5 mb-2">View and manage customer contact messages.</p>
        </div>
        
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-xs text-stone-400 italic bg-black/40 p-6 rounded-2xl text-center border border-white/10 font-mono">No messages in inbox.</p>
          ) : (
            messages.map((m: any) => (
              <div key={m.id || m._id} className="bg-black/30 border border-white/10 p-5 rounded-2xl text-xs flex justify-between items-start shadow-lg">
                <div className="flex-grow min-w-0 pr-4">
                  <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-2">
                    <span>From: <b className="text-white">{m.name}</b> ({m.email})</span>
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  {m.subject && <span className="block font-bold text-emerald-300 mb-1.5 text-sm">{m.subject}</span>}
                  <p className="text-stone-300 leading-relaxed bg-black/40 border border-white/10 p-3.5 rounded-xl">{m.message}</p>
                </div>
                <button type="button" onClick={() => handleDeleteMessage(m.id || m._id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold p-1 cursor-pointer transition-colors font-mono">
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Careers application tracker */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">চাকরি ও ইন্টার্নশিপ আবেদন • Job Applications</h3>
          <p className="text-xs text-stone-400 mt-0.5 mb-2">Shortlist or reject job applicants for engineering or design positions.</p>
        </div>

        <div className="flex flex-col gap-3">
          {careers.length === 0 ? (
            <p className="text-xs text-stone-400 italic bg-black/40 p-6 rounded-2xl text-center border border-white/10 font-mono">No candidates submitted CVs.</p>
          ) : (
            careers.map((car: any) => (
              <div key={car.id || car._id} className="bg-black/30 border border-white/10 p-5 rounded-2xl text-xs flex justify-between items-start shadow-lg">
                <div>
                  <span className="font-bold text-white text-sm block">{car.name}</span>
                  <span className="block text-[10px] text-stone-400 font-mono mt-0.5">Email: {car.email} • Phone: {car.phone}</span>
                  <span className="block font-bold text-emerald-400 mt-2 font-mono">Department: {car.department}</span>
                  {car.coverLetter && <p className="text-stone-300 leading-relaxed mt-2 italic bg-black/40 border border-white/10 p-3 rounded-xl">"{car.coverLetter}"</p>}
                  
                  <div className="flex gap-2 items-center mt-4">
                    <span className="text-[10px] font-bold text-stone-400 font-mono uppercase tracking-wider">Change Status:</span>
                    {["Reviewing", "Shortlisted", "Rejected"].map(state => (
                      <button
                        key={state}
                        type="button"
                        onClick={() => handleUpdateCareerStatus(car.id || car._id, state)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono border transition-all cursor-pointer ${
                          car.status === state
                            ? "bg-emerald-500 text-stone-950 border-emerald-500 font-bold shadow-md shadow-emerald-500/20"
                            : "bg-white/5 text-stone-400 border-white/10 hover:border-emerald-500/50 hover:text-white"
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0 ml-4 font-mono">
                  <a href={car.resumeUrl} target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-3.5 py-2 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all">
                    View CV Resume ➔
                  </a>
                  <div className="flex gap-2 items-center mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      car.status === "Shortlisted" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : car.status === "Rejected" ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}>
                      {car.status}
                    </span>
                    <button type="button" onClick={() => handleDeleteCareer(car.id || car._id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold p-1 cursor-pointer transition-colors">
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
