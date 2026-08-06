import "./globals.css";

export const metadata = {
  title: "AR Green Garden - Premium Landscaping & Garden Design",
  description: "World-class landscaping, garden design, and interior plant styling services in Bangladesh. Bring nature into your space.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
