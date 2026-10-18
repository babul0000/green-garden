import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "প্রজেক্ট মাস্টারপ্ল্যান ও ল্যান্ডস্কেপ পোর্টফোলিও",
  description: "বাংলাদেশের শীর্ষস্থানীয় আবাসিক, বাণিজ্যিক ও রিসোর্ট ল্যান্ডস্কেপ আর্কিটেকচার প্রকল্পের গ্যালারি ও কেস স্টাডি।",
  openGraph: {
    title: "প্রজেক্ট মাস্টারপ্ল্যান ও ল্যান্ডস্কেপ পোর্টফোলিও | AR Green Garden",
    description: "বাংলাদেশের শীর্ষস্থানীয় আবাসিক, বাণিজ্যিক ও রিসোর্ট ল্যান্ডস্কেপ আর্কিটেকচার প্রকল্পের গ্যালারি ও কেস স্টাডি।",
    images: [
      {
        url: "/hero_plants.png",
        alt: "AR Green Garden Landscape Portfolio",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "A R Green Garden",
  image: "/hero_plants.png",
  telephone: "01883012641",
  email: "info@argreengarden.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "42/A, Road 9/A, Dhanmondi",
    addressLocality: "Dhaka",
    postalCode: "1209",
    addressCountry: "BD",
  },
  priceRange: "$$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "128",
    bestRating: "5",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
