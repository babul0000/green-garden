import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী (Terms & Conditions) | AR Green Garden",
  description: "এ আর গ্রিন গার্ডেনের সেবা গ্রহণ, সাইট ভিজিট, ডিজাইন কমিশন ও চুক্তি সংক্রান্ত সাধারণ শর্তাবলী।",
  openGraph: {
    title: "ব্যবহারের শর্তাবলী (Terms & Conditions) | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের সেবা গ্রহণ, সাইট ভিজিট, ডিজাইন কমিশন ও চুক্তি সংক্রান্ত সাধারণ শর্তাবলী।",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121813] font-sans pt-28 pb-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-mono text-[#75787B]">
          <Link href="/" className="hover:text-[#2B4D33] transition-colors">হোম</Link>
          <span>/</span>
          <span className="text-[#2B4D33] font-semibold">ব্যবহারের শর্তাবলী</span>
        </nav>

        {/* Header */}
        <div className="border-b border-[#D6D2C4] pb-8 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2B4D33] font-bold px-3 py-1 rounded-full bg-[#2B4D33]/10 border border-[#2B4D33]/20 inline-block mb-3">
            TERMS OF SERVICE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-[#121813] tracking-tight mb-4">
            ব্যবহারের সাধারণ শর্তাবলী (Terms & Conditions)
          </h1>
          <p className="text-sm font-sans text-[#75787B] leading-relaxed">
            কার্যকর তারিখ: ১৭ অক্টোবর, ২০২৬ | এ আর গ্রিন গার্ডেন (AR Green Garden)
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#2C302E]">
          
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ১. সেবার পরিধি ও গ্রহণযোগ্যতা
            </h2>
            <p className="text-[#4F5255] mb-2">
              আমাদের ওয়েবসাইট বা সেবা (ল্যান্ডস্কেপ ডিজাইন, কনসালটেন্সি, ছাদবাগান বাস্তবায়ন, ভার্টিক্যাল গ্রিন ওয়াল ও ট্রি ক্লিনিক) ব্যবহারের মাধ্যমে আপনি এই সকল শর্তাবলী মেনে নিচ্ছেন।
            </p>
            <p className="text-[#4F5255]">
              [নোট: গ্রাহক ও ক্লায়েন্টের নির্দিষ্ট চুক্তিপত্রের শর্তাবলী এর সাথে সমন্বিত থাকবে।]
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ২. সাইট ভিজিট ও প্রাথমিক কনসালটেশন
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#4F5255]">
              <li>প্রাথমিক সাইট পরিদর্শনের জন্য নির্ধারিত সার্ভিস চার্জ প্রযোজ্য হতে পারে, যা বুকিংয়ের পূর্বে গ্রাহককে অবহিত করা হবে।</li>
              <li>সাইট ভিজিটের সময় স্থানটিতে প্রবেশের পূর্ণ নিরাপত্তা ও অনুমতি নিশ্চিত করার দায়িত্ব ক্লায়েন্টের।</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৩. ডিজাইন ও ইন্টেলেকচুয়াল প্রপার্টি রাইটস
            </h2>
            <p className="text-[#4F5255] leading-relaxed mb-3">
              এ আর গ্রিন গার্ডেনের আর্কিটেক্ট ও ডিজাইনারদের প্রস্তুতকৃত সকল ৩ডি রেন্ডারিং, মাস্টারপ্ল্যান, ড্রয়িং এবং টেকনিক্যাল স্পেসিফিকেশন কোম্পানির বুদ্ধিবৃত্তিক সম্পত্তি (Intellectual Property)।
            </p>
            <p className="text-[#4F5255] leading-relaxed">
              অনুমতি ব্যতীত অন্য কোনো পক্ষের মাধ্যমে একই আর্কিটেকচারাল ডিজাইন নকল বা বাস্তবায়ন করা আইনত দণ্ডনীয়।
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৪. পেমেন্ট ও ইনভয়েসিং নীতি
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#4F5255]">
              <li>প্রজেক্ট কমিশন শুরুর পূর্বে নির্ধারিত অগ্রিম অর্থ (Advance Retainer) প্রদান করতে হবে।</li>
              <li>কাজের ধাপ (Milestone) সম্পন্ন হওয়া সাপেক্ষে ইনভয়েস ইস্যু করা হবে এবং নির্ধারিত সময়ের মধ্যে পরিশোধযোগ্য।</li>
              <li>বকেয়া ইনভয়েসের জন্য কাজ সাময়িক স্থগিত রাখার অধিকার কোম্পানি সংরক্ষণ করে।</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৫. প্রাকৃতিক কারণ ও সীমাবদ্ধতা (Force Majeure)
            </h2>
            <p className="text-[#4F5255] leading-relaxed">
              প্রাকৃতিক দুর্যোগ, অতিবৃষ্টি, বন্যা, ঝড় অথবা মহামারীজনিত কারণে কাজের গতি ব্যাহত হলে বা জীবন্ত উদ্ভিদের স্বাভাবিক ক্ষয়ক্ষতি হলে এ আর গ্রিন গার্ডেন দায়বদ্ধ থাকবে না, তবে পরিস্থিতি স্বাভাবিক হওয়া সাপেক্ষে সর্বোচ্চ অগ্রাধিকার দিয়ে প্রজেক্ট সম্পন্ন করা হবে।
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৬. আইনের এখতিয়ার
            </h2>
            <p className="text-[#4F5255] leading-relaxed">
              এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন দ্বারা পরিচালিত ও নিয়ন্ত্রিত হবে। কোনো ধরনের বিরোধ দেখা দিলে তা প্রথমে পারস্পরিক সৌহার্দ্যপূর্ণ আলোচনার মাধ্যমে সমাধানের চেষ্টা করা হবে।
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
