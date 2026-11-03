"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

const PRIVACY = [
  ["Information We Collect", "When you contact us or submit a booking request, we may collect your name, phone number, mobile phone model, service requirements and any other information you choose to provide.", "हमसे संपर्क करने या बुकिंग रिक्वेस्ट भेजने पर आपका नाम, फोन नंबर, मोबाइल मॉडल, सर्विस की ज़रूरत और आपके द्वारा दी गई अन्य जानकारी ली जा सकती है।"],
  ["How We Use Your Information", "We use the information you provide to respond to enquiries, discuss mobile repair requirements, process Buy or Sell requests, coordinate appointments and provide customer support.", "आपकी जानकारी का उपयोग सवालों का जवाब देने, मोबाइल रिपेयर पर बात करने, फोन खरीदने या बेचने की रिक्वेस्ट संभालने, समय तय करने और ग्राहक सहायता देने के लिए किया जाता है।"],
  ["WhatsApp Communication", "When you submit a booking request through our website, you may be redirected to WhatsApp with a pre-filled message. Your message is sent only when you choose to send it. WhatsApp is a third-party service and its own privacy policy applies to your use of that platform.", "वेबसाइट से बुकिंग भेजने पर WhatsApp खुलेगा और मैसेज पहले से लिखा हो सकता है। मैसेज तभी भेजा जाएगा जब आप खुद Send करेंगे। WhatsApp एक अलग सेवा है और उसकी अपनी प्राइवेसी पॉलिसी लागू होती है।"],
  ["Information Sharing", "We do not intentionally sell your personal information. Information may be shared when necessary to respond to your request, provide a service, comply with applicable law or protect our legitimate rights.", "हम आपकी निजी जानकारी बेचते नहीं हैं। आपकी रिक्वेस्ट का जवाब देने, सेवा देने, कानून का पालन करने या अपने वैध अधिकारों की सुरक्षा के लिए ज़रूरत पड़ने पर जानकारी साझा की जा सकती है।"],
  ["Data Security", "We take reasonable steps to protect the information handled by our business. However, no method of online transmission or electronic storage can be guaranteed to be completely secure.", "हम आपकी जानकारी सुरक्षित रखने के लिए उचित कदम उठाते हैं। फिर भी इंटरनेट या इलेक्ट्रॉनिक स्टोरेज का कोई तरीका पूरी तरह सुरक्षित होने की गारंटी नहीं देता।"],
  ["Data Retention", "We retain customer and service information only for as long as reasonably necessary for business operations, customer support, record keeping and legal requirements.", "ग्राहक और सर्विस की जानकारी उतने समय तक रखी जाती है जितनी व्यापार, सहायता, रिकॉर्ड और कानूनी ज़रूरतों के लिए उचित हो।"],
  ["Your Choices", "You may contact us to ask about the personal information you have shared with us or to request correction of inaccurate information, subject to applicable legal and business record-keeping requirements.", "आपने जो निजी जानकारी हमें दी है उसके बारे में पूछ सकते हैं या गलत जानकारी ठीक करवाने के लिए संपर्क कर सकते हैं। यह लागू कानून और रिकॉर्ड रखने की ज़रूरतों के अधीन होगा।"],
  ["Third-Party Services", "Our website may link to third-party services such as WhatsApp. We are not responsible for the privacy practices or content of external services.", "हमारी वेबसाइट पर WhatsApp जैसी दूसरी सेवाओं के लिंक हो सकते हैं। उन बाहरी सेवाओं की प्राइवेसी और सामग्री की ज़िम्मेदारी हमारी नहीं है।"],
  ["Policy Updates", "We may update this Privacy Policy when our business practices or legal requirements change. The latest version will be published on this page.", "व्यापार या कानूनी ज़रूरतों में बदलाव होने पर हम इस प्राइवेसी पॉलिसी को अपडेट कर सकते हैं। नया संस्करण इसी पेज पर मिलेगा।"],
] as const;

