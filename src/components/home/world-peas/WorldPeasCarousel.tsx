"use client";

import React, { useRef } from "react";

interface ProduceItem {
  id: string;
  name: string;
  price: string;
  image: string;
  aspect: "landscape" | "portrait";
}

const produceItems: ProduceItem[] = [
  {
    id: "1",
    name: "Shiitakes",
    price: "$8.99/lb",
    image: "/world-peas/shiitakes.png",
    aspect: "landscape",
  },
  {
    id: "2",
    name: "Rainier Cherries",
    price: "$3.99/lb",
    image: "/world-peas/cherries.png",
    aspect: "portrait",
  },
  {
    id: "3",
    name: "Radishes",
    price: "$2.29/lb",
    image: "/world-peas/radishes.png",
    aspect: "landscape",
  },
  {
    id: "4",
    name: "Greens Mix",
    price: "$3.99/lb",
    image: "/world-peas/greens_mix.png",
    aspect: "portrait",
  },
  {
    id: "5",
    name: "Icebox melon",
    price: "$0.89/lb",
    image: "/world-peas/melon.png",
    aspect: "landscape",
  },
];

export default function WorldPeasCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full bg-white text-black py-12 sm:py-16 overflow-hidden">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-8 space-y-6">
        {/* Section Heading (Figma: Just harvested near you, Inter 18px w500) */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] sm:text-[18px] font-sans font-medium text-black">
            Just harvested near you
          </h2>

          {/* Optional Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: -400, behavior: "smooth" });
              }}
              className="w-8 h-8 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-sm transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
              }}
              className="w-8 h-8 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-sm transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* ================= HORIZONTAL ITEM CAROUSEL (FIGMA RHYTHMIC SPEC) ================= */}
        <div
          ref={scrollContainerRef}
          className="flex items-end gap-6 sm:gap-8 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
        >
          {produceItems.map((item) => {
            const isPortrait = item.aspect === "portrait";

            return (
              <div
                key={item.id}
                className={`shrink-0 snap-start space-y-3 group cursor-pointer ${
                  isPortrait
                    ? "w-[240px] sm:w-[320px]"
                    : "w-[300px] sm:w-[440px]"
                }`}
              >
                {/* Image Container */}
                <div
                  className={`w-full overflow-hidden rounded-2xl bg-stone-100 ${
                    isPortrait ? "aspect-[3/4]" : "aspect-[16/10]"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/featured_plant.png";
                    }}
                  />
                </div>

                {/* Info Bar (Name on Left, Price on Right, Inter 18px w500) */}
                <div className="flex items-baseline justify-between text-[16px] sm:text-[18px] font-sans text-black pt-1">
                  <span className="font-medium group-hover:opacity-75 transition-opacity">
                    {item.name}
                  </span>
                  <span className="font-normal font-mono opacity-90">
                    {item.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

