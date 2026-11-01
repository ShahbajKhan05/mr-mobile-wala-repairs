
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import IntroLoader from "@/components/IntroLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MR MOBILE WALA REPAIRS | Mobile Repair Management",
    template: "%s | MR MOBILE WALA",
  },
  description:
    "MR MOBILE WALA REPAIRS — Buy, sell and repair mobile phones with a smarter repair management experience.",
  applicationName: "MR MOBILE WALA REPAIRS",
  keywords: [
    "MR MOBILE WALA",
    "Mobile Repair",
    "Mobile Repair Management",
    "Repair Shop Management",
    "Phone Repair",
    "Mobile Accessories",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAF8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#FAFAF8] font-sans text-[#202B32] antialiased`}
      >
        {children}

        {/* Website intro — once per browser tab session */}
        <IntroLoader />
      </body>
    </html>
  );
}
