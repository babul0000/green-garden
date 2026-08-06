import Image from "next/image";

export default function FeaturedSection() {
  return (
    <section id="about" className="py-24 px-6 bg-sage-light/40 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Image Left */}
        <div className="lg:col-span-6 flex justify-center relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-sage-pastel rounded-full -z-10 filter blur-xl opacity-75"></div>
          
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl bg-white p-4 border border-foreground/5">
            <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#e2f0d9]/30">
              <Image 
                src="/featured_plant.png" 
                alt="Featured Plant Detail" 
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Content Right */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <span className="text-[13px] font-semibold tracking-wider text-primary-green uppercase">Featured Plant Styling</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
            A Soft Touch of Nature <br />
            <span className="text-primary-green italic font-medium font-serif">For Modern Interior</span> Spaces
          </h2>
          <p className="text-foreground/75 leading-relaxed">
            Our curated houseplant solutions bring organic shapes and natural textures directly into your modern apartment. Chosen for air-purifying qualities and low-maintenance resilience, each design represents a handpicked sculptural component tailored to elevate your living aesthetic.
          </p>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green font-bold shrink-0 mt-0.5 text-xs">✓</div>
              <div>
                <h4 className="font-semibold text-[15px]">Handpicked Plant Selection</h4>
                <p className="text-sm text-foreground/60">Sourced directly from premium growers for health and vibrant foliage.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green font-bold shrink-0 mt-0.5 text-xs">✓</div>
              <div>
                <h4 className="font-semibold text-[15px]">Tailored Ceramic Pots</h4>
                <p className="text-sm text-foreground/60">Minimalist designer pots matching your interior colors and materials.</p>
              </div>
            </div>
          </div>
          <div>
            <a 
              href="#contact" 
              className="inline-block bg-primary-green hover:bg-primary-green-dark text-white font-medium text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-md"
            >
              Learn More
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
