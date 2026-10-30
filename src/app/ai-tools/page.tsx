"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "🍂 পাতা হলুদ হয়ে ঝরে পড়ছে", prompt: "আমার গাছের পাতাগুলো হলুদ হয়ে ঝরে পড়ছে। এর কারণ কী এবং প্রতিকার হিসেবে আমার কী করা উচিত?" },
  { label: "🐛 সাদা তুলোর মতো পোকা (মিলিবাগ)", prompt: "গাছের পাতায় এবং কান্ডে সাদা তুলোর মতো পোকা (মিলিবাগ) হয়েছে। কোনো ক্ষতি না করে সহজে দূর করার ঘরোয়া ও স্প্রে সমাধান কী?" },
  { label: "🪴 বারান্দায় সহজে বাঁচে এমন গাছ", prompt: "কম আলো ও সীমিত বাতাসে অ্যাপার্টমেন্টের বারান্দায় সহজে বাঁচে এমন ৫টি ইনডোর/আউটডোর গাছের নাম ও পরিচর্যা পদ্ধতি বলুন।" },
  { label: "🏡 ছাদবাগানের জন্য উপযুক্ত মাটি ও সার", prompt: "ছাদবাগানে টবের জন্য উপযুক্ত মাটির মিশ্রণ ও জৈব সার কীভাবে তৈরি করতে হয়?" },
  { label: "💧 গাছে পানি দেওয়ার সঠিক নিয়ম", prompt: "কোন গাছে কত দিন পর পর পানি দেওয়া উচিত? মাটি ভেজা থাকলে পানি দেওয়ার নিয়ম কী?" },
];

