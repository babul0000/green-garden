export default function Footer() {
  return (
    <footer className="bg-primary-green-dark text-white/90 py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Logo & Info */}
        <div className="flex flex-col gap-4">
          <span className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-1.5">
            <span className="inline-block w-2 h-5 bg-sage-pastel rounded-full"></span>
            A R Green Garden
          </span>
          <p className="text-xs text-white/60 leading-relaxed">
            World-class landscaping, garden design, and interior plant styling in Bangladesh. Creating breathing spaces since 2016.
          </p>
          <p className="text-xs text-white/40 mt-4">
            © 2026 A R Green Garden. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-sm text-white font-serif uppercase tracking-wider">Quick Links</h4>
          <div className="flex flex-col gap-2 text-xs text-white/70">
            <a href="#" className="hover:text-white transition-colors">Home Page</a>
            <a href="#services" className="hover:text-white transition-colors">Our Services</a>
            <a href="#about" className="hover:text-white transition-colors">About Story</a>
            <a href="#gallery" className="hover:text-white transition-colors">Portfolio Gallery</a>
          </div>
        </div>

        {/* Plant Services */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-sm text-white font-serif uppercase tracking-wider">Services</h4>
          <div className="flex flex-col gap-2 text-xs text-white/70">
            <a href="#services" className="hover:text-white transition-colors">Rooftop Garden Setup</a>
            <a href="#services" className="hover:text-white transition-colors">Vertical Plant Wall</a>
            <a href="#services" className="hover:text-white transition-colors">Indoor Houseplant Styling</a>
            <a href="#services" className="hover:text-white transition-colors">Lawn Landscaping</a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-sm text-white font-serif uppercase tracking-wider">Newsletter</h4>
          <p className="text-xs text-white/60 leading-relaxed">
            Subscribe to get tips on taking care of plants and our project updates.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mt-2">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="bg-white/10 text-white border border-white/10 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-white w-full"
            />
            <button type="submit" className="bg-white text-primary-green-dark px-3 py-2 text-xs font-bold rounded-lg hover:bg-sage-pastel transition-colors">
              Join
            </button>
          </form>
        </div>

      </div>
    </footer>
  );
}
