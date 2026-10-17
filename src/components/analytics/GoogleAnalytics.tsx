import React from "react";
import Script from "next/script";

interface GoogleAnalyticsProps {
  gaId?: string | null;
}

/**
 * Conditionally loads Google Analytics 4 (GA4) script only when a valid GA ID is present in Settings.
 * If no ID is configured, this component renders absolutely nothing.
 */
export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId || typeof gaId !== "string" || !gaId.trim()) {
    return null;
  }

  const cleanId = gaId.trim();

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${cleanId}`}
      />
      <Script id="google-analytics-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${cleanId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
