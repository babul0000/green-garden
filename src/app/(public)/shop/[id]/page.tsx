"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { ShopProduct } from "@/types/cms";

const CART_STORAGE_KEY = "gg_shop_cart";

export default function ShopProductDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { language, t } = useLanguage();
  const { txt, config } = useSiteConfig();
  const bn = language === "bn";

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/shop/products?id=${encodeURIComponent(id)}&_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.product) setProduct(data.product);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const current: Array<{ id: string; qty: number }> = raw ? JSON.parse(raw) : [];
      const existing = current.find((i) => i.id === product.id);
      const next = existing
        ? current.map((i) =>
            i.id === product.id ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i
          )
        : [...current, { id: product.id, qty: Math.min(product.stock, qty) }];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      setAdded(true);
    } catch {
      setAdded(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-36 pb-24 px-6 flex items-center justify-center text-stone-500 text-sm">
        {txt("common.loading", "লোড হচ্ছে...", "Loading...")}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-36 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <span className="text-5xl mb-4">🪴</span>
        <h1 className="text-2xl font-serif font-bold text-[#142a1b]">
          {t("পণ্যটি পাওয়া যায়নি", "Product Not Found")}
        </h1>
        <p className="text-stone-500 text-sm mt-2 mb-6">
          {t("এই পণ্যটি স্টকে না থাকতে পারে অথবা সরানো হয়েছে।", "This item may have been removed from our catalog.")}
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
        >
          ← {t("শপে ফিরে যান", "Back to Shop")}
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const badgeText = bn ? product.badgeBn : product.badgeEn;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:underline mb-6"
        >
          ← {t("গ্রিন শপ ক্যাটালগে ফিরে যান", "Back to Green Store")}
        </Link>

        <div className="bg-white border border-stone-200 rounded-[32px] p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl overflow-hidden bg-stone-100 aspect-square">
            <img
              src={product.image || "/hero_plants.png"}
              alt={bn ? product.nameBn : product.nameEn}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800">
                {product.category}
              </span>
              {badgeText && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                  {badgeText}
                </span>
              )}
              <span className="text-xs font-mono text-stone-500 ml-auto">
                {outOfStock
                  ? txt("shop.outOfStock", "স্টক শেষ", "Out of Stock")
                  : `${t("স্টক আছে:", "In Stock:")} ${product.stock} ${bn ? product.unitBn : product.unitEn}`}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#142a1b]">
              {bn ? product.nameBn : product.nameEn}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-emerald-800">
                ৳{product.price.toLocaleString()} BDT
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-base text-stone-400 line-through">
                  ৳{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {bn ? product.descriptionBn : product.descriptionEn}
            </p>

            {(bn ? product.careTipsBn : product.careTipsEn) && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                <strong className="block text-emerald-900">
                  🌱 {t("উদ্ভিদ পরিচর্যা নির্দেশনা", "Horticulture Care Guide")}
                </strong>
                <p>{bn ? product.careTipsBn : product.careTipsEn}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100">
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-sm font-bold text-stone-600 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(Math.max(1, product.stock), q + 1))}
                  className="px-3.5 py-2.5 text-sm font-bold text-stone-600 cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all cursor-pointer"
              >
                {outOfStock
                  ? txt("shop.outOfStock", "স্টক শেষ", "Out of Stock")
                  : txt("shop.addToCart", "ব্যাগে যোগ করুন", "Add to Bag")}
              </button>
            </div>

            {added && (
              <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>✓ {t("ব্যাগে যোগ করা হয়েছে!", "Added to your shopping bag!")}</span>
                <Link href="/shop?cart=open" className="underline text-emerald-950">
                  {t("অর্ডার কনফার্ম করুন ➔", "Open Bag & Checkout ➔")}
                </Link>
              </div>
            )}

            <div className="text-[11px] text-stone-400 pt-2">
              {t("সরাসরি অর্ডারের জন্য কল করুন:", "Direct Nursery Desk:")} {config.site_config.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
