export default function Gallery() {
  const images = [
    { label: "Rooftop Garden Setup", icon: "🏢" },
    { label: "Modern Indoor Styling", icon: "🪴" },
    { label: "Vertical Moss Walls", icon: "🍃" },
    { label: "Minimalist Balcony Plants", icon: "🌸" },
    { label: "Corporate Office Greenery", icon: "💼" },
    { label: "Lawn Grass Landscape", icon: "🏡" }
  ];

  return (
    <section id="gallery" className="py-24 px-6 bg-sage-light/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-[13px] font-semibold tracking-wider text-primary-green uppercase">Our Works</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Inspiration Gallery</h2>
          <div className="w-16 h-1 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/70 text-sm">
            Take a look at some of our award-winning interior styling and rooftop gardens in Dhaka city.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <div 
              key={idx} 
              className="relative aspect-video rounded-2xl overflow-hidden glass-card group cursor-pointer border border-foreground/5"
            >
              {/* Overlay styling for placeholders */}
              <div className="absolute inset-0 bg-[#e3eae4] group-hover:bg-[#d0dfd2] transition-colors duration-500 flex items-center justify-center text-4xl">
                {item.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-green-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-6 left-6 text-white z-10">
                <span className="text-xs text-sage-pastel font-medium tracking-wide uppercase">Project {idx + 1}</span>
                <h4 className="text-[17px] font-bold font-serif mt-1">{item.label}</h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
