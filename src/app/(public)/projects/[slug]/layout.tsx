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
      select: { name: true, category: true, challenges: true, solution: true, imageUrl: true, location: true },
    });

    if (project) {
      const title = `${project.name} - ${project.category}`;
      const description = project.challenges || `${project.location || "ঢাকা"} এ এ আর গ্রিন গার্ডেনের আধুনিক ল্যান্ডস্কেপ স্থাপত্য প্রজেক্ট।`;
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "article",
          images: project.imageUrl
            ? [
                {
                  url: project.imageUrl,
                  alt: project.name,
                },
              ]
            : undefined,
        },
      };
    }
  } catch {
    // fallback
  }

  const cleanTitle = slug.replace(/-/g, " ").toUpperCase();
  return {
    title: `${cleanTitle} - প্রজেক্ট বিবরণ`,
    description: "এ আর গ্রিন গার্ডেনের প্রিমিয়াম ল্যান্ডস্কেপ আর্কিটেকচার প্রকল্প কেস স্টাডি।",
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
      select: { name: true, category: true, imageUrl: true, location: true },
    });
    if (proj) {
      projectLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: proj.name,
        genre: proj.category,
        image: proj.imageUrl,
        contentLocation: proj.location || "Dhaka, Bangladesh",
        creator: {
          "@type": "Organization",
          name: "A R Green Garden",
        },
      };
    }
  } catch {
    // ignore
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
