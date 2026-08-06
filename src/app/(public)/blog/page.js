"use client";

import { useState, useEffect } from "react";

const fetch = (originalFetch => (url, options) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBlog, setActiveBlog] = useState(null);

  // New Comment Form states
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      console.warn("Backend unavailable, using static fallback for blogs:", err);
      setBlogs([
        {
          _id: "b1",
          title: "5 Essential Tips for Rooftop Gardening in Dhaka",
          slug: "5-tips-rooftop-gardening-dhaka",
          author: "Tanvir Ahmed",
          coverImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
          category: "Rooftop Gardening",
          content: "<p>Rooftop gardening is becoming highly popular in Dhaka due to rapid urbanization. However, maintaining a garden on concrete requires specific knowledge to prevent building damage and ensure plant health.</p><h4>1. Multi-Layer Waterproofing</h4><p>Ensure your concrete roof slab is sealed with high-quality elastomeric waterproofing layers before installing soil. Leaks can damage reinforcement bars and lead to building hazards.</p><h4>2. Choose Lightweight Substrates</h4><p>Avoid using pure red clay or garden soil. It gets extremely heavy when wet. Use a mixture of cocopeat, vermicompost, and expanded clay aggregate to reduce weight load by up to 50%.</p><h4>3. Install Smart Drip Systems</h4><p>Dhaka summers are brutal. Manual watering is often insufficient. An automated drip-irrigation grid saves water and ensures regular watering even when you are out of town.</p>",
          readingTime: "4 mins",
          createdAt: "2026-08-01T12:00:00.000Z",
          comments: [
            { _id: "c1", name: "Rafiq Chowdhury", text: "Very informative article! The lightweight soil advice is a lifesaver. I was worried about my roof weight limit.", createdAt: "2026-08-02T10:00:00.000Z" }
          ]
        },
        {
          _id: "b2",
          title: "How to Build a Self-Sustaining Vertical Wall Garden",
          slug: "build-self-sustaining-vertical-wall",
          author: "Sultana Yasmin",
          coverImage: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=800&auto=format&fit=crop",
          category: "Vertical Garden",
          content: "<p>Vertical gardens are the ultimate green space solution for small spaces. Let's look at how to construct one that requires minimal manual upkeep.</p><h4>1. Frame Assembly</h4><p>Mount a rust-proof aluminum frame with a PVC board backing on the wall. This leaves an air gap of 1 inch between the wall and the garden, preventing moisture transfer.</p><h4>2. Felt Pockets</h4><p>Attach two layers of felt pockets to the backing. It does not decay and allows water to distribute evenly while giving plant roots room to grow.</p>",
          readingTime: "6 mins",
          createdAt: "2026-07-28T09:00:00.000Z",
          comments: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentName || !commentText || !activeBlog) return;
    setCommentSubmitting(true);

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${activeBlog._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: commentName, text: commentText })
      });
      if (res.ok) {
        // Reload blog post with new comment
        const updatedBlog = await res.json();
        setActiveBlog(updatedBlog);
        setCommentName("");
        setCommentText("");
        fetchBlogs(); // refresh list
      } else {
        throw new Error("Comment post failed");
      }
    } catch (err) {
      console.warn("Backend comment submission failed, simulating local comment adding:", err);
      const simulatedComment = {
        _id: "temp-" + Date.now(),
        name: commentName,
        text: commentText,
        createdAt: new Date().toISOString()
      };
      
      const updatedBlog = {
        ...activeBlog,
        comments: [...activeBlog.comments, simulatedComment]
      };
      setActiveBlog(updatedBlog);
      setCommentName("");
      setCommentText("");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
  };

  const categories = ["All", "Rooftop Gardening", "Vertical Garden", "Plant Care"];
  const filteredBlogs = blogs.filter(b => {
    const matchCategory = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Header (Hide when reading details) */}
        {!activeBlog && (
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-5 animate-fade-in-up">
            <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">Garden Blog</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">
              Botanical Insights & <br />
              <span className="text-primary-green italic font-medium">Urban Gardening Guides</span>
            </h1>
            <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded"></div>
            <p className="text-foreground/75 leading-relaxed text-sm">
              Discover professional tips on waterproofing roofs, automated watering lines, and choosing subtropical plants.
            </p>
          </div>
        )}

        {activeBlog ? (
          /* Detailed Blog Reading Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start animate-fade-in-up">
            
            {/* Left Content Area (Col Span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-8 bg-white p-6 md:p-8 border border-foreground/5 rounded-[32px] shadow-sm">
              <button 
                onClick={() => setActiveBlog(null)}
                className="text-xs font-bold text-[#1a3020] hover:text-primary-green transition-colors cursor-pointer w-fit"
              >
                ← Back to Articles Directory
              </button>

              <div>
                <span className="text-xs text-primary-green font-bold uppercase tracking-wider bg-primary-green/10 px-3 py-1 rounded-full">
                  {activeBlog.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3020] mt-4 leading-tight">
                  {activeBlog.title}
                </h1>
                <div className="flex gap-4 text-xs text-foreground/50 mt-4 border-b border-foreground/5 pb-4">
                  <span>✍ By <b>{activeBlog.author}</b></span>
                  <span>⏱ {activeBlog.readingTime || "5 mins"} Read</span>
                  <span>📅 {new Date(activeBlog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="h-64 md:h-96 rounded-2xl overflow-hidden shadow-md">
                <img src={activeBlog.coverImage} className="w-full h-full object-cover" alt={activeBlog.title} />
              </div>

              {/* Blog Content */}
              <div 
                className="prose prose-sm md:prose-base text-foreground/80 leading-relaxed flex flex-col gap-4 font-sans text-xs md:text-sm"
                dangerouslySetInnerHTML={{ __html: activeBlog.content }}
              ></div>

              {/* Social Share Buttons */}
              <div className="border-t border-b border-foreground/5 py-4 my-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-foreground/50 tracking-wider">Share This Guide:</span>
                <div className="flex gap-2">
                  {["Facebook", "Twitter", "LinkedIn", "WhatsApp"].map(social => (
                    <button
                      key={social}
                      onClick={() => alert(`Simulating sharing to ${social}!`)}
                      className="px-3 py-1.5 bg-[#f4f7f5] hover:bg-primary-green hover:text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-[#1a3020]"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Section */}
              <div className="flex flex-col gap-6 mt-4">
                <h3 className="text-lg font-serif font-bold text-[#1a3020]">Comments ({activeBlog.comments?.length || 0})</h3>
                
                {/* Comments List */}
                <div className="flex flex-col gap-4">
                  {activeBlog.comments?.length === 0 ? (
                    <p className="text-xs text-foreground/40 italic">No comments posted yet. Be the first to share your thoughts!</p>
                  ) : (
                    activeBlog.comments.map((comm) => (
                      <div key={comm._id} className="bg-sage-light/20 border border-foreground/5 rounded-2xl p-4 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#1a3020]">{comm.name}</span>
                          <span className="text-[10px] text-foreground/45">
                            {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : "Just now"}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/75 leading-relaxed">{comm.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Form */}
                <form onSubmit={handlePostComment} className="border-t border-foreground/5 pt-6 flex flex-col gap-4 mt-4">
                  <h4 className="font-serif font-bold text-sm text-[#1a3020]">Write a Comment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                    />
                  </div>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Enter your comment text..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green resize-none"
                  />
                  <button
                    type="submit"
                    disabled={commentSubmitting}
                    className="bg-primary-green hover:bg-primary-green-dark text-white font-medium text-xs px-6 py-3 rounded-xl shadow-md transition-colors cursor-pointer w-fit"
                  >
                    {commentSubmitting ? "Submitting..." : "Submit Comment"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side Bar */}
            <div className="flex flex-col gap-8">
              {/* Popular articles */}
              <div className="bg-white/80 border border-foreground/5 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#1a3020] border-b border-foreground/5 pb-2">Recent Guides</h3>
                <div className="flex flex-col gap-4">
                  {blogs.filter(b => b._id !== activeBlog._id).slice(0, 3).map(rec => (
                    <div 
                      key={rec._id}
                      onClick={() => { setActiveBlog(rec); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="flex gap-3 items-center cursor-pointer group"
                    >
                      <img src={rec.coverImage} className="w-12 h-12 rounded-lg object-cover" alt={rec.title} />
                      <div className="min-w-0">
                        <h4 className="font-bold text-[11px] md:text-xs text-[#1a3020] group-hover:text-primary-green transition-colors truncate">{rec.title}</h4>
                        <span className="text-[10px] text-foreground/45">{rec.readingTime} Read</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Directory List View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
            
            {/* Left Filters */}
            <div className="bg-white/80 border border-foreground/5 p-6 rounded-3xl flex flex-col gap-6 shadow-sm">
              <div>
                <h3 className="font-serif font-bold text-[#1a3020] text-xs uppercase tracking-wider mb-3">Search Posts</h3>
                <input 
                  type="text"
                  placeholder="Waterproofing, soils..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs focus:outline-none focus:border-primary-green"
                />
              </div>

              <div>
                <h3 className="font-serif font-bold text-[#1a3020] text-xs uppercase tracking-wider mb-3">Topic Filter</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? "bg-sage-light text-primary-green font-bold"
                          : "text-foreground/70 hover:bg-sage-pastel/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Articles Grid */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              {loading ? (
                <div className="flex justify-center py-20">
                  <span className="w-8 h-8 border-3 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-20 bg-white/70 border border-foreground/5 rounded-3xl">
                  <span className="text-3xl">📝</span>
                  <h3 className="font-serif font-bold text-lg text-foreground/50 mt-3">No matching articles found</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredBlogs.map(blog => (
                    <div 
                      key={blog._id}
                      className="bg-white/80 border border-foreground/5 rounded-[28px] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img src={blog.coverImage} className="w-full h-full object-cover" alt={blog.title} />
                        <span className="absolute top-3 left-3 bg-white/95 text-primary-green text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {blog.category}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2 text-[10px] text-foreground/45 uppercase font-bold tracking-wider">
                            <span>{blog.readingTime} read</span>
                            <span>•</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-base font-serif font-bold text-[#1a3020] hover:text-primary-green cursor-pointer line-clamp-2" onClick={() => setActiveBlog(blog)}>
                            {blog.title}
                          </h3>
                          <div className="text-xs text-foreground/60 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                        </div>

                        <button
                          onClick={() => setActiveBlog(blog)}
                          className="text-primary-green font-bold text-xs flex items-center gap-1 hover:translate-x-1.5 transition-all mt-2 cursor-pointer"
                        >
                          Read Guide Details ➔
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="bg-[#1a3020] text-white rounded-[32px] p-8 text-center flex flex-col items-center gap-4 mt-8 shadow-md">
                <span className="text-2xl">📬</span>
                <h3 className="text-xl md:text-2xl font-serif font-bold">Subscribe to Green Garden Digest</h3>
                <p className="text-xs text-white/60 max-w-md leading-relaxed">
                  Join 2,500+ urban gardeners in Dhaka. Receive monthly botanical maps, watering tips, and discount shop alerts.
                </p>

                {newsletterSubscribed ? (
                  <div className="bg-white/10 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/20">
                    ✓ Subscribed! Thank you for joining our ecosystem.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full max-w-sm mt-2">
                    <input 
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-white text-foreground placeholder-foreground/45 border-0 focus:outline-none rounded-xl py-3 px-4 text-xs flex-1 text-left"
                    />
                    <button
                      type="submit"
                      className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