export default function AIToolsPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `নমস্কার / আসসালামু আলাইকুম! 🌿\n\nআমি **A R Green Garden-এর স্মার্ট এআই বৃক্ষ বিশারদ ও গার্ডেন সহকারী**।\n\nআপনি আপনার গাছের যেকোনো রোগবালাই, পাতা শুকানো, পোকার আক্রমণ, সার ও মাটির সঠিক ব্যবহার, ছাদবাগান কিংবা ল্যান্ডস্কেপিং সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন—আমি বিস্তারিত সমাধান দেব।\n\n📷 **টিপ:** আপনার অসুস্থ গাছের একটি ছবি তুলে নিচে সংযুক্ত করুন, আমি রোগ নির্ণয় করে প্রেসক্রিপশন দিয়ে দেব!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("ছবির সাইজ সর্বোচ্চ ৮ মেগাবাইট হতে পারবে।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const matches = result.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          setSelectedImage({
            mimeType: matches[1],
            data: matches[2],
            preview: result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query || "এই ছবিটিতে কী রোগ দেখা যাচ্ছে এবং কী সমাধান?",
      image: selectedImage?.preview,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Build conversation history for API (excluding the welcome message)
      const chatHistory = [...messages.filter((m) => m.id !== "welcome"), userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          prompt: userMessage.content,
          image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `দুঃখিত, ${data.error || "সার্ভার এই মুহূর্তে ব্যস্ত। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।"}\n\nজরুরি প্রয়োজনে সরাসরি আমাদের হটলাইনে কল করুন: 01883012641`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "ইন্টারনেট সংযোগে ত্রুটি হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে পুনরায় প্রশ্ন করুন।",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to format AI markdown output with bold, lists, and spacing
  const formatMarkdown = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bold formatting
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.startsWith("### ")) {
        return <h4 key={idx} className="font-bold text-emerald-900 text-sm mt-3 mb-1" dangerouslySetInnerHTML={{ __html: formatted.replace("### ", "") }} />;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="font-bold text-emerald-950 text-base mt-4 mb-1.5" dangerouslySetInnerHTML={{ __html: formatted.replace("## ", "") }} />;
      }
      if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-stone-800 leading-relaxed text-xs sm:text-sm py-0.5" dangerouslySetInnerHTML={{ __html: formatted.replace(/^([•\-\*]\s*)/, "") }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-stone-800 leading-relaxed text-xs sm:text-sm py-0.5" dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\.\s*/, "") }} />
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-stone-800 leading-relaxed text-xs sm:text-sm my-1" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Banner */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>✨ Powered by Google Gemini</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>লাইভ এআই বৃক্ষ বিশারদ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
            স্মার্ট এআই গার্ডেন সহায়ক ও <span className="text-emerald-700">ট্রি ডক্টর</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            গাছের যেকোনো রোগবালাই, সার, পানি, কাটিং বা ছাদবাগান সংক্রান্ত প্রশ্ন বাংলায় জিজ্ঞাসা করুন অথবা অসুস্থ পাতার ছবি আপলোড করে তাৎক্ষণিক প্রেসক্রিপশন পান।
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 pb-2">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(item.prompt)}
              disabled={isLoading}
              className="text-[11px] sm:text-xs bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Chat Container Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col h-[650px] sm:h-[700px]">
          
          {/* Top Bar with Status and Actions */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-lg shadow-inner">
                🌿
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 font-serif">
                  A R Green Garden AI
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600/60 text-[10px] text-emerald-200 uppercase tracking-wider font-sans font-semibold">
                    অনলাইন
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-200/80">
                  ২৪/৭ অন-কল বৃক্ষ স্বাস্থ্য ও ল্যান্ডস্কেপিং বিশেষজ্ঞ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMessages([messages[0]]);
                  setSelectedImage(null);
                }}
                className="text-[11px] text-stone-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
                title="চ্যাট হিস্ট্রি ক্লিয়ার করুন"
              >
                🗑️ নতুন চ্যাট
              </button>
              <a
                href="tel:01883012641"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                <span>🚨</span> অন-কল ডাক্তার
              </a>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm shrink-0 shadow-sm mt-1">
                    🌿
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-xs space-y-2 ${
                    msg.role === "user"
                      ? "bg-emerald-700 text-white rounded-tr-xs"
                      : "bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-sm"
                  }`}
                >
                  {/* User Uploaded Image Preview in Chat Bubble */}
                  {msg.image && (
                    <div className="relative rounded-xl overflow-hidden max-w-xs border border-white/20 mb-2 shadow-sm">
                      <img src={msg.image} alt="User upload" className="w-full h-auto max-h-48 object-cover" />
                    </div>
                  )}

                  {/* Message Body */}
                  <div>
                    {msg.role === "user" ? (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-xs sm:text-sm space-y-1">
                        {formatMarkdown(msg.content)}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`text-[10px] text-right font-mono ${
                      msg.role === "user" ? "text-emerald-200/80" : "text-stone-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm mt-1">
                    👤
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm shrink-0 shadow-sm animate-pulse">
                  🌿
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2 text-stone-500 text-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span>Gemini এআই আপনার গাছের ছবিটি বিশ্লেষণ করছে...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Selected Image Preview Bar */}
          {selectedImage && (
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-300">
                  <img src={selectedImage.preview} alt="Attached" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">✓ ছবি সংযুক্ত হয়েছে</span>
                  <span className="text-[10px] text-emerald-700">গাছের লক্ষণটি লিখে সেন্ড করুন</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-stone-400 hover:text-red-600 text-sm font-bold p-1 cursor-pointer"
                title="ছবিটি মুছুন"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input & Upload Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
            <div className="flex items-end gap-2 bg-stone-50 rounded-2xl border border-stone-200 p-2 focus-within:border-emerald-600 focus-within:bg-white transition-all shadow-inner">
              
              {/* Photo Upload Icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                title="গাছের ছবি আপলোড করুন"
              >
                <span className="text-xl">📷</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Text Input */}
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="গাছের সমস্যা লিখুন বা যেকোনো প্রশ্ন করুন... (Enter চেপে পাঠান)"
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none resize-none py-1.5 max-h-28"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isLoading || (!inputPrompt.trim() && !selectedImage)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>পাঠান</span>
                <span className="text-xs">➔</span>
              </button>
            </div>

            {/* Helpline and Notice Footer */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] text-stone-500 px-1 gap-2">
              <span className="flex items-center gap-1">
                <span>🔒</span> গোপনীয়তা সংরক্ষিত • এআই প্রস্তুতকৃত প্রাথমিক প্রেসক্রিপশন
              </span>
              <div className="flex items-center gap-3">
                <Link href="/tree-doctor" className="text-emerald-700 font-bold hover:underline">
                  জরুরি ডাক্তার ভিজিট রিকোয়েস্ট →
                </Link>
                <a href="https://wa.me/8801883012641" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:underline flex items-center gap-1">
                  <span>💬</span> WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
