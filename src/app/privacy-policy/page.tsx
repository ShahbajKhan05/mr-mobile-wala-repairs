
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the privacy policy of MR MOBILE WALA REPAIRS and understand how your booking information is handled.",
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "When you contact us or submit a booking request, we may collect your name, phone number, mobile phone model, service requirements and any other information you choose to provide.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use the information you provide to respond to enquiries, discuss mobile repair requirements, process Buy or Sell requests, coordinate appointments and provide customer support.",
  },
  {
    title: "3. WhatsApp Communication",
    content:
      "When you submit a booking request through our website, you may be redirected to WhatsApp with a pre-filled message. Your message is sent only when you choose to send it. WhatsApp is a third-party service and its own privacy policy applies to your use of that platform.",
  },
  {
    title: "4. Information Sharing",
    content:
      "We do not intentionally sell your personal information. Information may be shared when necessary to respond to your request, provide a service, comply with applicable law or protect our legitimate rights.",
  },
  {
    title: "5. Data Security",
    content:
      "We take reasonable steps to protect the information handled by our business. However, no method of online transmission or electronic storage can be guaranteed to be completely secure.",
  },
  {
    title: "6. Data Retention",
    content:
      "We retain customer and service information only for as long as reasonably necessary for business operations, customer support, record keeping and legal requirements.",
  },
  {
    title: "7. Your Choices",
    content:
      "You may contact us to ask about the personal information you have shared with us or to request correction of inaccurate information, subject to applicable legal and business record-keeping requirements.",
  },
  {
    title: "8. Third-Party Services",
    content:
      "Our website may link to third-party services such as WhatsApp. We are not responsible for the privacy practices or content of external services.",
  },
  {
    title: "9. Policy Updates",
    content:
      "We may update this Privacy Policy when our business practices or legal requirements change. The latest version will be published on this page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-5 py-14 text-[#202B32] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-[#777E81] transition hover:text-[#B08D57]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="rounded-[28px] border border-[#EAE5DB] bg-white p-7 shadow-[0_15px_50px_rgba(32,43,50,0.04)] sm:p-12">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F1E7] text-[#B08D57]">
            <ShieldCheck size={28} strokeWidth={1.5} />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B08D57]">
            MR MOBILE WALA REPAIRS
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#777E81] sm:text-base">
            Your privacy matters to us. This policy explains what information
            we may collect when you use our website and how we use it.
          </p>

          <div className="my-9 h-px bg-[#EEEAE2]" />

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-[#202B32]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-8 text-[#70787B]">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-[#F8F6F1] p-5">
            <h2 className="font-semibold">Contact Us</h2>
            <p className="mt-2 text-sm leading-7 text-[#70787B]">
              If you have questions about this Privacy Policy, contact MR
              MOBILE WALA.
            </p>
            <a
              href="https://wa.me/919131383323"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-[#A17D45] underline underline-offset-4"
            >
              Contact us on WhatsApp
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#9A9D9B]">
         © 2026 MR MOBILE WALA REPAIRS. All rights reserved.
        </p>
      </div>
    </main>
  );
}
