"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLanguage } from "@/context/LanguageContext";

interface ManifestoConfig {
  lineEn?: string;
  lineBn?: string;
  descriptionEn?: string;
  descriptionBn?: string;
}

export default function ShmaAnimatedManifesto({ manifestoConfig }: { manifestoConfig?: ManifestoConfig }) {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const enableRef = useRef<HTMLSpanElement>(null);
  const changeRef = useRef<HTMLSpanElement>(null);
  const forTextRef = useRef<HTMLSpanElement>(null);
  const earthRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [animationStarted, setAnimationStarted] = useState(false);

  const textContent = language === "bn" ? {
    enable: "ENABLE",
    change: "CHANGE",
    for_text: "FOR",
    a_better_earth: manifestoConfig?.lineBn || "A BETTER EARTH",
    description: manifestoConfig?.descriptionBn || "একটি সবুজ, সজীব ও টেকসই বাংলাদেশ বিনির্মাণের প্রত্যয়ে—প্রকৃতি ও আধুনিক স্থাপত্যের সমন্বয়ে এ আর গ্রিন গার্ডেন শহুরে ধূসর কংক্রিটকে রূপান্তর করে জীবন্ত ইকোসিস্টেমে। আমাদের স্থাপত্য পরিকল্পনা তাপমাত্রা হ্রাস করে, জীববৈচিত্র্য রক্ষা করে এবং নাগরিক জীবনে আনে স্নিগ্ধ প্রকৃতির পরম ছোঁয়া।",
  } : {
    enable: "ENABLE",
    change: "CHANGE",
    for_text: "FOR",
    a_better_earth: manifestoConfig?.lineEn || "A BETTER EARTH",
    description: manifestoConfig?.descriptionEn || "A R Green Garden envisions a climate-resilient Bangladesh where sustainability, ecological design, and architectural biophilia thrive together. Through scientific planting, stormwater hydrology, and green architecture, we transform urban concrete into living sanctuaries that cool our cities and restore lasting ecological harmony.",
  };

  const states = {
    state1: {
      bgColor: "#e4e2d7",
      line01: "#5a9dff",
      allText: "#3d2e17",
    },
    state2: {
      bgColor: "#777777",
      line01: "#e4fd00",
      allText: "#ffffff",
    },
    state3: {
      bgColor: "#ffffff",
      line01: "#ea4f44",
      allText: "#777777",
      override: { for_text: "#5a9dff" },
    },
    state4: {
      bgColor: "#ffffff",
      line01: "#4a90e2",
      allText: "#3d2e17",
    },
  };

  useEffect(() => {
    if (!containerRef.current || !enableRef.current || !changeRef.current) return;

    const enable = enableRef.current;
    const change = changeRef.current;
    const for_text = forTextRef.current;
    const earth = earthRef.current;
    const description = descRef.current;
    const content = contentRef.current;
    const title = titleRef.current;
    const image1 = image1Ref.current;
    const image2 = image2Ref.current;
    const container = containerRef.current;
    const video = videoRef.current;

    const isMobile = window.innerWidth <= 768;
    const isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile || isReducedMotion) {
      gsap.set(enable, { color: states.state4.line01 });
      gsap.set([change, for_text, earth], { color: states.state4.allText });
      gsap.set(container, { backgroundColor: states.state4.bgColor });
      gsap.set(description, { opacity: 1, y: 0 });
      gsap.set(image2, { opacity: 1 });
      title?.classList.add("final-style");
      video?.play().catch(() => {});
      return;
    }

    // Set initial state matching Shma setInitialState() (Desktop only)
    gsap.set(enable, { color: states.state1.line01 });
    gsap.set([change, for_text, earth], { color: states.state1.allText });
    gsap.set(container, { backgroundColor: states.state1.bgColor });
    gsap.set(description, { opacity: 0, y: 20 });
    gsap.set(image1, { opacity: 0 });
    gsap.set(image2, { opacity: 0 });

    const leftPosition = "28%";
    gsap.set(content, {
      left: leftPosition,
      xPercent: -50,
      textAlign: "left",
    });

    // Build timeline matching Shma buildTimeline()
    const mainTimeline = gsap.timeline({ paused: true });

    // State 2
    const s2 = states.state2;
    mainTimeline.to(container, { backgroundColor: s2.bgColor, duration: 0.4 }, "state2");
    mainTimeline.to(change, { color: s2.line01, duration: 0.4 }, "state2");
    mainTimeline.to([enable, for_text, earth], { color: s2.allText, duration: 0.4 }, "state2");
    mainTimeline.to(content, { left: "10%", xPercent: 0, duration: 0.75 }, "state2");
    mainTimeline.to(image1, { opacity: 1, top: "40%", duration: 1 }, "state2");
    mainTimeline.to({}, { duration: 0.75 });

    // State 3
    const s3 = states.state3;
    mainTimeline.to(container, { backgroundColor: s3.bgColor, duration: 0.35 }, "state3");
    mainTimeline.to([enable, for_text, change], { color: s3.allText, duration: 0.35 }, "state3");
    mainTimeline.to(earth, { color: s3.override.for_text, duration: 0.35 }, "state3");
    mainTimeline.to(content, { left: "50%", xPercent: -50, textAlign: "center", duration: 1 }, "state3");
    mainTimeline.to(image1, { opacity: 0, duration: 0.8 }, "state3");
    mainTimeline.to({}, { duration: 0.75 });

    // State 4 (Final style)
    const s4 = states.state4;
    mainTimeline.to(container, { backgroundColor: s4.bgColor, duration: 0.8 }, "state4");
    mainTimeline.to(enable, { color: s4.line01, duration: 0.8 }, "state4");
    mainTimeline.to([change, for_text, earth], { color: s4.allText, duration: 0.8 }, "state4");
    mainTimeline.to(content, { left: "0%", xPercent: 0, textAlign: "left", duration: 1 }, "state4");
    mainTimeline.to(title, {
      fontSize: "2.5rem",
      onComplete: () => {
        title?.classList.add("final-style");
      },
      duration: 1,
    }, "state4");
    mainTimeline.to(description, { opacity: 1, y: 0, duration: 1.2 }, "state4+=0.3");
    mainTimeline.to(image2, {
      opacity: 1,
      right: "0%",
      duration: 1.2,
      onComplete: () => {
        video?.play().catch(() => {});
      }
    }, "state4+=0.3");
    mainTimeline.to(content, { left: "0%", paddingTop: "3.5rem", paddingLeft: "0", duration: 1 }, "state4");
    mainTimeline.to(container, { minHeight: "560px", duration: 1 }, "state4");

    // Intersection observer or click to trigger animation automatically
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            setAnimationStarted(true);
            setTimeout(() => {
              mainTimeline.play();
            }, 500);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(container);

    const handleClick = () => {
      mainTimeline.restart();
      video?.play().catch(() => {});
    };

    container.addEventListener("click", handleClick);

    return () => {
      observer.disconnect();
      container.removeEventListener("click", handleClick);
      mainTimeline.kill();
    };
  }, [animationStarted]);

  return (
    <div ref={containerRef} className="animated_container" id="container">
        <div className="inner_container">
          
          <div ref={contentRef} className="animated_content">
            <h1 ref={titleRef} className="animated_title">
              <span ref={enableRef} className="enable">{textContent.enable}</span>
              <span ref={changeRef} className="change">{textContent.change}</span>
              <span ref={forTextRef} className="for-text">{textContent.for_text}</span>
              <span ref={earthRef} className="a-better-earth"> {textContent.a_better_earth}</span>
            </h1>
            <p ref={descRef} className="animated_description" suppressHydrationWarning>
              {textContent.description}
            </p>
          </div>

          {/* Image 1: Fades in during State 2 */}
          <div ref={image1Ref} className="image-container" id="image1">
            <img
              src="/hero_plants.png"
              alt="Landscape Architecture"
            />
          </div>

          {/* Image 2: Visual card playing during State 4 */}
          <div ref={image2Ref} className="image-container" id="image2">
            <img
              src="/featured_plant.png"
              alt="Architectural Botany"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
  );
}
