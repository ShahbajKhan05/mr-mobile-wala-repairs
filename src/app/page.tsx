import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import BookingForm from "@/components/BookingForm";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BrandMarquee from "@/components/BrandMarquee";

export const metadata: Metadata = {
  title: "MR MOBILE WALA | Buy, Sell & Repair Mobile Phones in Rewa",
  description:
    "Looking for mobile phone repair in Rewa? Contact MR MOBILE WALA for mobile repair enquiries, and help with buying or selling phones.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden glass-page text-slate-800">
      <Navbar />
      <main>
        <VideoHero />
        <BrandMarquee />
        <BookingForm />
      </main>
      <WhyChooseUs />
      <FAQ />
      <Footer />
    </div>
  );
}
