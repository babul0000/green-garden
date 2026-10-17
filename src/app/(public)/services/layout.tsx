import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেনিং সার্ভিসেস",
  description: "ছাদ বাগান, ভার্টিক্যাল গ্রিন ওয়াল, সুইমিং পুল ল্যান্ডস্কেপিং ও স্মার্ট ড্রিপ ইরিগেশন সেবা।",
  openGraph: {
    title: "ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেনিং সার্ভিসেস | AR Green Garden",
    description: "ছাদ বাগান, ভার্টিক্যাল গ্রিন ওয়াল, সুইমিং পুল ল্যান্ডস্কেপিং ও স্মার্ট ড্রিপ ইরিগেশন সেবা।",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?q=80&w=1200",
        alt: "AR Green Garden Services",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Landscape Architecture & Urban Gardening",
  serviceType: "Landscape Architecture and Horticultural Engineering",
  provider: {
    "@type": "LocalBusiness",
    name: "A R Green Garden",
    telephone: "01883012641",
    email: "info@argreengarden.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "42/A, Road 9/A, Dhanmondi",
      addressLocality: "Dhaka",
      postalCode: "1209",
      addressCountry: "BD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
      bestRating: "5",
    },
  },
  areaServed: {
    "@type": "Country",
    name: "Bangladesh",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
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
