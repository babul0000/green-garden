"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate OTP / Reset email send
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-sage-light/40 px-6 py-12">
      <div className="max-w-md w-full glass-card bg-white p-8 md:p-10 rounded-[32px] border border-white/60 shadow-2xl animate-fade-in-up">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-3xl">🔑</span>
          <h1 className="text-2xl font-serif font-bold text-primary-green mt-3">Reset Password</h1>
          <p className="text-xs text-foreground/50 mt-1.5">Enter your email address to receive a secure recovery code</p>
        </div>

        {success ? (
          <div className="text-center py-6 flex flex-col gap-4 items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center text-2xl">
              ✓
            </div>
            <h3 className="text-lg font-bold font-serif">Recovery Email Sent!</h3>
            <p className="text-xs text-foreground/60 leading-relaxed max-w-[280px]">
              We have dispatched a simulated password recovery OTP link to <b>{email}</b>. Check your inbox and follow instructions.
            </p>
            <a 
              href="/login" 
              className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md mt-4"
            >
              Return to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-foreground/75 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="bg-background border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-medium text-[13px] py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : "Send Reset Code"}
            </button>

            <p className="text-center text-xs text-foreground/50 mt-2">
              Back to{" "}
              <a href="/login" className="text-primary-green font-semibold hover:underline">
                Login page
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
