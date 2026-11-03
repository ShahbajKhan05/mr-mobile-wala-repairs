"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CustomerLanguage = "hi" | "en";

const messages = {
  hi: {
    home: "होम", services: "सेवाएँ", track: "रिपेयर ट्रैक करें", warranty: "वारंटी कार्ड",
    contact: "संपर्क", admin: "एडमिन", book: "बुकिंग करें", getInTouch: "संपर्क करें",
    explore: "MR Mobile Wala देखें", menu: "मेन्यू", closeMenu: "मेन्यू बंद करें", openMenu: "मेन्यू खोलें",
    heroKicker: "रीवा में मोबाइल की दुकान", heroTitle: "मोबाइल की हर समस्या का समाधान।",
    heroCopy: "फोन ठीक करवाना हो, नया लेना हो या बेचना हो — हम आपकी मदद करेंगे।",
    chooseWork: "अपना काम चुनें", whatsapp: "WhatsApp करें", easyBooking: "आसान बुकिंग",
    buySellRepair: "खरीदें · बेचें · रिपेयर", brandTagline: "सही दाम। बेहतरीन काम।",
    serviceEyebrow: "आपको क्या करवाना है?", chooseService: "अपना काम चुनें",
    tapButton: "बस एक बटन दबाएँ", phoneRepair: "फोन रिपेयर", fixPhone: "फोन ठीक करवाएँ",
    buyPhone: "फोन खरीदें", newPhone: "नया फोन खरीदें", sellPhone: "फोन बेचें",
    sellYourPhone: "अपना फोन बेचें", bookNow: "बुक करें", viewPhones: "फोन देखें",
    trackStatus: "रिपेयर का स्टेटस देखना है?", trackingHelp: "अपनी रिपेयर की जानकारी यहाँ देखें",
    trackNow: "स्टेटस देखें", whyEyebrow: "आपका फोन, हमारी ज़िम्मेदारी", whyTitle: "हमें क्यों चुनें?",
    whyCopy: "सीधी बात, साफ जानकारी और ज़रूरत पड़ने पर मदद।",
    trust: "भरोसेमंद सेवा", trustDesc: "हम आपके फोन को ध्यान से संभालते हैं।",
    rightRepair: "सही रिपेयर", rightRepairDesc: "पहले समस्या समझते हैं, फिर रिपेयर का तरीका बताते हैं।",
    fairPrice: "साफ और सही दाम", fairPriceDesc: "काम शुरू करने से पहले आपको अनुमानित खर्च बताते हैं।",
    phoneOptions: "फोन के अच्छे विकल्प", phoneOptionsDesc: "फोन खरीदने या बेचने में आपकी मदद करते हैं।",
    nearbyHelp: "मदद बस एक मैसेज दूर", nearbyHelpDesc: "कोई सवाल हो तो WhatsApp पर बात करें।",
    question: "कोई सवाल है? हमसे बात करें।", directWhatsapp: "WhatsApp पर मैसेज भेजें",
    testimonialsEyebrow: "असली ग्राहक, उनकी अपनी बात", testimonialsTitle: "ग्राहक क्या कहते हैं?",
    testimonialsCopy: "हमारे ग्राहकों की छोटी-सी राय।", feedbackWelcome: "आपकी राय का स्वागत है",
    customerFeedback: "ग्राहक की राय", experience: "आपका अनुभव कैसा रहा?",
    tellFeedback: "अपनी राय हमें WhatsApp पर बताएँ।", sendFeedback: "राय भेजें",
    faqEyebrow: "क्या आपके मन में सवाल हैं?", faqTitle: "अक्सर पूछे जाने वाले सवाल",
    faqCopy: "हमारी मोबाइल सेवाओं से जुड़ी ज़रूरी जानकारी यहाँ पाएँ।",
    exploreAnswers: "जवाब देखें", closeFaq: "सवाल बंद करें", fullView: "सभी सवाल देखें",
    closeFullView: "वापस जाएँ", stillQuestions: "अभी भी सवाल है? WhatsApp पर हमसे संपर्क करें।",
    bookingTitle: "हम आपकी कैसे मदद करें?", bookingCopy: "कुछ आसान विकल्प चुनें। कोई मुश्किल फॉर्म नहीं।",
    chooseYourService: "अपनी सेवा चुनें", choosePhone: "अपना फोन चुनें",
    mobileBrand: "मोबाइल ब्रांड", selectBrand: "मोबाइल ब्रांड चुनें", enterBrand: "मोबाइल ब्रांड लिखें",
    selectModel: "मोबाइल मॉडल चुनें", chooseModel: "अपना मॉडल चुनें", enterModel: "फोन का सही मॉडल लिखें",
    problem: "फोन में क्या खराबी है?", selectOne: "एक चुनें", describeProblem: "खराबी के बारे में बताएँ",
    budget: "आपका बजट", condition: "फोन की हालत", expectedPrice: "आप कितने रुपये चाहते हैं?",
    contactDetails: "आपकी जानकारी", yourName: "आपका नाम", enterName: "अपना नाम लिखें",
    whatsappNumber: "WhatsApp नंबर", tenDigit: "10 अंकों का मोबाइल नंबर",
    sendBooking: "WhatsApp पर बुकिंग भेजें", noPayment: "अभी कोई पेमेंट नहीं। हम आपसे बात करके कन्फर्म करेंगे।",
    simpleBooking: "आसान बुकिंग · जल्दी जवाब · आपकी मदद",
    nameRequired: "नाम ज़रूरी है", step: "स्टेप",
    footerExplore: "जानकारी", footerVisit: "मिलें और संपर्क करें", footerInfo: "ज़रूरी जानकारी",
    footerDescription: "मोबाइल खरीदने, बेचने और रिपेयर कराने के लिए आपका भरोसेमंद ठिकाना।",
    footerTrust: "ग्राहक की सुविधा सबसे पहले", footerDetails: "काम की पूरी जानकारी",
    getHelp: "मदद चाहिए?", backHome: "होम पर जाएँ",
  },
  en: {
    home: "Home", services: "Services", track: "Track Repair", warranty: "Warranty Card",
    contact: "Contact", admin: "Admin", book: "Book a Service", getInTouch: "Get in touch",
    explore: "Explore MR Mobile Wala", menu: "MENU", closeMenu: "Close menu", openMenu: "Open menu",
    heroKicker: "Mobile shop in Rewa", heroTitle: "A solution for every mobile problem.",
    heroCopy: "Need a repair, a new phone, or want to sell yours? We are here to help.",
    chooseWork: "Choose a service", whatsapp: "Chat on WhatsApp", easyBooking: "Easy booking",
    buySellRepair: "Buy · Sell · Repair", brandTagline: "Fair price. Quality work.",
    serviceEyebrow: "What would you like to do?", chooseService: "Choose your service",
    tapButton: "Just tap one button", phoneRepair: "Phone Repair", fixPhone: "Get your phone fixed",
    buyPhone: "Buy a Phone", newPhone: "Find a new phone", sellPhone: "Sell a Phone",
    sellYourPhone: "Sell your phone", bookNow: "Book now", viewPhones: "View phones",
    trackStatus: "Want to check your repair status?", trackingHelp: "Check your repair progress here",
    trackNow: "Track now", whyEyebrow: "Your phone, our responsibility", whyTitle: "Why choose us?",
    whyCopy: "Clear communication, honest information and help when you need it.",
    trust: "Service you can trust", trustDesc: "We handle your phone with care.",
    rightRepair: "The right repair", rightRepairDesc: "We understand the issue first, then explain the repair options.",
    fairPrice: "Clear and fair pricing", fairPriceDesc: "We share an estimate before starting the work.",
    phoneOptions: "Great phone options", phoneOptionsDesc: "We help you buy or sell a phone.",
    nearbyHelp: "Help is one message away", nearbyHelpDesc: "Have a question? Talk to us on WhatsApp.",
    question: "Have a question? Talk to us.", directWhatsapp: "Send us a WhatsApp message",
    testimonialsEyebrow: "Real customers, real words", testimonialsTitle: "What do customers say?",
    testimonialsCopy: "A few words from our customers.", feedbackWelcome: "We welcome your feedback",
    customerFeedback: "Customer feedback", experience: "How was your experience?",
    tellFeedback: "Tell us what you think on WhatsApp.", sendFeedback: "Share feedback",
    faqEyebrow: "Have questions?", faqTitle: "Frequently asked questions",
    faqCopy: "Find helpful information about our mobile services.",
    exploreAnswers: "Explore answers", closeFaq: "Close FAQs", fullView: "View all questions",
    closeFullView: "Back to overview", stillQuestions: "Still have a question? Contact us on WhatsApp.",
    bookingTitle: "How can we help you?", bookingCopy: "Choose a few simple options. No complicated form.",
    chooseYourService: "Choose your service", choosePhone: "Choose your phone",
    mobileBrand: "Mobile brand", selectBrand: "Select mobile brand", enterBrand: "Enter mobile brand",
    selectModel: "Select mobile model", chooseModel: "Choose your model", enterModel: "Enter exact phone model",
    problem: "What is the problem?", selectOne: "Select one", describeProblem: "Describe the problem",
    budget: "Your budget", condition: "Phone condition", expectedPrice: "Your expected price",
    contactDetails: "Your contact details", yourName: "Your name", enterName: "Enter your name",
    whatsappNumber: "WhatsApp number", tenDigit: "10-digit mobile number",
    sendBooking: "Send booking on WhatsApp", noPayment: "No payment required. We will contact you to confirm.",
    simpleBooking: "Simple booking · Quick response · Personal assistance",
    nameRequired: "Name is required", step: "STEP",
    footerExplore: "Explore", footerVisit: "Visit & Connect", footerInfo: "Information",
    footerDescription: "Your trusted destination for mobile buying, selling and repair services.",
    footerTrust: "Customer-focused service", footerDetails: "Transparent service details",
    getHelp: "Need help?", backHome: "Back to Home",
  },
} as const;

type MessageKey = keyof typeof messages.en;
type LanguageContextValue = {
  language: CustomerLanguage;
  setLanguage: (language: CustomerLanguage) => void;
  t: (key: MessageKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function CustomerLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<CustomerLanguage>("hi");

  useEffect(() => {
    const saved = window.localStorage.getItem("mr-customer-language");
    if (saved === "hi" || saved === "en") setLanguageState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const setLanguage = useCallback((next: CustomerLanguage) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem("mr-customer-language", next);
    } catch {
      // Language still changes for the current session if storage is unavailable.
    }
  }, []);

  const t = useCallback((key: MessageKey) => messages[language][key], [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useCustomerLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useCustomerLanguage must be used inside CustomerLanguageProvider");
  return context;
}
