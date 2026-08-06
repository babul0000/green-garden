"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const fetch = (originalFetch => (url, options) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments State
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${slug}`);
      if (res.ok) {
        setBlog(await res.json());
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      console.warn("Backend unavailable, using static fallback for blog detail:", err);
      setBlog({
        _id: "b1",
        title: "5 Essential Tips for Rooftop Gardening in Dhaka",
        slug: "5-tips-rooftop-gardening-dhaka",
        author: "Tanvir Ahmed",
        coverImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
        category: "Rooftop Gardening",
        content: "<p>Rooftop gardening is becoming highly popular in Dhaka due to rapid urbanization. However, maintaining a garden on concrete requires specific knowledge to prevent building damage and ensure plant health.</p><h4>1. Multi-Layer Waterproofing</h4><p>Ensure your concrete roof slab is sealed with high-quality elastomeric waterproofing layers before installing soil. Leaks can damage reinforcement bars and lead to building hazards.</p><h4>2. Choose Lightweight Substrates</h4><p>Avoid using pure red clay or garden soil. It gets extremely heavy when wet. Use a mixture of cocopeat, vermicompost, and expanded clay aggregate to reduce weight load by up to 50%.</p><h4>3. Install Smart Drip Systems</h4><p>Dhaka summers are brutal. Manual watering is often insufficient. An automated drip-irrigation grid saves water and ensures regular watering even when you are out of town.</p>",
        readingTime: "4 mins",
        createdAt: new Date().toISOString(),
        comments: [
          { _id: "c1", name: "Rafiq Chowdhury", text: "Very informative article! The lightweight soil advice is a lifesaver.", createdAt: new Date().toISOString() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentName || !commentText) return;
    setSubmitting(true);

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blog._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: commentName, text: commentText })
      });
      if (res.ok) {
        setCommentName("");
        setCommentText("");
        fetchBlogDetails();
      } else {
        throw new Error("Failed to post");
      }
    } catch (err) {
      console.warn("Backend fail, updating comment mock locally:", err);
      setBlog(prev => ({
        ...prev,
        comments: [
          ...prev.comments,
          {
            _id: "temp-" + Date.now(),
            name: commentName,
            text: commentText,
            createdAt: new Date().toISOString()
          }
        ]
      }));
      setCommentName("");
      setCommentText("");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-8 h-8 border-3 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in-up">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="text-xs font-bold text-[#1a3020] hover:text-primary-green transition-all text-left"
        >
          ← Back to Articles
        </button>

        {/* Title details */}
        <div>
          <span className="text-xs text-primary-green font-bold uppercase tracking-wider bg-primary-green/10 px-3 py-1 rounded-full">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3020] mt-4 leading-tight">
            {blog.title}
          </h1>
          <div className="flex gap-4 text-xs text-foreground/50 mt-4 border-b border-foreground/5 pb-4">
            <span>✍ By <b>{blog.author}</b></span>
            <span>⏱ {blog.readingTime} Read</span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Cover */}
        <div className="h-64 md:h-96 rounded-3xl overflow-hidden shadow-md">
          <img src={blog.coverImage} className="w-full h-full object-cover" alt={blog.title} />
        </div>

        {/* HTML Contents */}
        <div 
          className="prose prose-sm md:prose-base text-foreground/80 leading-relaxed flex flex-col gap-4 font-sans text-xs md:text-sm"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>

        {/* Comments section */}
        <div className="flex flex-col gap-6 mt-8 border-t border-foreground/5 pt-8">
          <h3 className="text-lg font-serif font-bold text-[#1a3020]">Comments ({blog.comments?.length || 0})</h3>
          
          <div className="flex flex-col gap-4">
            {blog.comments?.map(comm => (
              <div key={comm._id} className="bg-sage-light/20 border border-foreground/5 rounded-2xl p-4 flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1a3020]">{comm.name}</span>
                  <span className="text-[10px] text-foreground/45">{new Date(comm.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-foreground/75 mt-1">{comm.text}</p>
              </div>
            ))}
          </div>

          {/* Post Form */}
          <form onSubmit={handlePostComment} className="flex flex-col gap-4 border-t border-foreground/5 pt-6 mt-4">
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
              placeholder="Write comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer w-fit"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
