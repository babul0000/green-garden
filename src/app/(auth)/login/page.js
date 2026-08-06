"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await signIn.email({
        email,
        password,
        callbackURL: "/" // redirect to homepage after success
      });

      if (response?.error) {
        setError(response.error.message || "Invalid email or password");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-sage-light/40 px-6 py-12">
      {/* Background shapes */}
      <div className="absolute top-24 right-10 w-48 h-48 bg-sage-pastel rounded-full -z-10 filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-24 left-10 w-64 h-64 bg-primary-green/10 rounded-full -z-10 filter blur-3xl opacity-50"></div>

      <div className="max-w-md w-full glass-card bg-white p-8 md:p-10 rounded-[32px] border border-white/60 shadow-2xl animate-fade-in-up">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-3xl">🔑</span>
          <h1 className="text-2xl font-serif font-bold text-primary-green mt-3">Welcome Back</h1>
          <p className="text-xs text-foreground/50 mt-1.5">Sign in to your green-garden account</p>
        </div>

        {success ? (
          <div className="text-center py-6 flex flex-col gap-4 items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center text-2xl">
              ✓
            </div>
            <h3 className="text-lg font-bold font-serif">Login Successful!</h3>
            <p className="text-xs text-foreground/60 leading-relaxed max-w-[280px]">
              You are being authenticated. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100">
                ⚠️ {error}
              </div>
            )}

            {/* Email Input */}
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

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-foreground/75 uppercase tracking-wider">Password</label>
                <a href="/forgot-password" className="text-[11px] text-primary-green font-semibold hover:underline">
                  Forgot?
                </a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-medium text-[13px] py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : "Sign In"}
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-foreground/50 mt-2">
              Don't have an account?{" "}
              <a href="/register" className="text-primary-green font-semibold hover:underline">
                Create one here
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
