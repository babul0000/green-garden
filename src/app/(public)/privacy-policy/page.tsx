import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | AR Green Garden",
  description: "এ আর গ্রিন গার্ডেনের গ্রাহক ও ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা ও ব্যবহারের স্পষ্ট নীতিমালা।",
  openGraph: {
    title: "গোপনীয়তা নীতি (Privacy Policy) | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের গ্রাহক ও ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা ও ব্যবহারের স্পষ্ট নীতিমালা।",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121813] font-sans pt-28 pb-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-mono text-[#75787B]">
          <Link href="/" className="hover:text-[#2B4D33] transition-colors">হোম</Link>
          <span>/</span>
          <span className="text-[#2B4D33] font-semibold">গোপনীয়তা নীতি</span>
        </nav>

        {/* Header */}
        <div className="border-b border-[#D6D2C4] pb-8 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2B4D33] font-bold px-3 py-1 rounded-full bg-[#2B4D33]/10 border border-[#2B4D33]/20 inline-block mb-3">
            LEGAL & COMPLIANCE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-[#121813] tracking-tight mb-4">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-sm font-sans text-[#75787B] leading-relaxed">
            সর্বশেষ পরিমার্জন: ১৭ অক্টোবর, ২০২৬ | এ আর গ্রিন গার্ডেন (AR Green Garden)
          </p>
        </div>

        {/* Notice Banner */}
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <strong className="font-bold text-amber-950">[আসল শর্ত বসাতে হবে]</strong> — এটি এ আর গ্রিন গার্ডেনের খসড়া টেমপ্লেট। স্টুডিও পরিচালনার চূড়ান্ত আইনি শর্তাবলী এখানে প্রতিস্থাপন করতে হবে।
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#2C302E]">
          
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ১. ভূমিকা ও তথ্যের সুরক্ষা প্রতিশ্রুতি
            </h2>
            <p className="text-[#4F5255] mb-3">
              এ আর গ্রিন গার্ডেন (AR Green Garden) গ্রাহক এবং ওয়েবসাইটে আগত সকল ভিজিটরদের তথ্যের সুরক্ষা নিশ্চিত করতে অঙ্গীকারবদ্ধ। আমাদের ওয়েবসাইট, কনসালটেন্সি সার্ভিস, ডিজাইন কমিশন অথবা নার্সারি কেনাকাটা ব্যবহারের সময় আপনার সংগৃহীত তথ্যের গোপনীয়তা কীভাবে সংরক্ষিত হয়, তা এই নীতিমালায় সুস্পষ্টভাবে উল্লেখ করা হয়েছে।
            </p>
            <p className="text-[#4F5255]">
              [নোট: এখানে আপনার প্রতিষ্ঠানের নির্দিষ্ট প্রাতিষ্ঠানিক প্রবিধান যুক্ত করতে পারেন।]
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ২. আমরা যেসব তথ্য সংগ্রহ করি
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#4F5255]">
              <li><strong className="text-[#121813]">ব্যক্তিগত পরিচয় ও যোগাযোগের তথ্য:</strong> আপনার নাম, ইমেইল ঠিকানা, মোবাইল নম্বর এবং প্রজেক্ট সাইটের ঠিকানা।</li>
              <li><strong className="text-[#121813]">প্রজেক্ট সম্পর্কিত তথ্য:</strong> আপনার ছাদ, ল্যান্ডস্কেপ বা বারান্দার মাপ, মাটির ধরন, পছন্দের গাছপালা এবং সাইটের ছবি বা ভিডিও।</li>
              <li><strong className="text-[#121813]">পেমেন্ট ও বিলিং সংক্রান্ত তথ্য:</strong> ইনভয়েস পরিশোধ সংক্রান্ত তথ্য, ট্রানজ্যাকশন আইডি (SSLCommerz, bKash বা ব্যাংক ট্রান্সফার)। আমরা গ্রাহকের কোনো কার্ড নম্বর বা পিন সংরক্ষণ করি না।</li>
              <li><strong className="text-[#121813]">প্রযুক্তিগত তথ্য:</strong> ব্রাউজারের ধরন, আইপি অ্যাড্রেস এবং ভিজিট করার সময়কাল (ওয়েবসাইট পারফরম্যান্স উন্নত করার জন্য)।</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৩. তথ্যের ব্যবহার
            </h2>
            <p className="text-[#4F5255] mb-2">
              সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহৃত হয়:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#4F5255]">
              <li>ল্যান্ডস্কেপ ডিজাইন, সাইট ভিজিট এবং কোটেশন তৈরির জন্য।</li>
              <li>বুকিং, সার্ভিস শিডিউল ও জরুরি বৃক্ষ চিকিৎসা অ্যাপয়েন্টমেন্ট নিশ্চিত করার জন্য।</li>
              <li>প্রজেক্টের কাজের অগ্রগতি জানানো এবং কাস্টমার সাপোর্ট প্রদান।</li>
              <li>গ্রাহকের সম্মতি সাপেক্ষে নতুন অফার, গবেষণা জার্নাল ও সেবা আপডেট পাঠানো।</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৪. তৃতীয় পক্ষের সাথে তথ্য আদান-প্রদান
            </h2>
            <p className="text-[#4F5255] leading-relaxed">
              আমরা কোনো অবস্থাতেই গ্রাহকের ব্যক্তিগত তথ্য বিজ্ঞাপন বা বাণিজ্যিক উদ্দেশ্যে তৃতীয় কোনো পক্ষের কাছে বিক্রি বা ভাড়া দিই না। শুধুমাত্র প্রজেক্ট বাস্তবায়নের প্রয়োজনে (যেমন: গাছ বা মালামাল ডেলিভারি কুরিয়ার পার্টনার, অথবা পেমেন্ট গেটওয়ে প্রোভাইডার) সংশ্লিষ্ট তথ্য সর্বনিম্ন পরিসরে শেয়ার করা হয়।
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৫. আপনার অধিকার ও যোগাযোগ
            </h2>
            <p className="text-[#4F5255] mb-4">
              আপনার সংরক্ষিত ব্যক্তিগত তথ্য যাচাই, পরিবর্তন বা ডাটাবেজ থেকে মুছে ফেলার জন্য যে কোনো সময় আমাদের সাথে যোগাযোগ করতে পারেন।
            </p>
            <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#D6D2C4] font-mono text-xs space-y-1 text-[#2B4D33]">
              <p>📍 ঠিকানা: ৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ</p>
              <p>📞 হটলাইন: 01883012641</p>
              <p>✉️ অফিসিয়াল ইমেইল: info@argreengarden.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
