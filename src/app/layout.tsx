import type { Metadata } from "next";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR Green Garden - ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেন ডিজাইন | Bangladesh",
  description: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ স্থাপত্য, ছাদবাগান, বায়োফিলিক গ্রিন ওয়াল ও আধুনিক বৃক্ষ সেবা প্রতিষ্ঠান।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
