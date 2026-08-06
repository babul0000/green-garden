export default function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-[13px] font-semibold tracking-wider text-primary-green uppercase">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Premium Services Portfolio</h2>
          <div className="w-16 h-1 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/70 text-sm md:text-base">
            Providing end-to-end design, construction, and maintenance for residential and corporate green projects.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Service 1 */}
          <div className="glass-card hover:bg-white rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group border border-foreground/5">
            <div className="w-14 h-14 bg-sage-pastel text-primary-green rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-green group-hover:text-white transition-colors duration-300">
              🏢
            </div>
            <h3 className="text-xl font-bold font-serif">Rooftop Garden</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Transform concrete slabs into lush sky sanctuaries. We handle load tests, soil chemistry, drainage cells, auto-irrigation, and structural wind protection.
            </p>
            <a href="#contact" className="text-primary-green font-semibold text-sm group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5 self-start mt-2">
              Get Quote <span>→</span>
            </a>
          </div>

          {/* Service 2 */}
          <div className="glass-card hover:bg-white rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group border border-foreground/5">
            <div className="w-14 h-14 bg-sage-pastel text-primary-green rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-green group-hover:text-white transition-colors duration-300">
              🍃
            </div>
            <h3 className="text-xl font-bold font-serif">Vertical Green Wall</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              High-density structural plant walls for indoors or facades. Features micro-drippers, custom growth mediums, and species matching ambient lighting profiles.
            </p>
            <a href="#contact" className="text-primary-green font-semibold text-sm group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5 self-start mt-2">
              Get Quote <span>→</span>
            </a>
          </div>

          {/* Service 3 */}
          <div className="glass-card hover:bg-white rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group border border-foreground/5">
            <div className="w-14 h-14 bg-sage-pastel text-primary-green rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-green group-hover:text-white transition-colors duration-300">
              🪴
            </div>
            <h3 className="text-xl font-bold font-serif">Indoor Plant Styling</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Architectural plant design for living rooms, luxury hotels, and corporate offices. Designed dynamically around light, airflow, and spatial layout.
            </p>
            <a href="#contact" className="text-primary-green font-semibold text-sm group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5 self-start mt-2">
              Get Quote <span>→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
