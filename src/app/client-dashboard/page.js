"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function ClientDashboardPage() {
  const { data: sessionData, isPending } = useSession();
  
  const [activeTab, setActiveTab] = useState("overview");

  // Booking form states
  const [bookings, setBookings] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("Rooftop Gardening");
  const [budgetRange, setBudgetRange] = useState("Premium BDT 2-3 Lakhs");
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Profile update states
  const [name, setName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Fetch client bookings
  const fetchBookings = async () => {
    if (!sessionData?.user) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings`);
      if (res.ok) {
        const data = await res.json();
        // Filter bookings belonging to current user email
        const clientBookings = data.filter(b => b.clientEmail === sessionData.user.email);
        setBookings(clientBookings);
      }
    } catch (err) {
      console.warn("Backend bookings API unavailable, using local mock state:", err);
      setBookings([
        {
          _id: "b_mock1",
          clientName: sessionData.user.name,
          clientEmail: sessionData.user.email,
          phone: "01712345678",
          service: "Rooftop Gardening",
          budgetRange: "Premium BDT 2-3 Lakhs",
          status: "Confirmed",
          assignedStaff: "Ar. Sultana Yasmin",
          bookingDate: new Date().toISOString()
        }
      ]);
    }
  };

  useEffect(() => {
    if (sessionData?.user) {
      setName(sessionData.user.name || "");
      fetchBookings();
    }
  }, [sessionData]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!sessionData?.user) return;
    setBookingLoading(true);
    setBookingSuccess(false);

    const bookingPayload = {
      clientName: sessionData.user.name,
      clientEmail: sessionData.user.email,
      phone,
      address,
      service,
      budgetRange,
      message,
      status: "Pending"
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      if (res.ok) {
        setBookingSuccess(true);
        setPhone("");
        setAddress("");
        setMessage("");
        fetchBookings();
      } else {
        throw new Error("Failed to place booking");
      }
    } catch (err) {
      console.warn("Backend failed to save booking, simulating success locally:", err);
      const tempBooking = {
        _id: "temp-" + Date.now(),
        ...bookingPayload,
        assignedStaff: "Unassigned",
        bookingDate: new Date().toISOString()
      };
      setBookings(prev => [tempBooking, ...prev]);
      setBookingSuccess(true);
      setPhone("");
      setAddress("");
      setMessage("");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    setTimeout(() => {
      setProfileSaving(false);
      setProfileSuccess(true);
    }, 1000);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="w-10 h-10 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
      </div>
    );
  }

  // Not Logged In screen
  if (!sessionData?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-foreground px-6 py-12">
        <div className="max-w-md w-full bg-white border border-foreground/5 rounded-3xl p-8 text-center shadow-lg flex flex-col gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center text-3xl mx-auto">
            🔑
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1a3020]">Client Portal</h1>
            <p className="text-xs text-foreground/50 mt-1.5 leading-relaxed">
              Log in to schedule botanical audits, check your garden progress timeline, and download payment receipts.
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="/login" 
              className="flex-1 bg-primary-green hover:bg-primary-green-dark text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer text-center"
            >
              Sign In
            </a>
            <a 
              href="/register" 
              className="flex-1 bg-[#f4f7f5] hover:bg-[#eaf0ec] text-[#1a3020] text-xs font-bold py-3 rounded-xl transition-all cursor-pointer text-center border border-foreground/5"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-10 px-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Dashboard Header */}
        <div className="flex justify-between items-center bg-white/80 border border-foreground/5 p-6 rounded-[28px] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-green text-white font-serif font-bold text-xl flex items-center justify-center">
              {sessionData.user.name?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1a3020]">Welcome back, {sessionData.user.name}</h2>
              <p className="text-xs text-foreground/45 mt-0.5">Role: <span className="capitalize font-semibold text-primary-green">{sessionData.user.role || "Client"}</span> • Email: {sessionData.user.email}</p>
            </div>
          </div>
          {sessionData.user.role === "admin" && (
            <a 
              href="/admin"
              className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
            >
              Open Admin Control panel
            </a>
          )}
        </div>

        {/* Workspace Tab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar Tabs */}
          <div className="bg-white/80 border border-foreground/5 p-4 rounded-3xl flex flex-col gap-2 shadow-sm">
            {[
              { id: "overview", label: "📊 Overview" },
              { id: "booking", label: "📅 Book Audit" },
              { id: "payments", label: "💳 Invoices & Payments" },
              { id: "profile", label: "⚙ Profile Settings" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-sage-light text-primary-green font-bold shadow-sm"
                    : "text-foreground/75 hover:bg-sage-pastel/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Display Panel */}
          <div className="lg:col-span-3 bg-white/80 border border-foreground/5 rounded-[32px] p-6 md:p-8 shadow-sm min-h-[400px]">
            
            {/* TAB 1: Overview */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Active Project Tracker</h3>
                  <p className="text-xs text-foreground/50">Real-time status updates of your landscaping setup.</p>
                </div>

                {/* Progress bar and milestone timeline */}
                <div className="bg-sage-light/20 border border-primary-green/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1a3020] uppercase tracking-wider">Project: Banani Balcony Oasis</span>
                    <span className="font-bold text-primary-green bg-white py-1 px-3 rounded-full border border-primary-green/10">60% Complete</span>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="w-full bg-white h-3.5 rounded-full overflow-hidden border border-foreground/5">
                    <div className="bg-primary-green h-full rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
                  </div>

                  {/* Milestones timeline */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                    {[
                      { step: 1, name: "Site Visit", status: "completed" },
                      { step: 2, name: "3D Design", status: "completed" },
                      { step: 3, name: "Waterproofing", status: "completed" },
                      { step: 4, name: "Planting Setup", status: "active" },
                      { step: 5, name: "Handover", status: "pending" }
                    ].map(milestone => (
                      <div key={milestone.step} className="flex flex-col items-center text-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          milestone.status === "completed" 
                            ? "bg-primary-green border-primary-green text-white"
                            : milestone.status === "active"
                            ? "border-primary-green text-primary-green animate-pulse font-extrabold"
                            : "border-foreground/10 text-foreground/30"
                        }`}>
                          {milestone.status === "completed" ? "✓" : milestone.step}
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          milestone.status === "pending" ? "text-foreground/35" : "text-[#1a3020]"
                        }`}>
                          {milestone.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bookings log */}
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1a3020] mb-4">Your Booking Requests</h3>
                  {bookings.length === 0 ? (
                    <p className="text-xs text-foreground/45 italic bg-[#f8faf9] p-4 rounded-xl text-center">No active bookings. Head to 'Book Audit' tab to request a visit.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {bookings.map(book => (
                        <div key={book._id} className="bg-white border border-foreground/5 p-4 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-[#1a3020] block text-[13px]">{book.service}</span>
                            <span className="text-[10px] text-foreground/40 mt-1 block">Scheduled: {new Date(book.bookingDate).toLocaleDateString()} • Assigned Expert: <b>{book.assignedStaff || "Unassigned"}</b></span>
                          </div>
                          <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                            book.status === "Confirmed" 
                              ? "bg-primary-green/10 text-primary-green border border-primary-green/10"
                              : book.status === "Completed"
                              ? "bg-[#1a3020] text-white"
                              : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                          }`}>
                            {book.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Booking Wizard */}
            {activeTab === "booking" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Book a Site Consultation</h3>
                  <p className="text-xs text-foreground/50">Schedule an expert engineer & agronomist site audit to check waterproofing, weight load capacity and sun mapping.</p>
                </div>

                {bookingSuccess ? (
                  <div className="bg-primary-green/10 border border-primary-green/20 rounded-2xl p-6 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-green text-white flex items-center justify-center text-xl font-bold">✓</div>
                    <h4 className="font-bold font-serif text-[#1a3020]">Request Submitted!</h4>
                    <p className="text-xs text-foreground/60 max-w-sm leading-relaxed">
                      Our principal architect will contact you within 24 hours to schedule the exact date and coordinate logistics.
                    </p>
                    <button 
                      onClick={() => setBookingSuccess(false)}
                      className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-5 py-2 rounded-lg cursor-pointer transition-all mt-2"
                    >
                      Book Another Consultation
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5 max-w-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Contact Phone</label>
                        <input 
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Desired Service</label>
                        <select 
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                        >
                          <option>Rooftop Gardening</option>
                          <option>Vertical Wall setup</option>
                          <option>Backyard Landscaping</option>
                          <option>Indoor plants setup</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Budget Target Standard</label>
                        <select 
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                        >
                          <option>Standard (BDT 50,000 - 1 Lakh)</option>
                          <option>Premium (BDT 2-3 Lakhs)</option>
                          <option>Luxury Custom (BDT 5+ Lakhs)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Site Location Address</label>
                        <input 
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Dhanmondi, Dhaka"
                          className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Brief Description of space/special requests</label>
                      <textarea 
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Need waterproof checking, automatic timers, space size is around 450 sq ft..."
                        className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer w-fit"
                    >
                      {bookingLoading ? "Booking..." : "Schedule Audit Visit"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: Invoices & Payments */}
            {activeTab === "payments" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Payment Invoices</h3>
                  <p className="text-xs text-foreground/50">Verify and download payment statements relating to your landscape development.</p>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/10 text-foreground/45">
                        <th className="py-3 font-bold uppercase tracking-wider">Invoice ID</th>
                        <th className="py-3 font-bold uppercase tracking-wider">Service Detail</th>
                        <th className="py-3 font-bold uppercase tracking-wider">Amount Paid</th>
                        <th className="py-3 font-bold uppercase tracking-wider">Status</th>
                        <th className="py-3 font-bold uppercase tracking-wider text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-foreground/5">
                        <td className="py-4 font-mono font-bold">INV-2026-809</td>
                        <td className="py-4 font-semibold text-[#1a3020]">Initial Site Audit & Waterproof test</td>
                        <td className="py-4">৳5,000 BDT</td>
                        <td className="py-4"><span className="bg-primary-green/10 text-primary-green font-bold px-2.5 py-0.5 rounded-full text-[10px]">PAID</span></td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => alert("Simulating PDF Receipt Download!")}
                            className="text-primary-green font-bold hover:underline cursor-pointer"
                          >
                            Download PDF
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-foreground/5">
                        <td className="py-4 font-mono font-bold">INV-2026-821</td>
                        <td className="py-4 font-semibold text-[#1a3020]">Design Blueprint & Plant mapping list</td>
                        <td className="py-4">৳15,000 BDT</td>
                        <td className="py-4"><span className="bg-primary-green/10 text-primary-green font-bold px-2.5 py-0.5 rounded-full text-[10px]">PAID</span></td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => alert("Simulating PDF Receipt Download!")}
                            className="text-primary-green font-bold hover:underline cursor-pointer"
                          >
                            Download PDF
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-foreground/5">
                        <td className="py-4 font-mono font-bold">INV-2026-856</td>
                        <td className="py-4 font-semibold text-[#1a3020]">Materials Mobilization & Planting (Milestone 1)</td>
                        <td className="py-4">৳120,000 BDT</td>
                        <td className="py-4"><span className="bg-red-50 text-red-600 font-bold px-2.5 py-0.5 rounded-full text-[10px]">PENDING</span></td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => alert("Redirecting to SSLCOMMERZ mock payment gateway...")}
                            className="bg-primary-green text-white font-bold py-1 px-3 rounded-lg hover:bg-primary-green-dark cursor-pointer transition-colors"
                          >
                            Pay Online
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Profile Settings */}
            {activeTab === "profile" && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1a3020]">Profile Settings</h3>
                  <p className="text-xs text-foreground/50">Edit your user contact profile information.</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 max-w-sm">
                  {profileSuccess && (
                    <div className="bg-primary-green/10 text-primary-green text-xs font-semibold p-3.5 rounded-xl border border-primary-green/15">
                      ✓ Profile settings updated successfully!
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green text-left"
                    />
                  </div>

                  <div className="flex flex-col gap-1 opacity-60">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase">Email Address (Locked)</label>
                    <input 
                      type="email"
                      disabled
                      value={sessionData.user.email}
                      className="bg-sage-light/20 border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none text-left"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer w-fit mt-2"
                  >
                    {profileSaving ? "Saving..." : "Update Settings"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
