"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("dhaka");
  const [service, setService] = useState("rooftop");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phone) {
      setSubmitted(true);
    }
  };

  const branches = [
    { city: "Dhaka (Head Office)", address: "House 42, Road 11, Banani, Dhaka", phone: "+880 1700-000000", email: "dhaka@argreengarden.com" },
    { city: "Chittagong Branch", address: "A K Khan Circle, GEC, Chittagong", phone: "+880 1700-000001", email: "ctg@argreengarden.com" },
    { city: "Sylhet Branch", address: "Nirvana Plaza, Zindabazar, Sylhet", phone: "+880 1700-000002", email: "sylhet@argreengarden.com" }
  ];

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        
        {/* Section 1: Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in-up">
          <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">Reach Our Team</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">
            Get In Touch & <br />
            <span className="text-primary-green italic font-medium">Book Consultation</span>
          </h1>
          <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/75 leading-relaxed text-sm md:text-base">
            Want to remodel your space? Reach out directly to our coordinates or request a site visit callback from our branches.
          </p>
        </div>

        {/* Section 2: Contact Methods & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Details Left (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold font-serif text-[#1a3020]">Office Branches</h3>
              <p className="text-xs text-foreground/50">Visit or contact our regional offices across Bangladesh.</p>
            </div>

            <div className="flex flex-col gap-6">
              {branches.map((b, idx) => (
                <div key={idx} className="bg-[#f4f7f5] border border-primary-green/10 rounded-2xl p-5 flex flex-col gap-2">
                  <h4 className="font-bold text-[15px] text-[#1a3020]">{b.city}</h4>
                  <p className="text-xs text-foreground/70 leading-relaxed">📍 {b.address}</p>
                  <p className="text-xs text-foreground/70">📞 <a href={`tel:${b.phone.replace(/ /g, "")}`} className="text-primary-green hover:underline">{b.phone}</a></p>
                  <p className="text-xs text-foreground/70">✉️ <a href={`mailto:${b.email}`} className="text-primary-green hover:underline">{b.email}</a></p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-foreground/5 text-sm font-semibold">
              <a 
                href="https://wa.me/8801700000000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl transition-colors shadow-sm"
              >
                <span>💬</span> WhatsApp Live Chat
              </a>
            </div>
          </div>

          {/* Form & Map Right (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8 w-full">
            <div className="glass-card bg-[#f2f6f3] p-8 md:p-10 rounded-[32px] border border-foreground/5 shadow-lg">
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-4 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl text-primary-green">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold font-serif text-[#1a3020]">Callback Scheduled!</h3>
                  <p className="text-foreground/60 text-sm max-w-sm">
                    Thank you. A landscape architect from your chosen branch will contact you within 2 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="mt-4 text-xs font-semibold text-primary-green hover:underline"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="text-lg font-bold font-serif text-[#1a3020] mb-2">Request callback & estimation audit</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-foreground/75">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Tanvir Ahmed" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-foreground/75">Mobile Number</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+880 17XXXXXXXX" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-foreground/75">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="you@domain.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-foreground/75">Preferred Branch</label>
                      <select 
                        value={branch} 
                        onChange={(e) => setBranch(e.target.value)}
                        className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
                      >
                        <option value="dhaka">Dhaka (Banani Office)</option>
                        <option value="chittagong">Chittagong (GEC Office)</option>
                        <option value="sylhet">Sylhet (Zindabazar Office)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/75">Landscape Service Category</label>
                    <select 
                      value={service} 
                      onChange={(e) => setService(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
                    >
                      <option value="rooftop">Rooftop Garden Setup</option>
                      <option value="vertical">Vertical Wall Greenery</option>
                      <option value="commercial">Commercial Landscaping</option>
                      <option value="residential">Residential Courtyard</option>
                      <option value="consultancy">Landscape Design & Consultation</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/75">Requirements Description</label>
                    <textarea 
                      rows="4" 
                      placeholder="Describe your site space, dimensions, budget tier or guidelines..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1a3020] hover:bg-[#1a3020]/90 text-white font-medium text-[15px] py-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Send Callback Request
                  </button>
                </form>
              )}
            </div>

            {/* Styled Map frame placeholder */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-inner border border-foreground/5 bg-sage-light flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#e3eae4] flex flex-col items-center justify-center text-center p-6 text-foreground/50">
                <span className="text-4xl mb-2">🗺️</span>
                <h4 className="font-bold text-[15px] text-[#1a3020]">Interactive Map Frame</h4>
                <p className="text-xs mt-1 max-w-[280px]">Showing location: House 42, Road 11, Banani, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
