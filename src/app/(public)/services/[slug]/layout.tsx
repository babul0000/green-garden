import type { Metadata } from "next";
import React from "react";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await prisma.service.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: { label: true, desc: true, icon: true, bannerImage: true },
    });

    if (service) {
      const title = service.label;
      const description = service.desc || "এ আর গ্রিন গার্ডেনের প্রিমিয়াম ল্যান্ডস্কেপ ও গার্ডেন ডিজাইন সার্ভিস।";
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: service.bannerImage ? [{ url: service.bannerImage, alt: service.label }] : undefined,
        },
      };
    }
  } catch {
    // fallback
  }

  const cleanTitle = slug.replace(/-/g, " ");
  return {
    title: `${cleanTitle} - সার্ভিস বিস্তারিত`,
    description: "এ আর গ্রিন গার্ডেনের প্রিমিয়াম ল্যান্ডস্কেপ ও বায়োফিলিক সার্ভিস।",
  };
}

export default async function ServiceDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let serviceLd: any = null;

  try {
    const serv = await prisma.service.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: { label: true, desc: true, bannerImage: true },
    });
    if (serv) {
      serviceLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serv.label,
        description: serv.desc || "Landscape architecture service in Bangladesh",
        image: serv.bannerImage || undefined,
        provider: {
          "@type": "LocalBusiness",
          name: "A R Green Garden",
          telephone: "01883012641",
        },
      };
    }
  } catch {
    // ignore
  }

  return (
    <>
      {serviceLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
      )}
      {children}
    </>
  );
}
