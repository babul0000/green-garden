import Image from "next/image";

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
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-foreground/5">
            <div>
              <p className="text-3xl font-serif font-bold text-primary-green">500+</p>
              <p className="text-[13px] text-foreground/60 font-medium">Projects Done</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-primary-green">450+</p>
              <p className="text-[13px] text-foreground/60 font-medium">Happy Clients</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-primary-green">10+</p>
              <p className="text-[13px] text-foreground/60 font-medium">Years Active</p>
            </div>
          </div>
        </div>

        {/* Hero Image Right */}
        <div className="lg:col-span-6 flex justify-center items-center relative animate-fade-in-up animation-delay-200">
          {/* Pedestals & plants design wrapper */}
          <div className="relative w-full max-w-[500px] aspect-square lg:max-w-none lg:aspect-[1.1] rounded-3xl overflow-hidden glass-card shadow-2xl border border-white/60 p-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-tr from-sage-pastel to-white/40">
              <Image 
                src="/hero_plants.png" 
                alt="Premium indoor plant composition in white pots on soft green pedestals" 
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
