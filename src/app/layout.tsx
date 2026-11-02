import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import IntroLoader from "@/components/IntroLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://mr-mobile-wala-repairs.vercel.app";
const logoUrl = "/mr-mobile-wala-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MR MOBILE WALA REPAIRS | Mobile Repair in Rewa",
    template: "%s | MR MOBILE WALA REPAIRS",
  },
  description:
    "MR MOBILE WALA REPAIRS in Rewa, Madhya Pradesh. Get help with mobile phone repair, buying and selling phones, and repair service enquiries.",
  applicationName: "MR MOBILE WALA REPAIRS",
  keywords: [
    "MR MOBILE WALA REPAIRS",
    "mobile repair in Rewa",
    "mobile phone repair Rewa",
    "phone repair",
    "buy sell mobile phones",
    "mobile repair shop",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "MR MOBILE WALA REPAIRS",
    title: "MR MOBILE WALA REPAIRS",
    description:
      "Mobile phone repair, buying and selling enquiries in Rewa, Madhya Pradesh.",
    locale: "en_IN",
    images: [
      {
        url: logoUrl,
        alt: "MR MOBILE WALA REPAIRS logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MR MOBILE WALA REPAIRS",
    description:
      "Mobile phone repair, buying and selling enquiries in Rewa, Madhya Pradesh.",
    images: [logoUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f8ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#f6f8ff] font-sans text-slate-800 antialiased`}
      >
        {children}
        <IntroLoader />
      </body>
    </html>
  );
}
