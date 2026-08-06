"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PRODUCTS_DATA = [
  { id: "p1", name: "Monstera Deliciosa (Swiss Cheese Plant)", category: "Live Plants", price: 1200, rating: 5, imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=400&auto=format&fit=crop", desc: "A popular tropical indoor foliage plant with iconic leaf splits. Thrives in indirect indoor light." },
  { id: "p2", name: "Terracotta Clay Pot (Medium)", category: "Designer Pots", price: 350, rating: 4, imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop", desc: "Breathable earthenware pot perfect for root aeration and prevention of moisture logging." },
  { id: "p3", name: "Premium Coco-Peat Soil Bag (5KG)", category: "Botanical Soils", price: 250, rating: 5, imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=400&auto=format&fit=crop", desc: "Lightweight, highly moisture-retentive organic medium mixed with bone meal and vermicompost." },
  { id: "p4", name: "Heavy Duty Pruning Shears", category: "Garden Tools", price: 650, rating: 4, imageUrl: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?q=80&w=400&auto=format&fit=crop", desc: "Ultra-sharp carbon steel bypass clippers for neat tree pruning, branch cutting, and trimming." },
  { id: "p5", name: "Snake Plant (Laurentii)", category: "Live Plants", price: 450, rating: 5, imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a207518?q=80&w=400&auto=format&fit=crop", desc: "Hardy, air-purifying indoor plant that releases oxygen at night. Excellent for bedrooms." },
  { id: "p6", name: "Self-Watering Planter Pot", category: "Designer Pots", price: 480, rating: 4, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop", desc: "Double-walled plastic pot with bottom water reservoir. Keeps plants watered for up to 14 days." }
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const matched = PRODUCTS_DATA.find(p => p.id === id);
    if (matched) {
      setProduct(matched);
    }
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart by dispatching a custom event or writing to localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cartItems.push({ ...product, qty });
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-8 h-8 border-3 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in-up">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="text-xs font-bold text-[#1a3020] hover:text-primary-green transition-all text-left"
        >
          ← Back to Shop
        </button>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-md bg-sage-pastel/10">
            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs text-primary-green font-bold uppercase tracking-wider bg-primary-green/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1a3020] mt-3">{product.name}</h1>
              <div className="flex gap-0.5 text-xs text-yellow-500 mt-2">
                {"★".repeat(product.rating)}
              </div>
            </div>

            <p className="text-xs md:text-sm text-foreground/75 leading-relaxed">{product.desc}</p>
            
            <div className="font-serif font-bold text-xl md:text-2xl text-[#1a3020]">৳{product.price} BDT</div>

            {/* Qty Selector & Add */}
            <div className="flex gap-4 items-center border-t border-foreground/5 pt-5">
              <div className="flex items-center gap-3 bg-white rounded-xl border border-foreground/10 px-4 py-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="font-bold text-foreground/50 hover:text-primary-green text-sm">-</button>
                <span className="font-bold w-6 text-center text-xs">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="font-bold text-foreground/50 hover:text-primary-green text-sm">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