const TERMS = [
  ["Booking Requests", "Submitting a booking request through our website is an enquiry and does not automatically confirm an appointment, repair order, purchase or sale. Our team may contact you to confirm the details.", "वेबसाइट पर बुकिंग रिक्वेस्ट भेजना केवल जानकारी माँगना है। इससे अपॉइंटमेंट, रिपेयर ऑर्डर, खरीद या बिक्री अपने आप पक्की नहीं होती। जानकारी कन्फर्म करने के लिए हमारी टीम आपसे संपर्क कर सकती है।"],
  ["Repair Estimates", "Any repair price or estimate discussed before inspection is indicative and may change after the device is examined. We will communicate relevant changes and seek customer approval before proceeding with additional work.", "जांच से पहले बताया गया रिपेयर खर्च अनुमानित होता है। फोन की जांच के बाद खर्च बदल सकता है। अतिरिक्त काम शुरू करने से पहले हम बदलाव बताएँगे और आपकी मंज़ूरी लेंगे।"],
  ["Device Inspection and Repair", "Repair time depends on the device, fault, parts availability and workload. Some faults may only become apparent during inspection or repair. We will inform you if the scope of work changes.", "रिपेयर में लगने वाला समय फोन, खराबी, पार्ट्स की उपलब्धता और काम की मात्रा पर निर्भर करता है। जांच या रिपेयर के दौरान कुछ दूसरी खराबियाँ भी सामने आ सकती हैं। काम में बदलाव होने पर हम आपको बताएँगे।"],
  ["Customer Data and Backup", "Customers are responsible for backing up important data before handing over a device. Although reasonable care will be taken, MR MOBILE WALA REPAIRS cannot guarantee that data will remain intact during diagnosis or repair. Please remove sensitive information where possible.", "फोन जमा करने से पहले अपने ज़रूरी डेटा का बैकअप लेना ग्राहक की ज़िम्मेदारी है। पूरी सावधानी रखने के बावजूद जांच या रिपेयर के दौरान डेटा सुरक्षित रहने की गारंटी नहीं दी जा सकती। संभव हो तो निजी जानकारी हटा दें।"],
  ["Device Access and Security", "If device access is required for diagnosis or testing, customers should discuss the requirement with our team. Do not share sensitive passwords or account credentials unless absolutely necessary and through an agreed, secure process.", "जांच या टेस्टिंग के लिए फोन खोलना ज़रूरी हो तो हमारी टीम से बात करें। बहुत ज़रूरी न हो तो पासवर्ड या अकाउंट की निजी जानकारी साझा न करें।"],
  ["Buy and Sell Requests", "Buying or selling a phone is subject to physical inspection, device condition, ownership verification, agreed pricing and final confirmation by both parties. A website enquiry alone does not guarantee a transaction.", "फोन खरीदना या बेचना उसकी जांच, हालत, मालिकाना पुष्टि, तय कीमत और दोनों पक्षों की अंतिम सहमति पर निर्भर है। केवल वेबसाइट पर रिक्वेस्ट भेजने से सौदा पक्का नहीं होता।"],
  ["Payments", "Payment terms will be communicated before or at the time of service confirmation. Customers should verify the amount and payment status with our team and retain their bill or receipt.", "पेमेंट की जानकारी सर्विस कन्फर्म करते समय दी जाएगी। ग्राहक हमारी टीम से रकम और पेमेंट स्टेटस की पुष्टि करें और बिल या रसीद संभालकर रखें।"],
  ["Warranty", "Any repair warranty, its duration, coverage and exclusions will be specified on the invoice or provided in writing at the time of service. Warranty does not automatically cover every repair, part or type of damage.", "रिपेयर की वारंटी, उसकी अवधि, क्या-क्या शामिल है और क्या शामिल नहीं है — यह बिल या लिखित जानकारी में बताया जाएगा। हर रिपेयर, पार्ट या नुकसान पर वारंटी अपने आप लागू नहीं होती।"],
  ["Collection of Devices", "Customers should collect their devices after receiving a completion notification and verify the device condition and repair work at collection. Any applicable collection or storage arrangements will be communicated by our team.", "काम पूरा होने का मैसेज मिलने के बाद ग्राहक अपना फोन ले जाएँ और लेते समय फोन की हालत व रिपेयर चेक करें। फोन लेने या स्टोरेज से जुड़ी कोई व्यवस्था होगी तो टीम बताएगी।"],
  ["Website and Third-Party Services", "We aim to keep website information accurate, but service details, prices and availability may change. WhatsApp and other external services are governed by their respective terms and policies.", "हम वेबसाइट की जानकारी सही रखने की कोशिश करते हैं, लेकिन सर्विस, कीमत और उपलब्धता बदल सकती है। WhatsApp और दूसरी बाहरी सेवाओं पर उनकी अपनी शर्तें और नीतियाँ लागू होती हैं।"],
  ["Changes to These Terms", "We may revise these Terms & Conditions when our services or applicable requirements change. The updated version will be published on this page.", "हमारी सेवाओं या लागू ज़रूरतों में बदलाव होने पर नियम और शर्तें अपडेट की जा सकती हैं। नया संस्करण इसी पेज पर प्रकाशित होगा।"],
] as const;

