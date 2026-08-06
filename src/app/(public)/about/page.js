"use client";

export default function AboutPage() {
  const team = [
    { name: "Tanvir Ahmed", role: "Founder & CEO", desc: "12+ years in environmental engineering and landscape design.", icon: "👨‍💼" },
    { name: "Sultana Yasmin", role: "Principal Landscape Architect", desc: "Renowned architect specialized in bio-climatic designs.", icon: "👩‍🎨" },
    { name: "Dr. Rafiqul Islam", role: "Chief Botanist & Agronomist", desc: "Expert in soil health and sub-tropical plant biology.", icon: "👨‍🔬" }
  ];

  const milestones = [
    { year: "2016", title: "Company Founded", desc: "Started as a small consulting firm in Dhanmondi, Dhaka with a mission to bring nature back to urban spaces." },
    { year: "2019", title: "100+ Projects Completed", desc: "Expanded operations to Chittagong and completed major rooftop setups for top real estate developers." },
    { year: "2022", title: "Pioneered Vertical Gardens", desc: "Introduced advanced drip-irrigation green wall panels to corporate offices and luxurious hotels." },
    { year: "2026", title: "Bangladesh's Premier Landscaper", desc: "Ranked as the #1 design agency for sustainable urban landscaping and eco-friendly garden architecture." }
  ];

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-24">
        
        {/* Section 1: Hero Banner */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in-up">
          <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">Our Journey</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">
            We Design Harmonious <br />
            <span className="text-primary-green italic font-medium">Urban Ecosystems</span>
          </h1>
          <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/75 leading-relaxed text-sm md:text-base">
            AR Green Garden is Bangladesh's premier landscape architecture and urban design studio. Since 2016, we have transformed hundreds of concrete rooftops, balconies, and indoor spaces into vibrant, living sanctuaries.
          </p>
        </div>

        {/* Section 2: Story & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="glass-card bg-white/60 border border-foreground/5 rounded-3xl p-8 shadow-md">
            <h3 className="text-xl font-serif font-bold text-[#1a3020] mb-4">Our Story</h3>
            <p className="text-sm text-foreground/75 leading-relaxed">
              It all started with a simple observation: Dhaka's rapid urban growth was cutting off citizens from nature. Determined to make a change, our founders combined botanical sciences with modern architecture to create self-sustaining green solutions. Today, we are a full-service team of designers, engineers, and agronomists crafting premium landscapes that improve both mental wellness and air quality.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#f4f7f5] border border-primary-green/10 rounded-2xl p-6 flex gap-4">
              <span className="text-2xl mt-1">🎯</span>
              <div>
                <h4 className="font-bold text-[15px] text-[#1a3020]">Our Mission</h4>
                <p className="text-xs text-foreground/70 mt-1 leading-relaxed">To integrate natural ecology into modern construction, reducing urban heat islands and building resilient, oxygen-rich environments.</p>
              </div>
            </div>
            <div className="bg-[#f4f7f5] border border-primary-green/10 rounded-2xl p-6 flex gap-4">
              <span className="text-2xl mt-1">👁️</span>
              <div>
                <h4 className="font-bold text-[15px] text-[#1a3020]">Our Vision</h4>
                <p className="text-xs text-foreground/70 mt-1 leading-relaxed">To lead Bangladesh's transition towards green cities where every building features carbon-absorbing rooftops and living vertical walls.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Vertical Timeline */}
        <div className="flex flex-col gap-12">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1a3020]">Company Milestones</h3>
            <p className="text-xs text-foreground/50 mt-1">A timeline of our achievements and milestones over the years</p>
          </div>
          
          <div className="relative border-l-2 border-primary-green/20 ml-4 md:mx-auto max-w-2xl flex flex-col gap-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-8 md:pl-10">
                <span className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#1a3020] border-4 border-white flex items-center justify-center"></span>
                <span className="inline-block bg-[#1a3020] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  {m.year}
                </span>
                <h4 className="text-[17px] font-bold text-foreground font-serif">{m.title}</h4>
                <p className="text-xs md:text-sm text-foreground/70 mt-1.5 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Our Team */}
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1a3020]">Meet Our Leadership</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Our projects succeed thanks to our multidisciplinary team of designers, horticultural specialists, and support crew.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t, idx) => (
              <div key={idx} className="glass-card bg-white/60 border border-foreground/5 rounded-3xl p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-sage-pastel text-primary-green flex items-center justify-center text-3xl mx-auto mb-4 border border-[#1a3020]/10">
                  {t.icon}
                </div>
                <h4 className="font-bold text-[16px] text-[#1a3020]">{t.name}</h4>
                <p className="text-xs text-primary-green font-semibold mt-0.5">{t.role}</p>
                <p className="text-xs text-foreground/60 mt-3 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Call to Action */}
        <div className="bg-[#1a3020] text-white rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-serif font-bold">Ready to Remodel Your Space?</h3>
          <p className="text-xs md:text-sm text-white/70 max-w-lg leading-relaxed">
            Get in touch with our design studio today for a free design audit and estimate callback.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.dispatchEvent(new Event("open-estimator"))} 
              className="bg-white text-[#1a3020] font-bold text-xs md:text-sm px-6 py-3 rounded-full hover:bg-sage-pastel transition-colors cursor-pointer"
            >
              Get Free Estimate
            </button>
            <a 
              href="/contact" 
              className="border border-white/20 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
