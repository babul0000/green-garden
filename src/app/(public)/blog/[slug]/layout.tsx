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
    const blog = await prisma.blog.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: { title: true, content: true, coverImage: true, author: true },
    });

    if (blog) {
      const title = blog.title;
      const description = blog.content.slice(0, 160).replace(/[#*`_]/g, "");
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "article",
          images: blog.coverImage
            ? [
                {
                  url: blog.coverImage,
                  alt: blog.title,
                },
              ]
            : undefined,
        },
      };
    }
  } catch {
    // fallback
  }

  return {
    title: "বোটানিক্যাল জার্নাল নিবন্ধ",
    description: "গাছপালা ও ল্যান্ডস্কেপ আর্কিটেকচার সম্পর্কিত বিস্তারিত আর্টিকেল।",
  };
}

export default async function BlogDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let articleLd: any = null;

  try {
    const b = await prisma.blog.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: { title: true, coverImage: true, author: true, createdAt: true, updatedAt: true },
    });
    if (b) {
      articleLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: b.title,
        image: b.coverImage || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200",
        author: {
          "@type": "Person",
          name: b.author || "AR Green Garden Botanical Team",
        },
        publisher: {
          "@type": "Organization",
          name: "A R Green Garden",
        },
        datePublished: b.createdAt.toISOString(),
        dateModified: b.updatedAt.toISOString(),
      };
    }
  } catch {
    // ignore
  }

  return (
    <>
      {articleLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      )}
      {children}
    </>
  );
}