export default function CustomerLegalPage({ type }: { type: "privacy" | "terms" }) {
  const { language } = useCustomerLanguage();
  const hindi = language === "hi";
  const privacy = type === "privacy";
  const sections = privacy ? PRIVACY : TERMS;
  const title = privacy ? (hindi ? "गोपनीयता नीति" : "Privacy Policy") : (hindi ? "नियम और शर्तें" : "Terms & Conditions");
  const intro = privacy
    ? (hindi ? "आपकी निजता हमारे लिए ज़रूरी है। यहाँ बताया गया है कि वेबसाइट पर दी गई जानकारी का उपयोग कैसे होता है।" : "Your privacy matters to us. This policy explains what information we may collect when you use our website and how we use it.")
    : (hindi ? "मोबाइल रिपेयर, खरीदने या बेचने की सेवा लेने से पहले कृपया ये नियम पढ़ें।" : "Please read these terms carefully before using our mobile repair, buying or selling services.");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFAF8] px-5 pb-12 pt-24 text-[#202B32] sm:px-8 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#777E81] transition hover:text-[#B08D57]"><ArrowLeft size={16} />{hindi ? "होम पर वापस जाएँ" : "Back to Home"}</Link>
          <div className="rounded-[28px] border border-[#EAE5DB] bg-white p-7 shadow-[0_15px_50px_rgba(32,43,50,0.04)] sm:p-12">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F1E7] text-[#B08D57]">{privacy ? <ShieldCheck size={28} strokeWidth={1.5} /> : <FileText size={28} strokeWidth={1.5} />}</div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B08D57]">MR MOBILE WALA REPAIRS</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#777E81] sm:text-base">{intro}</p>
            <div className="my-9 h-px bg-[#EEEAE2]" />
            <div className="space-y-8">
              {sections.map(([heading, english, hindiText], index) => (
                <section key={heading}>
                  <h2 className="text-lg font-semibold text-[#202B32]">{index + 1}. {hindi ? (privacy ? ["हम कौन-सी जानकारी लेते हैं","जानकारी का उपयोग","WhatsApp पर बातचीत","जानकारी साझा करना","डेटा की सुरक्षा","जानकारी कितने समय तक रखी जाती है","आपके विकल्प","दूसरी सेवाएँ","नीति में बदलाव"][index] : ["बुकिंग रिक्वेस्ट","रिपेयर का अनुमानित खर्च","फोन की जांच और रिपेयर","ग्राहक का डेटा और बैकअप","फोन का एक्सेस और सुरक्षा","फोन खरीदने और बेचने की रिक्वेस्ट","पेमेंट","वारंटी","फोन वापस लेना","वेबसाइट और दूसरी सेवाएँ","नियमों में बदलाव"][index]) : heading}</h2>
                  <p className="mt-3 text-sm leading-8 text-[#70787B]">{hindi ? hindiText : english}</p>
                </section>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-[#F8F6F1] p-5">
              <h2 className="font-semibold">{hindi ? "संपर्क करें" : "Contact Us"}</h2>
              <p className="mt-2 text-sm leading-7 text-[#70787B]">{hindi ? "कोई सवाल हो तो MR MOBILE WALA REPAIRS से संपर्क करें।" : "Contact MR MOBILE WALA REPAIRS if you have any questions."}</p>
              <a href="https://wa.me/919131383323" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#A17D45] underline underline-offset-4">{hindi ? "WhatsApp पर संपर्क करें" : "Contact us on WhatsApp"}</a>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-[#9A9D9B]">© 2026 MR MOBILE WALA REPAIRS. All rights reserved.</p>
        </div>
      </main>
    </>
  );
}
