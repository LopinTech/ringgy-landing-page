import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const GA_MEASUREMENT_ID = "G-FJRMDYW88V";

// Page-specific title/description/OG come from app/page.tsx (see lib/landing.ts).
export const metadata: Metadata = {
  metadataBase: new URL("https://ringgy.ai"),
  keywords: [
    "AI receptionist",
    "home service AI",
    "plumbing answering service",
    "HVAC receptionist",
    "virtual phone answering",
    "after-hours call answering",
    "automated appointment booking",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} antialiased`}>
      <head>
        {/* RB2B visitor identification */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(key) {if (window.reb2b) return;window.reb2b = {loaded: true};var s = document.createElement("script");s.async = true;s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);}("0NW1GHJQ4XO4");`,
          }}
        />
      </head>
      <body className="font-sans selection:bg-primary/20 selection:text-brand">
        {children}
      </body>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </html>
  );
}
