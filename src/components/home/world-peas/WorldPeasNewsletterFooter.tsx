"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function WorldPeasNewsletterFooter() {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState<string[]>([
    "Sales and promotions",
  ]);
  const [submitted, setSubmitted] = useState(false);

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <footer className="w-full bg-white text-black pt-16 sm:pt-24 pb-16 select-none font-sans">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-8">
        {/* ================= TOP DIVIDER ================= */}
        <hr className="border-t border-black mb-14 sm:mb-20" />

        {/* ================= NEWSLETTER SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start mb-20 sm:mb-28">
          {/* Left Title: Farm Fresh Email Newsletter */}
          <div className="md:col-span-6 lg:col-span-7">
            <h2
              className="text-4xl sm:text-5xl md:text-[48px] leading-[1.1] font-light text-black tracking-tight"
              style={{ fontFamily: "Newsreader, Georgia, serif" }}
            >
              Farm Fresh
              <br />
              Email Newsletter
            </h2>
          </div>

          {/* Right Form: Input, Preferences & Submit */}
          <div className="md:col-span-6 lg:col-span-5 w-full max-w-[380px] md:ml-auto">
            {submitted ? (
              <div className="p-6 bg-stone-100 rounded-2xl border border-black/10 text-center">
                <p
                  className="text-2xl font-light mb-2"
                  style={{ fontFamily: "Newsreader, Georgia, serif" }}
                >
                  Thank you for subscribing!
                </p>
                <p className="text-sm text-neutral-600">
                  You'll be the first to receive harvest updates and news.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email text input */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3.5 bg-transparent border border-black rounded-lg text-[17px] placeholder:text-[#707070] text-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Email preferences */}
                <div className="space-y-3">
                  <p className="text-base text-black font-normal">
                    Email me about
                  </p>
                  <div className="space-y-2.5">
                    {[
                      "Sales and promotions",
                      "Harvests",
                      "Articles and recipes",
                    ].map((pref) => {
                      const isChecked = preferences.includes(pref);
                      return (
                        <label
                          key={pref}
                          className="flex items-center gap-3 cursor-pointer group text-[17px] text-black"
                        >
                          <div
                            onClick={() => togglePreference(pref)}
                            className="w-5 h-5 rounded-full border border-black flex items-center justify-center transition-colors group-hover:border-black/70"
                          >
                            {isChecked && (
                              <div className="w-3 h-3 rounded-full bg-black" />
                            )}
                          </div>
                          <span>{pref}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button: Sign me up (00) [envelope] */}
                <button
                  type="submit"
                  className="w-full h-12 bg-black text-white hover:bg-neutral-800 rounded-full flex items-center justify-between px-6 transition-all duration-200 text-[17px] font-medium"
                >
                  <span className="w-3 h-3 rounded-full bg-white opacity-90 inline-block" />
                  <span>Sign me up</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm opacity-90">(00)</span>
                    <svg
                      className="w-5 h-5 fill-none stroke-current"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ================= SECOND DIVIDER ================= */}
        <hr className="border-t border-black mb-12 sm:mb-16" />

        {/* ================= FOOTER LINKS & BRAND ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-start">
          {/* Logo & Address */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block text-3xl sm:text-4xl font-light tracking-tight text-black hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Newsreader, Georgia, serif" }}
            >
              World Peas
            </Link>
            <address className="not-italic text-[17px] text-black leading-relaxed">
              5555 Produce Lane
              <br />
              Gardentown, CA 51512
            </address>
          </div>

          {/* Links Columns (4 columns on desktop, 2 columns on mobile) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-[17px] text-black">
            {/* Column 1 */}
            <div className="flex flex-col space-y-2.5">
              <Link href="/" className="hover:text-black/70 transition-colors">
                Shop
              </Link>
              <Link
                href="#about"
                className="hover:text-black/70 transition-colors"
              >
                Who we are
              </Link>
              <Link
                href="#newsstand"
                className="hover:text-black/70 transition-colors"
              >
                Newsstand
              </Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-2.5">
              <Link
                href="/client-dashboard"
                className="hover:text-black/70 transition-colors"
              >
                My profile
              </Link>
              <Link
                href="/cart"
                className="hover:text-black/70 transition-colors"
              >
                My basket
              </Link>
              <Link
                href="/client-dashboard/preferences"
                className="hover:text-black/70 transition-colors"
              >
                My preferences
              </Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col space-y-2.5">
              <Link
                href="#contact"
                className="hover:text-black/70 transition-colors"
              >
                Contact us
              </Link>
              <Link
                href="#about"
                className="hover:text-black/70 transition-colors"
              >
                Our values
              </Link>
              <Link
                href="#accessibility"
                className="hover:text-black/70 transition-colors"
              >
                Accessibility
              </Link>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col space-y-2.5">
              <Link
                href="#privacy"
                className="hover:text-black/70 transition-colors"
              >
                Privacy policy
              </Link>
              <Link
                href="#sitemap"
                className="hover:text-black/70 transition-colors"
              >
                Site map
              </Link>
              <Link
                href="#terms"
                className="hover:text-black/70 transition-colors"
              >
                Terms and conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
