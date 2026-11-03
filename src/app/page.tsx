import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import BookingForm from "@/components/BookingForm";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BrandMarquee from "@/components/BrandMarquee";
import ServiceShowcase from "@/components/ServiceShowcase";
import CustomerMotion from "@/components/CustomerMotion";
import MobileQuickActions from "@/components/MobileQuickActions";
import SectionRail from "@/components/SectionRail";

export const metadata: Metadata = {
  title: "MR MOBILE WALA REPAIRS | Buy, Sell & Repair Mobile Phones in Rewa",
  description:
    "Mobile repair, buying and selling in Rewa. Simple booking and personal help from MR MOBILE WALA REPAIRS.",
  alternates: {
    canonical: "/",
  },
};

type HomePageProps = {
  searchParams: Promise<{ service?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { service } = await searchParams;
  const initialService =
    service === "buy"
      ? "Buy Mobile"
      : service === "sell"
        ? "Sell Mobile"
        : "Repair Mobile";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MR MOBILE WALA REPAIRS",
    url: "https://mr-mobile-wala-repairs.vercel.app",
    telephone: "+919131383323",
    description:
      "Mobile phone repair, buying and selling enquiries in Rewa, Madhya Pradesh.",
    areaServed: {
      "@type": "City",
      name: "Rewa",
      containedInPlace: {
        "@type": "State",
        name: "Madhya Pradesh",
      },
    },
    sameAs: ["https://instagram.com/mrmobilewala.2.0"],
  };

  return (
    <div className="customer-site min-h-screen overflow-x-clip bg-white pb-20 text-[#1d1d1f] sm:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Navbar />
      <CustomerMotion>
        <main>
          <div id="top" className="scroll-mt-20"><VideoHero /></div>
          <div className="customer-secondary-section"><BrandMarquee /></div>
          <ServiceShowcase />
          <BookingForm initialService={initialService} />
        </main>
        <div id="why" className="customer-secondary-section"><WhyChooseUs /></div>
        <div id="faq" className="scroll-mt-20 customer-secondary-section"><FAQ /></div>
        <Footer />
      </CustomerMotion>
      <SectionRail />
      <MobileQuickActions />
    </div>
  );
}
