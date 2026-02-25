import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NativeBridge from "@/components/NativeBridge";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://map.nobigbendwall.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "See the Impact | Big Bend National Park",
  description:
    "Interactive map of GPS-tagged field footage from Big Bend National Park. See what a border wall would destroy.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "No Big Bend Wall",
    title: "See the Impact | Big Bend National Park",
    description:
      "Interactive map of GPS-tagged field footage from Big Bend National Park. See what a border wall would destroy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Interactive map showing GPS-tagged footage from Big Bend National Park",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "See the Impact | Big Bend National Park",
    description:
      "Interactive map of GPS-tagged field footage from Big Bend National Park. See what a border wall would destroy.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {plausibleDomain && (
          <script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="bg-[#0d0b09] text-white antialiased font-sans">
        <NativeBridge />
        {children}
      </body>
    </html>
  );
}
