"use client";

import React from "react";
import Link from "next/link";

export default function WorldPeasNewsstand() {
  return (
    <section id="newsstand" className="w-full bg-white text-black py-16 sm:py-24">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">
        {/* Section Heading (Figma: From the Newsstand, Inter 18px w500) */}
        <div>
          <h2 className="text-[17px] sm:text-[18px] font-sans font-medium text-black">
            From the Newsstand
          </h2>
        </div>

        {/* ================= ARTICLE 1: FULL WIDTH LAVENDER CARD (#CDB3FA) ================= */}
        <div className="w-full bg-[#CDB3FA] rounded-3xl p-8 sm:p-14 lg:p-16 flex flex-col justify-between min-h-[500px] sm:min-h-[580px] text-black space-y-8 group transition-transform duration-300 hover:shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Title (Newsreader 64px w300) */}
            <div className="lg:col-span-6">
              <h3 className="font-['Newsreader',serif] text-[36px] sm:text-[52px] lg:text-[60px] font-light leading-[1.08] text-black tracking-tight">
                Sigh of re-leaf — a deeper dive into eco-friendly farming.
              </h3>
            </div>

            {/* Paragraph (Inter 18px w400) */}
            <div className="lg:col-span-6 lg:pl-6">
              <p className="font-sans text-[16px] sm:text-[18px] text-black/90 leading-[1.55] font-normal">
                The way we grow our food has a significant impact on the health of our planet and our bodies. Traditional agricultural practices often prioritize maximizing yields and profits over environmental sustainability and public health. However, eco-friendly and organic farming practices provide an alternative approach that benefits both the planet and our health.
              </p>
            </div>
          </div>

          {/* Date & Link Row */}
          <div className="flex items-center justify-between text-[16px] sm:text-[18px] font-sans pt-8 border-t border-black/10">
            <span className="font-normal opacity-85">July 20, 2023</span>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-medium hover:opacity-70 transition-opacity"
            >
              <span>←</span>
              <span className="underline underline-offset-4">Read article</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ================= ARTICLES ROW 2: LIME (#DEF358) & PEACH (#FFCBB7) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Article 2: Lime Card (Figma: 425x608, #DEF358) */}
          <div className="lg:col-span-5 bg-[#DEF358] rounded-3xl p-8 sm:p-12 flex flex-col justify-between min-h-[460px] sm:min-h-[560px] text-black space-y-6 group transition-transform duration-300 hover:shadow-lg">
            <div className="space-y-6">
              <h3 className="font-['Newsreader',serif] text-[36px] sm:text-[48px] lg:text-[54px] font-light leading-[1.08] text-black tracking-tight">
                Zesty Melon Salsa
              </h3>
              <p className="font-sans text-[16px] sm:text-[17px] text-black/90 leading-[1.55] font-normal">
                This fresh and tangy twist on salsa makes for an irresistible chip dip, and adds a kick to almost any dish. Take your tacos to the next level with a summer-ready recipe that’s sure to be one of your favorites.
              </p>
            </div>

            <div className="flex items-center justify-between text-[15px] sm:text-[17px] font-sans pt-6 border-t border-black/10">
              <span className="font-normal opacity-85">August 18, 2023</span>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-medium hover:opacity-70 transition-opacity"
              >
                <span>←</span>
                <span className="underline underline-offset-4">Read recipe</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Article 3: Peach Card (Figma: 740x608, #FFCBB7) */}
          <div className="lg:col-span-7 bg-[#FFCBB7] rounded-3xl p-8 sm:p-12 flex flex-col justify-between min-h-[460px] sm:min-h-[560px] text-black space-y-6 group transition-transform duration-300 hover:shadow-lg">
            <div className="space-y-6">
              <h3 className="font-['Newsreader',serif] text-[36px] sm:text-[48px] lg:text-[54px] font-light leading-[1.08] text-black tracking-tight">
                Fungus finder — a guide to sustainable mushroom hunting.
              </h3>
              <p className="font-sans text-[16px] sm:text-[17px] text-black/90 leading-[1.55] font-normal max-w-xl">
                Omnis quo commodi repelle ndus eveniet nostrum aut voluptas iure. Simi lique vitae est. Est necessitatibus soluta modi recusandae praes entium nulla. Vel voluptatum molestias nam distinctio sint.
              </p>
            </div>

            <div className="flex items-center justify-between text-[15px] sm:text-[17px] font-sans pt-6 border-t border-black/10">
              <span className="font-normal opacity-85">September 13, 2023</span>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-medium hover:opacity-70 transition-opacity"
              >
                <span>←</span>
                <span className="underline underline-offset-4">Read article</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

