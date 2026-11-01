
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import BookingForm from "@/components/BookingForm";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BrandMarquee from "@/components/BrandMarquee";

export const metadata: Metadata = {
  title: "MR MOBILE WALA | Buy, Sell & Repair Mobile Phones",
  description:
    "Buy, sell and repair mobile phones with MR MOBILE WALA. Book your mobile service quickly through WhatsApp.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAF8] text-[#202B32]">
      {/* Navigation */}
      <Navbar />

      <main>
        
        {/* Cinematic Video Hero */}
        <VideoHero />
        {/* Branding & Service Highlights */}
        <BrandMarquee />

        {/* Glassmorphism Booking Form */}
        <BookingForm />
      </main>
      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* English + Hindi FAQ */}
      <FAQ />

      {/* Website Footer */}
      <Footer />
    </div>
  );
}
