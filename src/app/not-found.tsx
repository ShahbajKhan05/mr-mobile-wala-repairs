
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-6">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-9 flex justify-center">
          <Image
            src="/w.svg"
            alt="MR MOBILE WALA REPAIRS"
            width={100}
            height={100}
            priority
            className="h-24 w-24 object-contain"
          />
        </div>

        {/* English message */}
        <h1 className="text-2xl font-semibold tracking-tight text-[#202B32] sm:text-3xl">
          This Page Is Coming Soon
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#777D80]">
          We&apos;re working on something for you. Please be patient and
          check back soon. Thank you for your understanding.
        </p>

        {/* Divider */}
        <div className="mx-auto my-7 h-px w-12 bg-[#C5A36A]" />

        {/* Hindi message */}
        <h2 className="text-xl font-semibold text-[#202B32]">
          यह पेज जल्द ही उपलब्ध होगा
        </h2>

        <p className="mt-4 text-sm leading-8 text-[#777D80]">
          हम आपके लिए कुछ बेहतर तैयार कर रहे हैं।
          कृपया थोड़ा धैर्य रखें और जल्द ही दोबारा आएँ।
          आपके सहयोग के लिए धन्यवाद।
        </p>

        {/* Brand */}
        {/* Logos */}
<div className="mb-9 flex flex-col items-center gap-5">
  
  {/* Original MR MOBILE WALA REPAIRS logo */}
  <Image
    src="/mr-mobile-wala-logo.png"
    alt="MR MOBILE WALA REPAIRS"
    width={220}
    height={90}
    priority
    className="h-auto w-52 object-contain"
  />
</div>
      </div>
    </main>
  );
}