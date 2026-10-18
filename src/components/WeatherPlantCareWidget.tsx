"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

interface PlantCareAdvice {
  icon: string;
  badge: string;
  badgeColor: string;
  headlineBn: string;
  headlineEn: string;
  tipBn: string;
  tipEn: string;
  actionBn: string;
  actionEn: string;
}

export default function WeatherPlantCareWidget() {
  const { t, lang } = useLanguage();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchDhakaWeather = async () => {
    if (typeof document !== "undefined" && document.hidden) return;
    setRefreshing(true);
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current_weather=true"
      );
      if (res.ok) {
        const data = await res.json();
        if (data.current_weather) {
          setWeather(data.current_weather);
          setLastRefreshed(new Date());
        }
      }
    } catch {
      // Fallback simulated pleasant weather for Dhaka if offline
      setWeather({
        temperature: 29.4,
        windspeed: 12.2,
        winddirection: 180,
        weathercode: 1,
        is_day: 1,
        time: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDhakaWeather();
    const interval = setInterval(fetchDhakaWeather, 600000); // 10 min interval
    const handleVisibility = () => {
      if (!document.hidden) fetchDhakaWeather();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Compute Weather-Adaptive Plant Care Advice
  const getPlantCareAdvice = (w: CurrentWeather): PlantCareAdvice => {
    const temp = w.temperature;
    const code = w.weathercode;

    // Rainy / Monsoon (WMO codes: 51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99)
    const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
    if (isRain) {
      return {
        icon: "🌧️",
        badge: t("বৃষ্টির সতর্কতা", "Rain Advisory"),
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        headlineBn: "ভারী বৃষ্টিপাত: ছাদবাগান ড্রেনেজ ও রুট-রট সুরক্ষা",
        headlineEn: "Heavy Rainfall: Inspect Rooftop Drainage & Root Health",
        tipBn: "ভারী বৃষ্টি: ছাদবাগানের ড্রেনেজ লাইন পরীক্ষা করুন যেন পানি জমে শিকড় না পচে। টবের নিচের ট্রে অপসারণ করুন।",
        tipEn: "Heavy rain detected: Inspect rooftop garden drainage channels to prevent waterlogging and root rot. Remove saucer plates under pots.",
        actionBn: "টবের পানি নিষ্কাশন নিশ্চিত করুন",
        actionEn: "Ensure clear drain outlets",
      };
    }

    // Extreme Heat / Summer (> 32°C)
    if (temp > 32) {
      return {
        icon: "☀️",
        badge: t("তীব্র তাপদাহ", "High Heatwave"),
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        headlineBn: "তীব্র তাপদাহ: বিকেলে বা সূর্যাস্তের পর গাছে পর্যাপ্ত পানি দিন",
        headlineEn: "Extreme Heat: Deep Hydration in Early Morning or Late Evening",
        tipBn: "তীব্র তাপদাহ: সকালের পরিবর্তে বিকেলে বা সূর্যাস্তের পর গাছে পর্যাপ্ত পানি দিন। কচি ক্যাকটাস ও পাতাবাহার গাছের ওপর গ্রিন শেড নেট ব্যবহার করুন।",
        tipEn: "Intense heat (>32°C): Deep water plants in late afternoon or after sunset. Protect delicate saplings with 50% agro-shade mesh.",
        actionBn: "সন্ধ্যায় ডিপ-ওয়াটারিং ও শেডিং",
        actionEn: "Evening deep irrigation & shade",
      };
    }

    // Dry Winter / Cold (< 19°C)
    if (temp < 19) {
      return {
        icon: "❄️",
        badge: t("শীতকালীন শুষ্কতা", "Winter Dry Air"),
        badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        headlineBn: "শীতকালীন শুষ্কতা: পাতায় হালকা পানি স্প্রে ও আর্দ্রতা নিয়ন্ত্রণ",
        headlineEn: "Winter Dryness: Foliar Mist Spraying & Weed Removal",
        tipBn: "শীতকালীন শুষ্কতা: বাতাসে আর্দ্রতা কম থাকায় পাতায় হালকা পানি স্প্রে করুন ও নিয়মিত আগাছা পরিষ্কার করুন। সকালের নরম রোদ নিশ্চিত করুন।",
        tipEn: "Dry winter air: Lightly mist tropical foliage with fine water droplets. Clear dried leaves and maintain soil organic mulch layer.",
        actionBn: "ফোলিয়ার স্প্রে ও মালচিং",
        actionEn: "Foliar misting & organic mulching",
      };
    }

    // Optimal Gardening Weather (19°C - 32°C)
    return {
      icon: "🌱",
      badge: t("অনুকূল আবহাওয়া", "Ideal Growing Conditions"),
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      headlineBn: "অনুকূল আবহাওয়া: গাছের বৃদ্ধি ও জৈব সার প্রয়োগের জন্য আজ উপযুক্ত দিন",
      headlineEn: "Optimal Weather: Perfect Day for Organic Fertilizing & Pruning",
      tipBn: "আবহাওয়া ভারসাম্যপূর্ণ ও অনুকূল। টবের মাটি আলতো খুঁচিয়ে কম্পোস্ট সার দিন এবং হলুদ ও মৃত ডালপালা প্রুনিং বা ছাঁটাই করুন।",
      tipEn: "Balanced microclimate: Gentle aerating of soil surface, apply organic vermicompost and prune dead twigs for rapid lush foliage growth.",
      actionBn: "নিয়মিত জৈব সার ও ডাল ছাঁটাই",
      actionEn: "Apply vermicompost & prune",
    };
  };

  const advice = weather
    ? getPlantCareAdvice(weather)
    : {
        icon: "🌱",
        badge: "Gardening Tip",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        headlineBn: "গাছের যত্নে লাইভ আবহাওয়া ট্র্যাকিং",
        headlineEn: "Live Weather-Adaptive Plant Care",
        tipBn: "আবহাওয়া পর্যবেক্ষণ চলছে...",
        tipEn: "Analyzing microclimate...",
        actionBn: "পর্যবেক্ষণ",
        actionEn: "Observing",
      };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#1b2a20]/90 via-[#152119]/85 to-[#0f1712]/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl transition-all hover:border-emerald-500/30">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Weather Metrics */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
            {advice.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${advice.badgeColor}`}>
                {advice.badge}
              </span>
              <span className="text-[11px] font-mono text-white/50 flex items-center gap-1">
                📍 {t("ঢাকা, বাংলাদেশ", "Dhaka, BD")}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {weather ? `${Math.round(weather.temperature)}°C` : "--°C"}
              </span>
              <span className="text-xs font-mono text-emerald-400">
                💨 {weather ? `${weather.windspeed} km/h` : "--"}
              </span>
              <span className="text-[10px] font-mono text-white/40 hidden sm:inline">
                ({t("লাইভ স্যাটেলাইট", "Open-Meteo Live")})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Refresh button */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={fetchDhakaWeather}
            disabled={refreshing}
            title={t("আবহাওয়া রিফ্রেশ করুন", "Refresh weather")}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin" : ""}>🔄</span>
            <span className="hidden sm:inline">{t("আপডেট", "Update")}</span>
          </button>
        </div>
      </div>

      {/* Advisory Content Box */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <h4 className="text-sm sm:text-base font-display font-bold text-[#E4E2D7] leading-snug">
          {advice.headlineEn}
        </h4>
        <p className="text-xs sm:text-sm text-white/70 mt-1.5 leading-relaxed">
          {lang === "bn" ? advice.tipBn : advice.tipEn}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
            ✨ {t("আজকের পরামর্শ:", "Recommended Action:")} {lang === "bn" ? advice.actionBn : advice.actionEn}
          </span>
          <span className="text-white/40 text-[10px]">
            {t("সর্বশেষ আপডেট:", "Updated:")} {lastRefreshed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
