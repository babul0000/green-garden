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
    const project = await prisma.project.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: { name: true, titleBn: true, description: true, descBn: true, afterImage: true, beforeImage: true },
    });

    if (project) {
      const title = project.titleBn || project.name;
      const description = project.descBn || project.description || "এ আর গ্রিন গার্ডেনের প্রিমিয়াম ল্যান্ডস্কেপ আর্কিটেকচার ও ছাদ বাগান প্রজেক্ট।";
      const image = project.afterImage || project.beforeImage || "/hero_plants.png";

      return {
        title: `${title} | ল্যান্ডস্কেপ আর্কিটেকচার প্রজেক্ট`,
        description,
        openGraph: {
          title: `${title} | AR Green Garden`,
          description,
          images: [{ url: image, alt: title }],
        },
      };
    }
  } catch {
    // fallback
  }

  const cleanTitle = slug.replace(/-/g, " ");
  return {
    title: `${cleanTitle} - প্রজেক্ট বিবরণী | AR Green Garden`,
    description: "এ আর গ্রিন গার্ডেনের প্রিমিয়াম ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেন কেস স্টাডি।",
  };
}

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let projectLd: any = null;

  try {
    const proj = await prisma.project.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        reviews: {
          where: { status: "Approved" },
          select: { rating: true },
        },
      },
    });

    if (proj) {
      const avgRating = proj.reviews.length > 0
        ? (proj.reviews.reduce((acc, r) => acc + r.rating, 0) / proj.reviews.length).toFixed(1)
        : "5.0";

      projectLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `A R Green Garden - ${proj.name}`,
        description: proj.description || proj.descBn || "Premium Landscape Architecture Project",
        image: proj.afterImage || proj.beforeImage || "/hero_plants.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: proj.location || "Dhanmondi",
          addressLocality: "Dhaka",
          addressCountry: "BD",
        },
        telephone: "01883012641",
        ...(proj.reviews.length > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: avgRating,
                reviewCount: String(proj.reviews.length),
                bestRating: "5",
              },
            }
          : {}),
      };
    }
  } catch {
    // fallback
  }

  return (
    <>
      {projectLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectLd) }}
        />
      )}
      {children}
    </>
  );
}
