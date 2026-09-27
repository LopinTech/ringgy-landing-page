import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

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
  icons: {
    icon: "/assets/images/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} antialiased`}>
      <body className="font-sans selection:bg-primary/20 selection:text-brand">
        {children}
      </body>
    </html>
  );
}
