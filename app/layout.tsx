import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PhaseProvider } from "@/lib/phase";
import Nav from "@/components/Nav";
import { SITE, SITE_URL, jsonLd } from "@/lib/seo";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tom Laroc — Design-led AI Strategy & Creative Direction · Miami",
    template: "%s · Tom Laroc",
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.brand,
  authors: [{ name: "Tom Laroc", url: SITE_URL }],
  creator: "Tom Laroc",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.brand,
    title: "Tom Laroc — Design-led AI Strategy & Creative Direction",
    description: SITE.description,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tom Laroc — Design-led AI Strategy & Creative Direction",
    description: SITE.tagline,
    creator: "@TomLaroc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
      </head>
      <body className="grain">
        <PhaseProvider>
          <SmoothScroll>
            <Nav />
            {children}
          </SmoothScroll>
        </PhaseProvider>
      </body>
    </html>
  );
}
