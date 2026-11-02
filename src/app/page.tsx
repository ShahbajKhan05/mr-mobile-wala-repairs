import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import BookingForm from "@/components/BookingForm";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BrandMarquee from "@/components/BrandMarquee";
import ServiceShowcase from "@/components/ServiceShowcase";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "MR MOBILE WALA REPAIRS | Buy, Sell & Repair Mobile Phones in Rewa",
  description:
    "Looking for mobile phone repair in Rewa? Contact MR MOBILE WALA REPAIRS for mobile repair enquiries, and help with buying or selling phones.",
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
        <ServiceShowcase />
        <BookingForm />
      </main>
      <Testimonials />
      <WhyChooseUs />
      <FAQ />
      <Footer />
    </div>
  );
}
