"use client";

import React, { useEffect, useState } from "react";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import { StandaloneToast } from "@/components/shared/Toast";
import { emitSettingsSync } from "@/context/SiteConfigContext";
import { DEFAULT_SHOP_CONFIG, ShopConfig, ShopProduct } from "@/types/cms";
import { BilingualInput, StudioHeader } from "./AdminStudioPrimitives";

interface ShopOrderRow {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  phone: string;
  address: string;
  status: string;
  paymentStatus: string;
  total: number;
  paymentMethod: string;
  transactionRef?: string;
  items: Array<{ nameBn?: string; nameEn?: string; quantity: number; lineTotal: number }>;
  createdAt: string;
}

const EMPTY_PRODUCT: Omit<ShopProduct, "id"> = {
  nameBn: "",
  nameEn: "",
  category: "Indoor Plants",
  price: 1200,
  oldPrice: undefined,
  stock: 15,
  unitBn: "টি",
  unitEn: "Plant",
  image: "/hero_plants.png",
  badgeBn: "",
  badgeEn: "",
  rating: 5,
  descriptionBn: "",
  descriptionEn: "",
  careTipsBn: "",
  careTipsEn: "",
  isFeatured: false,
  isActive: true,
};

export default function ShopStudioTab() {
  const [sub, setSub] = useState<"products" | "orders" | "settings">("products");
  const [config, setConfig] = useState<ShopConfig>(DEFAULT_SHOP_CONFIG);
  const [orders, setOrders] = useState<ShopOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<ShopProduct, "id">>(EMPTY_PRODUCT);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch(`/api/shop/products?all=true&_t=${Date.now()}`, { cache: "no-store" }),
        fetch(`/api/shop/orders?_t=${Date.now()}`, { cache: "no-store" }),
      ]);
      if (prodRes.ok) {
        const data = await prodRes.json();
        setConfig((p) => ({ ...p, ...data }));
      }
      if (ordRes.ok) {
        const data = await ordRes.json();
        if (Array.isArray(data.orders)) setOrders(data.orders);
      }
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const saveShopConfig = async (nextConfig: ShopConfig = config) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "shop_config", value: nextConfig }),
      });
      if (res.ok) {
        setConfig(nextConfig);
        emitSettingsSync("shop-config-updated");
        showToast("✅ শপ স্টুডিও সেভ হয়েছে!");
      } else {
        showToast("❌ সেভ ব্যর্থ হয়েছে।");
      }
    } catch {
      showToast("❌ নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSaving(false);
    }
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.nameBn && !draft.nameEn) return;

    const newItem: ShopProduct = {
      ...draft,
      id:
        editingId ||
        `${(draft.nameEn || draft.nameBn || "item")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
    };

    const nextProducts = editingId
      ? config.products.map((p) => (p.id === editingId ? newItem : p))
      : [newItem, ...config.products];

    const updated = { ...config, products: nextProducts };
    await saveShopConfig(updated);
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY_PRODUCT);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("পণ্যটি স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    const updated = { ...config, products: config.products.filter((p) => p.id !== id) };
    await saveShopConfig(updated);
  };

  const updateOrderStatus = async (id: string, status: string, paymentStatus?: string) => {
    const res = await fetch("/api/shop/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, paymentStatus }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status, ...(paymentStatus ? { paymentStatus } : {}) } : o
        )
      );
      showToast("✅ অর্ডার স্ট্যাটাস আপডেট হয়েছে!");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("এই অর্ডার রেকর্ড ডিলিট করবেন?")) return;
    const res = await fetch(`/api/shop/orders?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showToast("🗑️ অর্ডার ডিলিট হয়েছে।");
    }
  };

  return (
    <div className="space-y-6">
      <StudioHeader
        icon="🛒"
        title="গ্রিন শপ ও ই-কমার্স স্টুডিও (Shop Studio)"
        subtitle="পণ্য যোগ/এডিট/ডিলিট, ডেলিভারি চার্জ, পেমেন্ট অপশন এবং লাইভ শপ অর্ডার পরিচালনা করুন।"
        saving={saving}
        onSave={() => saveShopConfig(config)}
        extraActions={
          sub === "products" ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraft(EMPTY_PRODUCT);
                setShowForm((p) => !p);
              }}
              className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {showForm ? "✕ বন্ধ করুন" : "+ নতুন পণ্য যোগ করুন"}
            </button>
          ) : null
        }
      />

      {/* Sub Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "products", label: `🪴 পণ্য তালিকা (${config.products.length})` },
          { id: "orders", label: `📦 অর্ডার ম্যানেজমেন্ট (${orders.length})` },
          { id: "settings", label: "🚚 ডেলিভারি, হিরো ও পেমেন্ট" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSub(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sub === tab.id
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB 1: PRODUCTS */}
      {sub === "products" && (
        <div className="space-y-5">
          {showForm && (
            <form
              onSubmit={submitProduct}
              className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4"
            >
              <h3 className="font-bold text-stone-800 text-sm">
                {editingId ? "✏️ পণ্যের তথ্য পরিবর্তন করুন" : "➕ নতুন শপ পণ্য যুক্ত করুন"}
              </h3>

              <BilingualInput
                label="পণ্যের নাম (Product Name)"
                bnValue={draft.nameBn}
                enValue={draft.nameEn}
                onBnChange={(v) => setDraft((p) => ({ ...p, nameBn: v }))}
                onEnChange={(v) => setDraft((p) => ({ ...p, nameEn: v }))}
              />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="text-stone-500 font-bold block mb-1">ক্যাটাগরি</label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200"
                  >
                    {config.categories
                      .filter((c) => c.id !== "all")
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameBn} ({c.nameEn})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-stone-500 font-bold block mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={draft.price}
                    onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-bold block mb-1">পূর্বের মূল্য (অপশনাল)</label>
                  <input
                    type="number"
                    value={draft.oldPrice || ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        oldPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-bold block mb-1">স্টক পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    value={draft.stock}
                    onChange={(e) => setDraft((p) => ({ ...p, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-bold block mb-1">একক (Unit)</label>
                  <input
                    type="text"
                    value={draft.unitBn}
                    onChange={(e) => setDraft((p) => ({ ...p, unitBn: e.target.value }))}
                    placeholder="টি / ব্যাগ"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <BilingualInput
                label="ব্যাজ / ট্যাগ (Badge e.g. Best Seller)"
                bnValue={draft.badgeBn || ""}
                enValue={draft.badgeEn || ""}
                onBnChange={(v) => setDraft((p) => ({ ...p, badgeBn: v }))}
                onEnChange={(v) => setDraft((p) => ({ ...p, badgeEn: v }))}
              />

              <BilingualInput
                label="বিস্তারিত বিবরণ (Description)"
                multiline
                rows={2}
                bnValue={draft.descriptionBn}
                enValue={draft.descriptionEn}
                onBnChange={(v) => setDraft((p) => ({ ...p, descriptionBn: v }))}
                onEnChange={(v) => setDraft((p) => ({ ...p, descriptionEn: v }))}
              />

              <BilingualInput
                label="পরিচর্যা পরামর্শ (Care Guide)"
                bnValue={draft.careTipsBn || ""}
                enValue={draft.careTipsEn || ""}
                onBnChange={(v) => setDraft((p) => ({ ...p, careTipsBn: v }))}
                onEnChange={(v) => setDraft((p) => ({ ...p, careTipsEn: v }))}
              />

              <CloudinaryUploader
                value={draft.image}
                onUpload={(url) => setDraft((p) => ({ ...p, image: url }))}
                folder="shop"
                label="পণ্যের ছবি (Product Image)"
                previewType="image"
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100">
                <div className="flex gap-5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={draft.isActive !== false}
                      onChange={(e) => setDraft((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    পাবলিক শপে প্রদর্শন (Visible)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.isFeatured)}
                      onChange={(e) => setDraft((p) => ({ ...p, isFeatured: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    ফিচার্ড পণ্য (Featured)
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {editingId ? "আপডেট ও সেভ" : "পণ্য যোগ ও সেভ"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400">পণ্য লোড হচ্ছে...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.products.map((prod) => (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border p-4 flex flex-col justify-between gap-3 ${
                    prod.isActive === false ? "opacity-60 border-dashed border-stone-300" : "border-stone-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={prod.image || "/hero_plants.png"}
                      alt={prod.nameEn}
                      className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                        {prod.category}
                      </span>
                      <h4 className="font-bold text-stone-800 text-sm truncate">{prod.nameBn}</h4>
                      <p className="text-xs text-stone-500 truncate">{prod.nameEn}</p>
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-xs">
                        <span className="font-bold text-emerald-800">৳{prod.price}</span>
                        {prod.oldPrice && (
                          <span className="line-through text-stone-400 text-[11px]">৳{prod.oldPrice}</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          স্টক: {prod.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                    <span className="text-stone-400 font-mono text-[10px]">ID: {prod.id}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(prod.id);
                          setDraft({ ...prod });
                          setShowForm(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold cursor-pointer"
                      >
                        ✏️ এডিট
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(prod.id)}
                        className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB 2: ORDERS */}
      {sub === "orders" && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-10 text-center text-xs text-stone-400">এখনো কোনো শপ অর্ডার জমা পড়েনি।</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 sm:p-5 flex flex-col lg:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {ord.orderNumber}
                      </span>
                      <span className="font-bold text-sm text-stone-800">{ord.clientName}</span>
                      <span className="text-xs font-mono text-stone-500">📞 {ord.phone}</span>
                    </div>
                    <p className="text-xs text-stone-600">📍 {ord.address}</p>
                    <p className="text-xs text-stone-500">
                      🛒{" "}
                      {ord.items.map((it) => `${it.nameBn || it.nameEn} × ${it.quantity}`).join(", ")}
                    </p>
                    <p className="text-xs font-mono text-emerald-700 font-bold">
                      মোট: ৳{ord.total.toLocaleString()} • মাধ্যম: {ord.paymentMethod}
                      {ord.transactionRef ? ` (Trx: ${ord.transactionRef})` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => updateOrderStatus(ord.id, ord.status, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="pending_verification">Pending Verify</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteOrder(ord.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB 3: DELIVERY & SHOP TEXTS */}
      {sub === "settings" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <BilingualInput
            label="শপ পেজ ব্যাজ (Shop Badge)"
            bnValue={config.heroBadgeBn}
            enValue={config.heroBadgeEn}
            onBnChange={(v) => setConfig((p) => ({ ...p, heroBadgeBn: v }))}
            onEnChange={(v) => setConfig((p) => ({ ...p, heroBadgeEn: v }))}
          />
          <BilingualInput
            label="শপ পেজ শিরোনাম (Shop Title)"
            bnValue={config.heroTitleBn}
            enValue={config.heroTitleEn}
            onBnChange={(v) => setConfig((p) => ({ ...p, heroTitleBn: v }))}
            onEnChange={(v) => setConfig((p) => ({ ...p, heroTitleEn: v }))}
          />
          <BilingualInput
            label="শপ পেজ সাবটাইটেল (Shop Subtitle)"
            multiline
            rows={2}
            bnValue={config.heroSubtitleBn}
            enValue={config.heroSubtitleEn}
            onBnChange={(v) => setConfig((p) => ({ ...p, heroSubtitleBn: v }))}
            onEnChange={(v) => setConfig((p) => ({ ...p, heroSubtitleEn: v }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-2 border-t border-stone-100">
            <div>
              <label className="font-bold text-stone-600 block mb-1">ডেলিভারি চার্জ (৳)</label>
              <input
                type="number"
                value={config.deliveryCharge}
                onChange={(e) => setConfig((p) => ({ ...p, deliveryCharge: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-stone-600 block mb-1">ফ্রি ডেলিভারি সীমা (৳)</label>
              <input
                type="number"
                value={config.freeShippingMin}
                onChange={(e) => setConfig((p) => ({ ...p, freeShippingMin: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-stone-600 block mb-1">ভ্যাট / ট্যাক্স (%)</label>
              <input
                type="number"
                value={config.taxPercent}
                onChange={(e) => setConfig((p) => ({ ...p, taxPercent: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-stone-600 block mb-1">বিকাশ মার্চেন্ট নম্বর</label>
              <input
                type="text"
                value={config.bkashNumber}
                onChange={(e) => setConfig((p) => ({ ...p, bkashNumber: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-xs pt-2">
            <label className="flex items-center gap-2 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableCod}
                onChange={(e) => setConfig((p) => ({ ...p, enableCod: e.target.checked }))}
                className="w-4 h-4 accent-emerald-600"
              />
              ক্যাশ অন ডেলিভারি (COD) সক্রিয়
            </label>
            <label className="flex items-center gap-2 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableBkash}
                onChange={(e) => setConfig((p) => ({ ...p, enableBkash: e.target.checked }))}
                className="w-4 h-4 accent-emerald-600"
              />
              বিকাশ ম্যানুয়াল পেমেন্ট সক্রিয়
            </label>
            <label className="flex items-center gap-2 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableOnlinePayment}
                onChange={(e) => setConfig((p) => ({ ...p, enableOnlinePayment: e.target.checked }))}
                className="w-4 h-4 accent-emerald-600"
              />
              SSLCommerz অনলাইন গেটওয়ে সক্রিয়
            </label>
          </div>
        </div>
      )}

      <StandaloneToast
        message={toast}
        type={toast.startsWith("❌") ? "error" : "success"}
        visible={!!toast}
      />
    </div>
  );
}

