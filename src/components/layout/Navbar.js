"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar({ onOpenEstimator }) {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mobile sub-menus state
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePackagesOpen, setMobilePackagesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1a3020] border-b border-white/5 w-full transition-all duration-300 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-6 bg-white rounded-full"></span>
            A R Green Garden
          </span>
        </a>

        {/* Desktop Nav Links (Pill-shaped with dropdowns matching baganbariltd.com) */}
        <nav className="hidden md:flex items-center gap-5 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/5 shadow-inner">
          
          {/* Home */}
          <a href="/" className="text-white/80 hover:text-white transition-colors text-[14px] font-semibold px-2">Home</a>
          
          {/* About Us (Dropdown) */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown("about")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="text-white/80 hover:text-white transition-colors text-[14px] font-semibold px-2 py-1 flex items-center gap-1 focus:outline-none cursor-pointer">
              About Us
              <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "about" && (
              <div className="absolute left-0 mt-2 w-52 bg-white text-foreground rounded-2xl shadow-xl border border-foreground/5 py-2.5 z-50 animate-fade-in-up">
                <a href="/about" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Our Story</a>
                <a href="/about#mission" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Mission & Vision</a>
                <a href="/about#directors" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Board of Directors</a>
                <a href="/about#clients" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Our Clients</a>
              </div>
            )}
          </div>

          {/* Portfolio */}
          <a href="/gallery" className="text-white/80 hover:text-white transition-colors text-[14px] font-semibold px-2">Our Portfolio</a>

          {/* Services (Dropdown) */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown("services")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="text-white/80 hover:text-white transition-colors text-[14px] font-semibold px-2 py-1 flex items-center gap-1 focus:outline-none cursor-pointer">
              Services
              <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "services" && (
              <div className="absolute left-0 mt-2 w-60 bg-white text-foreground rounded-2xl shadow-xl border border-foreground/5 py-2.5 z-50 animate-fade-in-up max-h-[350px] overflow-y-auto custom-scrollbar">
                <a href="/services#design" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Landscape Design</a>
                <a href="/services#consultancy" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Landscape Consultancy</a>
                <a href="/services#commercial" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Commercial Landscape</a>
                <a href="/services#residential" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Residential Landscape</a>
                <a href="/services#rooftop" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Rooftop Gardening</a>
                <a href="/services#vertical" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Vertical Garden</a>
                <a href="/services#maintenance" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Garden Maintenance</a>
                <a href="/services#hardscaping" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Hardscaping</a>
                <a href="/services#lighting" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Garden Lighting</a>
                <a href="/services#irrigation" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Drip Irrigation</a>
                <a href="/services#fountain" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Water Fountain</a>
                <a href="/services#pool" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Swimming Pool</a>
              </div>
            )}
          </div>

          {/* Packages (Dropdown) */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown("packages")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="text-white/80 hover:text-white transition-colors text-[14px] font-semibold px-2 py-1 flex items-center gap-1 focus:outline-none cursor-pointer">
              Packages
              <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "packages" && (
              <div className="absolute left-0 mt-2 w-64 bg-white text-foreground rounded-2xl shadow-xl border border-foreground/5 py-2.5 z-50 animate-fade-in-up">
                <a href="/services#packages" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Garden Maintenance Service</a>
                <a href="/services#packages-rooftop" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Rooftop Gardening Package</a>
                <a href="/services#packages-terrace" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Terrace & Verandah Package</a>
                <a href="/services#packages-corporate" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Corporate Gardening Package</a>
                <a href="/services#packages-gifts" className="block px-4 py-2 text-xs md:text-sm hover:bg-sage-light transition-colors font-medium text-foreground/80 hover:text-primary-green">Gifts</a>
              </div>
            )}
          </div>

          {/* Blog */}
          <a href="/blog" className="text-white/80 hover:text-white transition-colors text-[14px] font-semibold px-2">Blog</a>

          {/* Contact */}
          <a href="/contact" className="text-white/80 hover:text-white transition-colors text-[14px] font-semibold px-2">Contact Us</a>
        </nav>

        {/* Right Side Tools & Auth Pill */}
        <div className="hidden md:flex items-center gap-5">
          {/* Shopping Cart Icon with Yellow Badge */}
          <div className="relative text-white cursor-pointer hover:text-white/80 p-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 text-[#1a3020] rounded-full text-[9px] font-extrabold flex items-center justify-center border border-[#1a3020]">
              0
            </span>
          </div>

          {/* Better-Auth Dynamic Account Pill */}
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-full py-1.5 pl-2 pr-4 flex items-center gap-2 cursor-pointer transition-all focus:outline-none"
              >
                <div className="w-7 h-7 bg-sage-pastel text-[#1a3020] rounded-full flex items-center justify-center font-bold text-xs uppercase font-sans">
                  {session.user.name[0]}
                </div>
                <span className="text-[14px] font-medium text-white select-none">
                  {session.user.name.split(" ")[0]}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-foreground/5 py-2 z-50 text-foreground animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-foreground/5 text-left">
                    <p className="text-xs text-foreground/50">Signed in as</p>
                    <p className="text-sm font-semibold text-foreground truncate">{session.user.email}</p>
                  </div>
                  <a 
                    href={session.user.role === "admin" ? "/admin" : "/client-dashboard"}
                    onClick={() => setUserDropdownOpen(false)}
                    className="block text-left px-4 py-2.5 text-sm hover:bg-sage-light transition-colors font-medium text-primary-green"
                  >
                    Dashboard
                  </a>
                  <button 
                    onClick={async () => {
                      setUserDropdownOpen(false);
                      await signOut({ callbackURL: "/" });
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-full py-1.5 px-4 flex items-center gap-3 transition-all text-white text-[14px] font-semibold">
              <a href="/login" className="hover:text-white/80 transition-colors">
                Login
              </a>
              <span className="w-[1px] h-3 bg-white/20"></span>
              <a href="/register" className="hover:text-white/80 transition-colors">
                Register
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown (Supporting collapsible dropdown accordions) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a3020] absolute top-20 left-0 w-full px-6 py-6 flex flex-col gap-4 border-t border-white/5 shadow-lg text-white max-h-[calc(100vh-80px)] overflow-y-auto">
          
          {/* Home */}
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[16px] font-medium border-b border-white/5 hover:text-white/80 transition-colors">Home</a>
          
          {/* About Us Collapsible */}
          <div className="flex flex-col border-b border-white/5">
            <button 
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="py-2 text-[16px] font-medium hover:text-white/80 transition-colors flex items-center justify-between w-full"
            >
              <span>About Us</span>
              <span>{mobileAboutOpen ? "−" : "+"}</span>
            </button>
            {mobileAboutOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-2 text-sm text-white/70">
                <a href="/about" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Our Story</a>
                <a href="/about#mission" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Mission & Vision</a>
                <a href="/about#directors" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Board of Directors</a>
                <a href="/about#clients" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Our Clients</a>
              </div>
            )}
          </div>

          {/* Portfolio */}
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[16px] font-medium border-b border-white/5 hover:text-white/80 transition-colors">Our Portfolio</a>

          {/* Services Collapsible */}
          <div className="flex flex-col border-b border-white/5">
            <button 
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="py-2 text-[16px] font-medium hover:text-white/80 transition-colors flex items-center justify-between w-full"
            >
              <span>Services</span>
              <span>{mobileServicesOpen ? "−" : "+"}</span>
            </button>
            {mobileServicesOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-2 text-sm text-white/70 max-h-[200px] overflow-y-auto custom-scrollbar">
                <a href="/services#design" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Landscape Design</a>
                <a href="/services#consultancy" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Landscape Consultancy</a>
                <a href="/services#commercial" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Commercial Landscape</a>
                <a href="/services#residential" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Residential Landscape</a>
                <a href="/services#rooftop" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Rooftop Gardening</a>
                <a href="/services#vertical" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Vertical Garden</a>
                <a href="/services#maintenance" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Garden Maintenance</a>
                <a href="/services#hardscaping" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Hardscaping</a>
                <a href="/services#lighting" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Garden Lighting</a>
                <a href="/services#irrigation" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Drip Irrigation</a>
                <a href="/services#fountain" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Water Fountain</a>
                <a href="/services#pool" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Swimming Pool</a>
              </div>
            )}
          </div>

          {/* Packages Collapsible */}
          <div className="flex flex-col border-b border-white/5">
            <button 
              onClick={() => setMobilePackagesOpen(!mobilePackagesOpen)}
              className="py-2 text-[16px] font-medium hover:text-white/80 transition-colors flex items-center justify-between w-full"
            >
              <span>Packages</span>
              <span>{mobilePackagesOpen ? "−" : "+"}</span>
            </button>
            {mobilePackagesOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-2 text-sm text-white/70">
                <a href="/services#packages" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Garden Maintenance Service</a>
                <a href="/services#packages-rooftop" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Rooftop Gardening Package</a>
                <a href="/services#packages-terrace" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Terrace & Verandah Package</a>
                <a href="/services#packages-corporate" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Corporate Gardening Package</a>
                <a href="/services#packages-gifts" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-white">Gifts</a>
              </div>
            )}
          </div>

          {/* Blog */}
          <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[16px] font-medium border-b border-white/5 hover:text-white/80 transition-colors">Blog</a>

          {/* Contact */}
          <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[16px] font-medium hover:text-white/80 transition-colors">Contact Us</a>
          
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenEstimator(); }}
              className="w-full text-center border border-white/20 text-white hover:bg-white/5 py-3 rounded-full text-[15px] font-medium transition-all"
            >
              Cost Calculator
            </button>
            
            {session ? (
              <div className="flex flex-col gap-2">
                <span className="text-center text-[14px] text-white/60 font-medium py-1">
                  Hi, {session.user.name} ({session.user.role})
                </span>
                <a 
                  href={session.user.role === "admin" ? "/admin" : "/client-dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-white/20 text-white py-3.5 rounded-full text-[15px] font-semibold transition-all"
                >
                  Dashboard
                </a>
                <button 
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await signOut({ callbackURL: "/" });
                  }}
                  className="w-full text-center bg-red-600/20 text-red-400 py-3.5 rounded-full text-[15px] font-semibold hover:bg-red-600/30 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <a 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-white/20 text-white py-3.5 rounded-full text-[15px] font-semibold transition-all"
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-white text-[#1a3020] py-3.5 rounded-full text-[15px] font-semibold hover:bg-white/90 transition-all"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
