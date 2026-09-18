import type { Metadata } from "next";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR Green Garden - Premium Landscaping & Garden Design",
  description: "World-class landscaping, garden design, and interior plant styling services in Bangladesh. Bring nature into your space.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
