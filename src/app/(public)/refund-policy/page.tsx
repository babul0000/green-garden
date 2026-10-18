import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "রিফান্ড ও ক্যান্সেলেশন পলিসি (Refund Policy) | AR Green Garden",
  description: "এ আর গ্রিন গার্ডেনের সেবা বাতিল, কনসালটেন্সি ফি ও নার্সারি আইটেম রিফান্ড নীতিমালা।",
  openGraph: {
    title: "রিফান্ড ও ক্যান্সেলেশন পলিসি (Refund Policy) | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের সেবা বাতিল, কনসালটেন্সি ফি ও নার্সারি আইটেম রিফান্ড নীতিমালা।",
    type: "website",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121813] font-sans pt-28 pb-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-mono text-[#75787B]">
          <Link href="/" className="hover:text-[#2B4D33] transition-colors">হোম</Link>
          <span>/</span>
          <span className="text-[#2B4D33] font-semibold">রিফান্ড ও ক্যান্সেলেশন পলিসি</span>
        </nav>

        {/* Header */}
        <div className="border-b border-[#D6D2C4] pb-8 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2B4D33] font-bold px-3 py-1 rounded-full bg-[#2B4D33]/10 border border-[#2B4D33]/20 inline-block mb-3">
            REFUND & CANCELLATION
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-[#121813] tracking-tight mb-4">
            রিফান্ড ও ক্যান্সেলেশন পলিসি (Refund Policy)
          </h1>
          <p className="text-sm font-sans text-[#75787B] leading-relaxed">
            কার্যকর তারিখ: ১৭ অক্টোবর, ২০২৬ | এ আর গ্রিন গার্ডেন (AR Green Garden)
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
              ১. কনসালটেন্সি ও সাইট ভিজিট বাতিলকরণ
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#4F5255]">
              <li>নির্ধারিত সাইট ভিজিটের অন্তত ২৪ ঘণ্টা পূর্বে বাতিল করলে সম্পূর্ণ কনসালটেন্সি ফি রিফান্ড যোগ্য।</li>
              <li>আমাদের আর্কিটেক্ট বা ইঞ্জিনিয়ার টিম সাইটে পৌঁছানোর পর পরিদর্শন বাতিল করা হলে সাইট ভিজিট ফি রিফান্ড করা হবে না।</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ২. কাস্টম ৩ডি ডিজাইন ও ল্যান্ডস্কেপ কমিশন
            </h2>
            <p className="text-[#4F5255] leading-relaxed mb-3">
              যেহেতু আর্কিটেকচারাল ও ৩ডি ডিজাইন সেবা সম্পূর্ণ কাস্টমাইজড মেধা ও শ্রমের ওপর নির্ভরশীল, সেহেতু প্রাথমিক কনসেপ্ট ড্রয়িং বা থ্রিডি রেন্ডার ডেলিভারির পর অগ্রিম ডিজাইন ফি অফেরতযোগ্য (Non-refundable)।
            </p>
            <p className="text-[#4F5255] leading-relaxed">
              তবে ক্লায়েন্টের সন্তুষ্টির স্বার্থে নির্ধারিত সংখ্যক রিভিশন (Revision) বিনামূল্যে প্রদান করা হয়।
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৩. নার্সারি চারাগাছ, প্ল্যান্টার ও উপাদান রিটার্ন
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#4F5255]">
              <li>ডেলিভারির সময় ক্ষতিগ্রস্ত বা রোগাক্রান্ত চারাগাছ পাওয়া গেলে তাত্ক্ষণিকভাবে ফেরত দেওয়া যাবে এবং বিনামূল্যে নতুন চারা প্রতিস্থাপন করা হবে।</li>
              <li>জীবন্ত উদ্ভিদের ক্ষেত্রে ডেলিভারির ৪৮ ঘণ্টা পর ক্লায়েন্টের নিজস্ব অবহেলা বা অনুপযুক্ত পানি প্রদানের কারণে ক্ষতি হলে রিফান্ড প্রযোজ্য হবে না।</li>
              <li>টব, ড্রেনেজ সেল, জিওটেক্সটাইল, স্বয়ংক্রিয় সেচ মোটর ইত্যাদিতে ম্যানুফ্যাকচারিং ওয়ারেন্টি প্রযোজ্য থাকবে।</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D6D2C4] shadow-xs">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#121813] mb-3">
              ৪. রিফান্ড প্রসেসিং সময়সীমা ও মাধ্যম
            </h2>
            <p className="text-[#4F5255] leading-relaxed mb-3">
              অনুমোদিত রিফান্ডের অর্থ যে পেমেন্ট চ্যানেলে (bKash, Nagad, কার্ড অথবা ব্যাংক ট্রান্সফার) গ্রহণ করা হয়েছিল, সাধারণত সেই একই চ্যানেলে ৭ থেকে ১০ কার্যদিবসের মধ্যে প্রক্রিয়াকরণ করা হবে।
            </p>
            <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#D6D2C4] font-mono text-xs space-y-1 text-[#2B4D33]">
              <p>রিফান্ড আবেদন বা পর্যালোচনার জন্য যোগাযোগ করুন:</p>
              <p>📞 হেল্পলাইন: 01883012641</p>
              <p>✉️ ইমেইল: billing@argreengarden.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
