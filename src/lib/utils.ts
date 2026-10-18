export function cn(...inputs: (string | boolean | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Optimizes Cloudinary and external image URLs with auto-format, auto-quality, and max width.
 */
export function optimizeImageUrl(url?: string | null, width: number = 1200): string {
  if (!url || typeof url !== "string") return "/hero_plants.png";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto") || url.includes("/upload/w_")) {
      return url;
    }
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}

