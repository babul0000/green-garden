"use client";

import { useState, useEffect } from "react";

const fetch = (originalFetch => (url, options) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.warn("Backend unavailable, using static fallback for projects:", err);
        setProjects([
          {
            _id: "1",
            name: "Dhanmondi Sky Haven Rooftop",
            client: "Tanvir Rahman",
            category: "Residential",
            imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
            location: "Dhanmondi, Dhaka",
            duration: "3 Weeks",
            budgetRange: "BDT 350,000",
            challenges: "The concrete roof slab had micro-fractures causing moisture dampening in the upper apartment. Load-bearing constraints limited deep soil beds.",
            solution: "Applied 3 layers of elastomeric waterproofing membrane. Used lightweight expanded clay aggregate mixed with organic coco-peat substrate and custom built elevated planter beds.",
            clientTestimonial: { name: "Tanvir Rahman", text: "AR Green Garden turned our damp, dusty roof into a breathtaking orchard.", rating: 5 }
          },
          {
            _id: "2",
            name: "BTI Landmark Facade Vertical Wall",
            client: "BTI Developments",
            category: "Commercial",
            imageUrl: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
            location: "Gulshan, Dhaka",
            duration: "10 Days",
            budgetRange: "BDT 550,000",
            challenges: "Gulshan's heavy direct midday sun heat causes rapid plant dehydration on vertical walls.",
            solution: "Installed geo-textile grow pockets with zone-divided drip emitters connected to a smart timer. Selected sun-hardy plants.",
            clientTestimonial: { name: "Engr. Faruq Hasan (BTI)", text: "A masterpiece of engineering and botany.", rating: 5 }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ["All", "Residential", "Commercial", "Villa"];
  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      {/* Background decorations */}
      <div className="absolute top-24 left-10 w-64 h-64 bg-primary-green/5 rounded-full -z-10 filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-24 right-10 w-96 h-96 bg-sage-pastel/20 rounded-full -z-10 filter blur-3xl opacity-50"></div>

      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-5 animate-fade-in-up">
          <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">Case Studies</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">
            Our Completed <br />
            <span className="text-primary-green italic font-medium">Landscaping Masterpieces</span>
          </h1>
          <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/75 leading-relaxed text-sm">
            Explore our residential rooftops, corporate living green walls, and custom villa garden designs across Bangladesh.
          </p>
        </div>

        {/* Categories Tab */}
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold border transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary-green text-white border-primary-green shadow-md scale-105"
                  : "bg-white text-foreground/70 border-foreground/10 hover:border-primary-green/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-24">
            <span className="w-10 h-10 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div 
                key={proj._id}
                className="bg-white/80 border border-foreground/5 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-60 overflow-hidden bg-sage-pastel/10">
                  <img 
                    src={proj.imageUrl} 
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary-green text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                    {proj.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <span className="text-[11px] text-foreground/45 font-bold uppercase tracking-wider">{proj.location}</span>
                    <h3 className="text-[17px] font-serif font-bold text-[#1a3020] mt-1">{proj.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-[#f8faf9] p-3 rounded-2xl border border-foreground/5 text-xs text-foreground/75">
                    <div>
                      <span className="block text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Duration</span>
                      <span className="font-semibold">{proj.duration || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Budget</span>
                      <span className="font-semibold text-primary-green">{proj.budgetRange || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button 
                    onClick={() => setSelectedProject(proj)}
                    className="w-full bg-[#f4f7f5] hover:bg-primary-green hover:text-white text-[#1a3020] font-bold text-xs py-3 rounded-xl transition-all duration-300 cursor-pointer text-center"
                  >
                    View Project Case Study ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 bg-[#1a3020]/40 backdrop-blur-sm"
          ></div>
          
          <div className="relative bg-white p-6 md:p-8 rounded-[32px] border border-white/60 shadow-2xl max-w-2xl w-full z-10 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-foreground/40 hover:text-foreground p-1 text-lg cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[11px] text-primary-green font-bold uppercase tracking-wider bg-primary-green/10 px-3 py-1 rounded-full">
              {selectedProject.category} Case Study
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a3020] mt-3">{selectedProject.name}</h2>
            <p className="text-xs text-foreground/45 mt-1">{selectedProject.location} • Client: {selectedProject.client || "Confidential"}</p>

            <div className="my-6 rounded-2xl overflow-hidden h-64 md:h-80">
              <img src={selectedProject.imageUrl} className="w-full h-full object-cover" alt={selectedProject.name} />
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-[14px] font-bold uppercase text-foreground/80 tracking-wider">The Challenges</h4>
                <p className="text-xs md:text-sm text-foreground/70 mt-1 leading-relaxed">{selectedProject.challenges || "No challenge detailed."}</p>
              </div>

              <div>
                <h4 className="text-[14px] font-bold uppercase text-foreground/80 tracking-wider">Our Solution</h4>
                <p className="text-xs md:text-sm text-foreground/70 mt-1 leading-relaxed">{selectedProject.solution || "No solution detailed."}</p>
              </div>

              {selectedProject.clientTestimonial?.text && (
                <div className="bg-[#f4f7f5] border-l-4 border-primary-green p-5 rounded-r-2xl">
                  <p className="text-xs md:text-sm italic text-foreground/85">"{selectedProject.clientTestimonial.text}"</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-bold text-[#1a3020]">— {selectedProject.clientTestimonial.name}</span>
                    <span className="text-xs text-yellow-500">{"★".repeat(selectedProject.clientTestimonial.rating || 5)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-foreground/5 pt-5 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
