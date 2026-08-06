"use client";

import { useState } from "react";

const PRODUCTS_DATA = [
  { id: "p1", name: "Monstera Deliciosa (Swiss Cheese Plant)", category: "Live Plants", price: 1200, rating: 5, imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=400&auto=format&fit=crop", desc: "A popular tropical indoor foliage plant with iconic leaf splits. Thrives in indirect indoor light." },
  { id: "p2", name: "Terracotta Clay Pot (Medium)", category: "Designer Pots", price: 350, rating: 4, imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop", desc: "Breathable earthenware pot perfect for root aeration and prevention of moisture logging." },
  { id: "p3", name: "Premium Coco-Peat Soil Bag (5KG)", category: "Botanical Soils", price: 250, rating: 5, imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=400&auto=format&fit=crop", desc: "Lightweight, highly moisture-retentive organic medium mixed with bone meal and vermicompost." },
  { id: "p4", name: "Heavy Duty Pruning Shears", category: "Garden Tools", price: 650, rating: 4, imageUrl: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?q=80&w=400&auto=format&fit=crop", desc: "Ultra-sharp carbon steel bypass clippers for neat tree pruning, branch cutting, and trimming." },
  { id: "p5", name: "Snake Plant (Laurentii)", category: "Live Plants", price: 450, rating: 5, imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a207518?q=80&w=400&auto=format&fit=crop", desc: "Hardy, air-purifying indoor plant that releases oxygen at night. Excellent for bedrooms." },
  { id: "p6", name: "Self-Watering Planter Pot", category: "Designer Pots", price: 480, rating: 4, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop", desc: "Double-walled plastic pot with bottom water reservoir. Keeps plants watered for up to 14 days." }
];

export default function ShopPage() {
  const [products] = useState(PRODUCTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [searchQuery, setSearchQuery] = useState("");

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [paying, setPaying] = useState(false);

  // Zoom product state
  const [viewProduct, setViewProduct] = useState(null);

  // Filters
  const categories = ["All", "Live Plants", "Designer Pots", "Botanical Soils", "Garden Tools"];
  
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchPrice = p.price <= maxPrice;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPrice && matchSearch;
  });

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, amount) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + amount;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setPaying(true);

    // Simulate verification delay
    setTimeout(() => {
      setPaying(false);
      setOrderPlaced({
        id: "ARG-" + Math.floor(100000 + Math.random() * 900000),
        amount: cartSubtotal + 120, // include BDT 120 delivery charge
        address: shippingAddress,
        phone: phoneNumber,
        method: paymentMethod
      });
      setCart([]);
    }, 2500);
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      {/* Banner */}
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex justify-between items-center border-b border-foreground/5 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">E-Commerce Nursery</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3020]">Shop Garden Accessories</h1>
          </div>
          {/* Cart Icon trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-primary-green text-white p-3.5 rounded-full flex items-center justify-center shadow-md hover:bg-primary-green-dark transition-colors cursor-pointer"
          >
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Main layout: Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* Left Column: Filters */}
          <div className="bg-white/80 border border-foreground/5 p-6 rounded-3xl flex flex-col gap-6 shadow-sm">
            <div>
              <h3 className="font-serif font-bold text-[#1a3020] text-sm md:text-base uppercase tracking-wider mb-4">Search</h3>
              <input 
                type="text"
                placeholder="Find plants, soils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-foreground/10 text-foreground py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green text-left"
              />
            </div>

            <div>
              <h3 className="font-serif font-bold text-[#1a3020] text-sm md:text-base uppercase tracking-wider mb-4">Categories</h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-sage-light text-primary-green font-bold"
                        : "text-foreground/70 hover:bg-sage-pastel/15"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-[#1a3020] text-sm md:text-base uppercase tracking-wider mb-4">Max Price</h3>
              <input 
                type="range"
                min="200"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary-green h-1.5 bg-sage-pastel rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-foreground/50 mt-2">
                <span>BDT 200</span>
                <span className="font-bold text-primary-green">BDT {maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/70 border border-foreground/5 rounded-3xl">
                <span className="text-4xl">🔍</span>
                <h3 className="font-serif font-bold text-lg text-foreground/60 mt-3">No products match filters</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map(prod => (
                  <div 
                    key={prod.id}
                    className="bg-white/85 border border-foreground/5 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image */}
                    <div 
                      onClick={() => setViewProduct(prod)}
                      className="relative h-48 bg-sage-pastel/10 overflow-hidden cursor-zoom-in group"
                    >
                      <img src={prod.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={prod.name} />
                      <span className="absolute top-2 left-2 bg-white/95 text-primary-green text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {prod.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-3">
                      <div>
                        <h4 
                          onClick={() => setViewProduct(prod)}
                          className="font-bold text-sm text-[#1a3020] hover:text-primary-green transition-colors cursor-zoom-in line-clamp-1"
                        >
                          {prod.name}
                        </h4>
                        <div className="flex gap-0.5 text-xs text-yellow-500 mt-1">
                          {"★".repeat(prod.rating)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
                        <span className="font-serif font-bold text-[#1a3020] text-sm md:text-base">৳{prod.price}</span>
                        <button
                          onClick={() => addToCart(prod)}
                          className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Zoom Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setViewProduct(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></div>
          <div className="relative bg-white rounded-3xl border border-white/60 p-6 md:p-8 max-w-lg w-full z-10 animate-fade-in-up">
            <button 
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 text-foreground/45 hover:text-foreground text-lg cursor-pointer"
            >
              ✕
            </button>
            <div className="h-60 rounded-2xl overflow-hidden mb-6">
              <img src={viewProduct.imageUrl} className="w-full h-full object-cover" alt={viewProduct.name} />
            </div>
            <span className="text-[10px] text-primary-green font-bold uppercase tracking-wider bg-primary-green/10 px-2.5 py-1 rounded-full">
              {viewProduct.category}
            </span>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1a3020] mt-3">{viewProduct.name}</h3>
            <p className="text-xs md:text-sm text-foreground/70 mt-3 leading-relaxed">{viewProduct.desc}</p>
            <div className="flex justify-between items-center border-t border-foreground/5 pt-5 mt-6">
              <span className="text-xl font-serif font-bold text-[#1a3020]">৳{viewProduct.price} BDT</span>
              <div className="flex gap-3">
                <button
                  onClick={() => { addToCart(viewProduct); setViewProduct(null); }}
                  className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Slider Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          ></div>
          <div className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-white shadow-2xl p-6 flex flex-col justify-between animate-slide-in-right border-l border-foreground/5">
            <div>
              <div className="flex justify-between items-center border-b border-foreground/5 pb-4 mb-6">
                <h3 className="font-serif font-bold text-[#1a3020] text-lg">Your Garden Cart</h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-foreground/45 hover:text-foreground text-xl cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 text-foreground/50">
                  <span className="text-4xl">🛒</span>
                  <p className="text-sm mt-3 font-semibold">Your cart is currently empty</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-1">
                  {cart.map(item => (
                    <div 
                      key={item.id}
                      className="flex gap-4 p-3 bg-sage-light/30 rounded-2xl border border-foreground/5 items-center justify-between"
                    >
                      <img src={item.imageUrl} className="w-14 h-14 rounded-xl object-cover" alt={item.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#1a3020] truncate">{item.name}</h4>
                        <span className="text-[11px] font-bold text-primary-green">৳{item.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-foreground/10 px-2 py-0.5">
                        <button onClick={() => updateQty(item.id, -1)} className="text-xs font-bold text-foreground/50 hover:text-primary-green px-1">-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-xs font-bold text-foreground/50 hover:text-primary-green px-1">+</button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-1"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-foreground/5 pt-6 flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-foreground/60">Cart Subtotal</span>
                  <span className="font-serif font-bold text-[#1a3020]">৳{cartSubtotal} BDT</span>
                </div>
                <div className="flex justify-between text-xs text-foreground/45">
                  <span>Shipping (Dhaka Metro)</span>
                  <span>৳120 BDT</span>
                </div>
                <div className="border-t border-foreground/5 pt-3 flex justify-between text-base font-bold text-[#1a3020]">
                  <span>Total Amount</span>
                  <span>৳{cartSubtotal + 120} BDT</span>
                </div>

                <button
                  onClick={() => { setIsCartOpen(false); setIsCheckingOut(true); }}
                  className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-medium py-3 rounded-xl shadow-md transition-colors text-xs md:text-sm text-center cursor-pointer font-bold"
                >
                  Proceed to Checkout ➔
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Wizard Overlay */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => { if (!paying && !orderPlaced) setIsCheckingOut(false); }}
            className="absolute inset-0 bg-[#1a3020]/40 backdrop-blur-sm"
          ></div>
          <div className="relative bg-white p-6 md:p-8 rounded-[32px] border border-white/60 shadow-2xl max-w-md w-full z-10 animate-fade-in-up">
            
            {!orderPlaced ? (
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-5">
                <div className="text-center mb-4">
                  <span className="text-3xl">💳</span>
                  <h3 className="text-xl font-serif font-bold text-primary-green mt-2">SSLCOMMERZ Checkout</h3>
                  <p className="text-xs text-foreground/50">Enter delivery and billing payment credentials</p>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Delivery Address</label>
                  <textarea 
                    required
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House 12, Road 4, Dhanmondi, Dhaka"
                    className="bg-background border border-foreground/10 text-foreground py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green resize-none"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Contact Phone</label>
                  <input 
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="bg-background border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  />
                </div>

                {/* Gateway Methods */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "bkash", name: "bKash", icon: "🔴" },
                      { id: "nagad", name: "Nagad", icon: "🟠" },
                      { id: "ssl", name: "Card / Net", icon: "💳" }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`py-2 border rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === method.id 
                            ? "border-primary-green bg-sage-light/20 text-primary-green" 
                            : "border-foreground/10 hover:border-primary-green/30"
                        }`}
                      >
                        <span>{method.icon}</span>
                        <span>{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment button */}
                <button
                  type="submit"
                  disabled={paying}
                  className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-medium py-3.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {paying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Verifying Sandbox Payment...</span>
                    </>
                  ) : `Pay BDT ${cartSubtotal + 120}`}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 flex flex-col gap-5 items-center justify-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center text-3xl">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#1a3020]">Order Placed Successfully!</h3>
                  <p className="text-xs text-foreground/50 mt-1">Thank you for shopping at AR Green Garden nursery</p>
                </div>

                <div className="w-full bg-[#f8faf9] border border-foreground/5 rounded-2xl p-4 text-xs text-left flex flex-col gap-2.5">
                  <div className="flex justify-between">
                    <span className="text-foreground/45 uppercase tracking-wider font-bold">Order Tracking ID</span>
                    <span className="font-bold text-[#1a3020]">{orderPlaced.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/45 uppercase tracking-wider font-bold">Total Settled</span>
                    <span className="font-bold text-primary-green">৳{orderPlaced.amount} BDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/45 uppercase tracking-wider font-bold">Paid Via</span>
                    <span className="font-bold uppercase text-primary-green">{orderPlaced.method} Sandbox</span>
                  </div>
                  <div className="flex flex-col border-t border-foreground/5 pt-2">
                    <span className="text-foreground/45 uppercase tracking-wider font-bold mb-0.5">Shipping To</span>
                    <span className="text-foreground/75 leading-relaxed">{orderPlaced.address}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-full bg-[#1a3020] hover:bg-black text-white font-bold text-xs py-3 rounded-xl cursor-pointer transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
