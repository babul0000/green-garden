"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_SHOP_CONFIG, ShopConfig, ShopProduct } from "@/types/cms";

interface CartItem {
  id: string;
  qty: number;
}

interface PlacedOrderReceipt {
  orderNumber: string;
  invoiceNumber: string;
  total: number;
  method: string;
  address: string;
}

const CART_STORAGE_KEY = "gg_shop_cart";

export default function ShopPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { txt, getSection } = useSiteConfig();
  const bn = language === "bn";

  // Seed initial state from SiteConfigContext, then refresh live from /api/shop/products
  const contextShop = getSection<ShopConfig>("shop_config", DEFAULT_SHOP_CONFIG);
  const [shopCfg, setShopCfg] = useState<ShopConfig>(contextShop);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<ShopProduct | null>(null);

  // Checkout state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BKASH" | "SSLCOMMERZ">("COD");
  const [transactionRef, setTransactionRef] = useState("");
  const [paying, setPaying] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState<PlacedOrderReceipt | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const loadShop = async () => {
    try {
      const res = await fetch(`/api/shop/products?_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setShopCfg({
          ...DEFAULT_SHOP_CONFIG,
          ...data,
          categories: Array.isArray(data.categories) ? data.categories : DEFAULT_SHOP_CONFIG.categories,
          products: Array.isArray(data.products) ? data.products : DEFAULT_SHOP_CONFIG.products,
        });
      }
    } catch {
      // Fallback to context config
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
    // Restore localStorage cart
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCart(parsed);
      }
      if (typeof window !== "undefined" && window.location.search.includes("cart=open")) {
        setIsCartOpen(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.name || "");
      setCustomerEmail((prev) => prev || user.email || "");
    }
  }, [user]);

  // Select default available payment method
  useEffect(() => {
    if (shopCfg.enableCod) setPaymentMethod((prev) => prev);
    else if (shopCfg.enableBkash) setPaymentMethod("BKASH");
    else if (shopCfg.enableOnlinePayment) setPaymentMethod("SSLCOMMERZ");
  }, [shopCfg.enableCod, shopCfg.enableBkash, shopCfg.enableOnlinePayment]);

  const persistCart = (next: CartItem[]) => {
    setCart(next);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const addToCart = (prod: ShopProduct) => {
    if (prod.stock <= 0) return;
    const existing = cart.find((c) => c.id === prod.id);
    const currentQty = existing ? existing.qty : 0;
    if (currentQty >= prod.stock) {
      setToastMsg(t("সর্বোচ্চ স্টক সীমা পূর্ণ হয়েছে", "Maximum stock limit reached"));
      setTimeout(() => setToastMsg(""), 2500);
      return;
    }
    const next = existing
      ? cart.map((c) => (c.id === prod.id ? { ...c, qty: c.qty + 1 } : c))
      : [...cart, { id: prod.id, qty: 1 }];
    persistCart(next);
    setToastMsg(
      t(`"${prod.nameBn}" ব্যাগে যোগ হয়েছে`, `"${prod.nameEn}" added to bag`)
    );
    setTimeout(() => setToastMsg(""), 2500);
  };

  const updateQty = (id: string, delta: number) => {
    const prod = shopCfg.products.find((p) => p.id === id);
    const maxStock = prod ? prod.stock : 99;
    const next = cart
      .map((item) => {
        if (item.id !== id) return item;
        const targetQty = Math.min(maxStock, item.qty + delta);
        return targetQty > 0 ? { ...item, qty: targetQty } : null;
      })
      .filter(Boolean) as CartItem[];
    persistCart(next);
  };

  const removeFromCart = (id: string) => {
    persistCart(cart.filter((i) => i.id !== id));
  };

  const cartDetails = useMemo(() => {
    return cart
      .map((ci) => {
        const product = shopCfg.products.find((p) => p.id === ci.id);
        return product ? { product, qty: ci.qty } : null;
      })
      .filter(Boolean) as Array<{ product: ShopProduct; qty: number }>;
  }, [cart, shopCfg.products]);

  const cartItemCount = cartDetails.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cartDetails.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const deliveryFee =
    shopCfg.freeShippingMin > 0 && cartSubtotal >= shopCfg.freeShippingMin
      ? 0
      : shopCfg.deliveryCharge;
  const taxAmount =
    shopCfg.taxPercent > 0 ? Math.round((cartSubtotal * shopCfg.taxPercent) / 100) : 0;
  const grandTotal = cartSubtotal + deliveryFee + taxAmount;

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = shopCfg.products.filter((prod) => {
      if (prod.isActive === false) return false;
      const catMatch = selectedCategory === "all" || prod.category === selectedCategory;
      const searchMatch =
        !q ||
        prod.nameEn.toLowerCase().includes(q) ||
        prod.nameBn.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        prod.descriptionEn.toLowerCase().includes(q) ||
        prod.descriptionBn.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [shopCfg.products, selectedCategory, searchQuery, sortBy]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    if (!customerName.trim() || !phoneNumber.trim() || !shippingAddress.trim()) {
      setCheckoutError(
        t("নাম, মোবাইল নম্বর এবং ঠিকানা আবশ্যক।", "Name, phone number, and address are required.")
      );
      return;
    }
    if (paymentMethod === "BKASH" && !transactionRef.trim()) {
      setCheckoutError(
        t("অনুগ্রহ করে বিকাশ TrxID লিখুন।", "Please provide your bKash Transaction ID (TrxID).")
      );
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/shop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: phoneNumber.trim(),
          address: shippingAddress.trim(),
          paymentMethod,
          transactionRef: paymentMethod === "BKASH" ? transactionRef.trim() : "",
          items: cartDetails.map((c) => ({ id: c.product.id, quantity: c.qty })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCheckoutError(
          data.error || t("অর্ডার সম্পন্ন করা যায়নি।", "Order could not be completed.")
        );
        return;
      }

      if (data.gatewayPageURL) {
        persistCart([]);
        window.location.href = data.gatewayPageURL;
        return;
      }

      setOrderPlaced({
        orderNumber: data.orderNumber,
        invoiceNumber: data.invoiceNumber,
        total: data.total ?? grandTotal,
        method: paymentMethod,
        address: shippingAddress.trim(),
      });
      persistCart([]);
      loadShop();
    } catch {
      setCheckoutError(t("নেটওয়ার্ক ত্রুটি, আবার চেষ্টা করুন।", "Network error. Please retry."));
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8 mb-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-800 mb-3">
              {bn ? shopCfg.heroBadgeBn : shopCfg.heroBadgeEn}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#142a1b]">
              {bn ? shopCfg.heroTitleBn : shopCfg.heroTitleEn}
            </h1>
            <p className="text-stone-600 text-sm md:text-base mt-3 leading-relaxed">
              {bn ? shopCfg.heroSubtitleBn : shopCfg.heroSubtitleEn}
            </p>
            {shopCfg.freeShippingMin > 0 && (
              <p className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                🚚 {txt("shop.freeShippingBadge", "ফ্রি হোম ডেলিভারি", "Free Delivery")} (৳
                {shopCfg.freeShippingMin.toLocaleString()}+)
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="self-start md:self-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#142a1b] hover:bg-emerald-900 text-white shadow-md transition-all cursor-pointer"
          >
            <span className="text-lg">🛍️</span>
            <div className="text-left">
              <div className="text-[11px] text-emerald-200 uppercase font-mono">
                {t("আপনার ব্যাগ", "Your Bag")} ({cartItemCount})
              </div>
              <div className="text-sm font-bold">৳{cartSubtotal.toLocaleString()}</div>
            </div>
          </button>
        </div>

        {/* Category Filter + Search + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {shopCfg.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-white border border-stone-200 text-stone-700 hover:border-emerald-500"
                }`}
              >
                {bn ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("গাছ বা পণ্য খুঁজুন...", "Search plants or supplies...")}
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs w-full sm:w-56 focus:outline-none focus:border-emerald-600"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="featured">{t("জনপ্রিয়তা অনুযায়ী", "Featured First")}</option>
              <option value="price-asc">{t("দাম: কম থেকে বেশি", "Price: Low to High")}</option>
              <option value="price-desc">{t("দাম: বেশি থেকে কম", "Price: High to Low")}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 text-stone-500 text-sm">
            {txt("common.loading", "লোড হচ্ছে...", "Loading...")}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl">
            <span className="text-4xl">🌿</span>
            <h3 className="font-serif font-bold text-lg text-stone-600 mt-3">
              {t("কোনো পণ্য পাওয়া যায়নি", "No products match your filter")}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              const outOfStock = prod.stock <= 0;
              const badgeText = bn ? prod.badgeBn : prod.badgeEn;
              return (
                <div
                  key={prod.id}
                  className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div
                      onClick={() => setViewProduct(prod)}
                      className="relative h-56 bg-stone-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={prod.image || "/hero_plants.png"}
                        alt={bn ? prod.nameBn : prod.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 text-emerald-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {prod.category}
                      </span>
                      {badgeText && (
                        <span className="absolute top-3 right-3 bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {badgeText}
                        </span>
                      )}
                      {outOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">
                            {txt("shop.outOfStock", "স্টক শেষ", "Out of Stock")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <Link
                        href={`/shop/${prod.id}`}
                        className="font-bold text-sm text-[#142a1b] hover:text-emerald-700 transition-colors line-clamp-1 block"
                      >
                        {bn ? prod.nameBn : prod.nameEn}
                      </Link>
                      <p className="text-xs text-stone-500 line-clamp-2 min-h-[32px]">
                        {bn ? prod.descriptionBn : prod.descriptionEn}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-amber-500 pt-1">
                        <span>{"★".repeat(Math.round(prod.rating || 5))}</span>
                        <span className="text-stone-400 font-mono">
                          {t("স্টক:", "Stock:")} {prod.stock} {bn ? prod.unitBn : prod.unitEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-serif font-bold text-base text-[#142a1b]">
                        ৳{prod.price.toLocaleString()}
                      </span>
                      {prod.oldPrice && prod.oldPrice > prod.price && (
                        <span className="ml-1.5 text-xs text-stone-400 line-through">
                          ৳{prod.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={outOfStock}
                      onClick={() => addToCart(prod)}
                      className="bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {outOfStock
                        ? txt("shop.outOfStock", "স্টক শেষ", "Out of Stock")
                        : txt("shop.addToCart", "ব্যাগে যোগ করুন", "Add to Bag")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142a1b] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-fade-in-up">
          ✓ {toastMsg}
        </div>
      )}

      {/* Quick View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setViewProduct(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full z-10 shadow-2xl">
            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg cursor-pointer"
            >
              ✕
            </button>
            <div className="h-60 rounded-2xl overflow-hidden mb-5 bg-stone-100">
              <img
                src={viewProduct.image || "/hero_plants.png"}
                className="w-full h-full object-cover"
                alt={bn ? viewProduct.nameBn : viewProduct.nameEn}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-800 font-bold uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
                {viewProduct.category}
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                {t("স্টক:", "In Stock:")} {viewProduct.stock}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#142a1b] mt-3">
              {bn ? viewProduct.nameBn : viewProduct.nameEn}
            </h3>
            <p className="text-xs md:text-sm text-stone-600 mt-2.5 leading-relaxed">
              {bn ? viewProduct.descriptionBn : viewProduct.descriptionEn}
            </p>
            {(bn ? viewProduct.careTipsBn : viewProduct.careTipsEn) && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
                <strong className="block mb-0.5">{t("পরিচর্যা টিপস:", "Care Guide:")}</strong>
                {bn ? viewProduct.careTipsBn : viewProduct.careTipsEn}
              </div>
            )}
            <div className="flex justify-between items-center border-t border-stone-100 pt-5 mt-6 gap-3">
              <span className="text-xl font-serif font-bold text-[#142a1b]">
                ৳{viewProduct.price.toLocaleString()} BDT
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/shop/${viewProduct.id}`}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  {t("বিস্তারিত", "Full Page")}
                </Link>
                <button
                  type="button"
                  disabled={viewProduct.stock <= 0}
                  onClick={() => {
                    addToCart(viewProduct);
                    setViewProduct(null);
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  {txt("shop.addToCart", "ব্যাগে যোগ করুন", "Add to Bag")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-white shadow-2xl p-6 flex flex-col justify-between border-l border-stone-200">
            <div>
              <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-5">
                <h3 className="font-serif font-bold text-[#142a1b] text-lg">
                  {t("আপনার শপিং ব্যাগ", "Your Garden Bag")}
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-stone-400 hover:text-stone-800 text-xl cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {cartDetails.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <span className="text-4xl">🛒</span>
                  <p className="text-sm mt-3 font-semibold">
                    {t("আপনার ব্যাগটি বর্তমানে খালি", "Your bag is currently empty")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[55vh] pr-1">
                  {cartDetails.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/70 items-center justify-between"
                    >
                      <img
                        src={product.image || "/hero_plants.png"}
                        className="w-14 h-14 rounded-xl object-cover"
                        alt={bn ? product.nameBn : product.nameEn}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#142a1b] truncate">
                          {bn ? product.nameBn : product.nameEn}
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-700">
                          ৳{product.price.toLocaleString()} × {qty}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, -1)}
                          className="text-xs font-bold text-stone-500 hover:text-emerald-700 px-1 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, 1)}
                          className="text-xs font-bold text-stone-500 hover:text-emerald-700 px-1 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1 cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartDetails.length > 0 && (
              <div className="border-t border-stone-100 pt-5 flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">{t("সাবটোটাল", "Subtotal")}</span>
                  <span className="font-bold text-[#142a1b]">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>{t("ডেলিভারি চার্জ", "Delivery Charge")}</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">
                        {txt("shop.freeShippingBadge", "ফ্রি", "FREE")}
                      </span>
                    ) : (
                      `৳${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                {taxAmount > 0 && (
                  <div className="flex justify-between text-stone-500">
                    <span>
                      {t("ভ্যাট", "Tax")} ({shopCfg.taxPercent}%)
                    </span>
                    <span>৳{taxAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-[#142a1b]">
                  <span>{t("সর্বমোট", "Total Amount")}</span>
                  <span>৳{grandTotal.toLocaleString()} BDT</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOrderPlaced(null);
                    setCheckoutError("");
                    setIsCartOpen(false);
                    setIsCheckingOut(true);
                  }}
                  className="mt-2 w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-xl shadow-md transition-colors text-xs md:text-sm text-center cursor-pointer font-bold"
                >
                  {txt("shop.checkoutBtn", "অর্ডার কনফার্ম করুন", "Proceed to Checkout")} ➔
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real Database Checkout Overlay */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              if (!paying) setIsCheckingOut(false);
            }}
            className="absolute inset-0 bg-[#142a1b]/50 backdrop-blur-sm"
          />
          <div className="relative bg-white p-6 md:p-8 rounded-[32px] border border-stone-200 shadow-2xl max-w-md w-full z-10 max-h-[90vh] overflow-y-auto">
            {!orderPlaced ? (
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-1">
                  <span className="text-3xl">🌿</span>
                  <h3 className="text-xl font-serif font-bold text-[#142a1b] mt-1">
                    {t("ডেলিভারি ও পেমেন্ট তথ্য", "Delivery & Payment")}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {t(
                      "অর্ডার সম্পন্ন হলে সরাসরি স্টুডিও ড্যাশবোর্ডে সংরক্ষিত হবে।",
                      "Your order creates an official studio invoice & delivery tracking record."
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                    {t("পূর্ণ নাম *", "Full Name *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t("আপনার নাম", "Your Name")}
                    className="w-full bg-stone-50 border border-stone-200 py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                      {t("মোবাইল নম্বর *", "Phone Number *")}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-stone-50 border border-stone-200 py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                      {t("ইমেইল (ঐচ্ছিক)", "Email (Optional)")}
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-stone-50 border border-stone-200 py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                    {t("ডেলিভারি ঠিকানা *", "Delivery Address *")}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder={t(
                      "বাড়ি নং, রোড, এলাকা ও শহর",
                      "House 12, Road 4, Dhanmondi, Dhaka"
                    )}
                    className="w-full bg-stone-50 border border-stone-200 py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-700 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1.5">
                    {t("পেমেন্ট মাধ্যম", "Payment Method")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {shopCfg.enableCod && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("COD")}
                        className={`py-2.5 px-2 border rounded-xl text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                          paymentMethod === "COD"
                            ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                            : "border-stone-200 text-stone-600"
                        }`}
                      >
                        <span>🚚</span>
                        <span>{t("ক্যাশ অন ডেলিভারি", "Cash on Delivery")}</span>
                      </button>
                    )}
                    {shopCfg.enableBkash && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("BKASH")}
                        className={`py-2.5 px-2 border rounded-xl text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                          paymentMethod === "BKASH"
                            ? "border-pink-600 bg-pink-50 text-pink-900"
                            : "border-stone-200 text-stone-600"
                        }`}
                      >
                        <span>📱</span>
                        <span>{t("বিকাশ", "bKash")}</span>
                      </button>
                    )}
                    {shopCfg.enableOnlinePayment && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("SSLCOMMERZ")}
                        className={`py-2.5 px-2 border rounded-xl text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                          paymentMethod === "SSLCOMMERZ"
                            ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                            : "border-stone-200 text-stone-600"
                        }`}
                      >
                        <span>💳</span>
                        <span>{t("কার্ড / SSL", "Card / Online")}</span>
                      </button>
                    )}
                  </div>
                </div>

                {paymentMethod === "BKASH" && (
                  <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 space-y-2 text-xs">
                    <p className="text-pink-900 font-semibold">
                      {t("বিকাশ পেমেন্ট নম্বর:", "Send Money / Payment bKash:")}{" "}
                      <span className="font-mono font-bold">{shopCfg.bkashNumber}</span>
                    </p>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder={t("বিকাশ TrxID লিখুন *", "Enter bKash TrxID *")}
                      className="w-full bg-white border border-pink-300 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                )}

                {checkoutError && (
                  <p className="text-xs text-rose-600 font-bold text-center">{checkoutError}</p>
                )}

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-1 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {paying
                    ? t("প্রক্রিয়া চলছে...", "Processing Order...")
                    : `${txt("shop.checkoutBtn", "অর্ডার কনফার্ম করুন", "Confirm Order")} (৳${grandTotal.toLocaleString()})`}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 flex flex-col gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#142a1b]">
                    {t("অর্ডার সফলভাবে গৃহীত হয়েছে!", "Order Placed Successfully!")}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {t(
                      "এ আর গ্রিন গার্ডেন থেকে কেনাকাটার জন্য ধন্যবাদ",
                      "Thank you for shopping at A R Green Garden"
                    )}
                  </p>
                </div>

                <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-left flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-bold uppercase">Order No</span>
                    <span className="font-mono font-bold text-[#142a1b]">
                      {orderPlaced.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-bold uppercase">Invoice No</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {orderPlaced.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-bold uppercase">Total Amount</span>
                    <span className="font-bold text-emerald-800">
                      ৳{orderPlaced.total.toLocaleString()} BDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-bold uppercase">Payment</span>
                    <span className="font-bold uppercase">{orderPlaced.method}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-2">
                    <span className="text-stone-400 font-bold uppercase block mb-0.5">
                      Shipping To
                    </span>
                    <span className="text-stone-700">{orderPlaced.address}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-full bg-[#142a1b] hover:bg-black text-white font-bold text-xs py-3 rounded-xl cursor-pointer"
                >
                  {t("শপিং চালিয়ে যান", "Continue Shopping")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
