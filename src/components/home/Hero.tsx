import React from "react";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center py-16 px-6 overflow-hidden">
      {/* Soft Background Wave */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-sage-light rounded-l-[100px] md:rounded-l-[200px] -z-10 transform translate-x-12 translate-y-6"></div>
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Hero Content Left */}
        <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8 animate-fade-in-up z-10">
          <div className="inline-flex items-center gap-2 bg-primary-green/10 text-primary-green px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide self-start">
            <span>🌱</span> Bangladesh's #1 Landscaping & Design Partner
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.15]">
            New Design <br />
            <span className="text-primary-green italic font-medium font-serif">Brings Harmony</span> <br />
            Into Your Home
          </h1>
          
          <p className="text-lg text-foreground/75 leading-relaxed max-w-xl">
            Create your serene green sanctuary. We design premium rooftop gardens, elegant vertical green walls, and custom interior landscaping tailored to your modern lifestyle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#contact" 
              className="bg-primary-green hover:bg-primary-green-dark text-white font-medium text-[15px] px-8 py-4 rounded-full transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Free Consultation
            </a>
            <button 
              onClick={() => window.dispatchEvent(new Event("open-estimator"))} 
              className="border border-primary-green-light hover:border-primary-green text-primary-green font-medium text-[15px] px-8 py-4 rounded-full transition-all duration-300 text-center hover:bg-primary-green/5 cursor-pointer"
            >
              Try Cost Estimator
            </button>
          </div>
          
          {/* Trust stats pill */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-foreground/10 max-w-md">
            <div>
              <span className="block text-2xl font-bold font-serif text-primary-green">350+</span>
              <span className="text-xs text-foreground/60">Gardens Built</span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-serif text-primary-green">100%</span>
              <span className="text-xs text-foreground/60">Leak-Proof Trust</span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-serif text-primary-green">9+ Yrs</span>
              <span className="text-xs text-foreground/60">Dhaka Experience</span>
            </div>
          </div>
        </div>

        {/* Hero Image Right */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop" 
              alt="Lush Rooftop Garden Sanctuary in Dhaka"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/40">
              <p className="text-xs font-bold text-primary-green uppercase tracking-wider">Featured Project</p>
              <p className="text-sm font-semibold text-foreground">Banani Luxury Penthouse Terrace Oasis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
