export interface AppTranslations {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  sovereignBadge: string;
  pills: {
    fourCodes: string;
    doubleOvertime: string;
    multilingual: string;
  };
  tabs: {
    chat: { label: string; sub: string };
    wage: { label: string; sub: string };
    schemes: { label: string; sub: string };
    grievance: { label: string; sub: string };
  };
  footer: {
    tagline: string;
    helpline: string;
    eshram: string;
    shramsuvidha: string;
  };
}

export const TRANSLATIONS: Record<string, AppTranslations> = {
  hi: {
    heroTitle: 'हर भारतीय श्रमिक का सच्चा डिजिटल साथी',
    heroSubtitle: 'भारतीय श्रम संहिताओं पर आधारित अपनी स्थानीय भाषा में निष्पक्ष कानूनी सलाह, न्यूनतम मजदूरी व ओवरटाइम गणना, ई-श्रम योजनाएं और शिकायत निवारण प्राप्त करें।',
    heroTagline: 'सॉवरेन भारतीय श्रमिक इंटेलिजेंस • Sovereign Worker Intelligence',
    sovereignBadge: 'सॉवरेन भारतीय श्रमिक इंटेलिजेंस',
    pills: {
      fourCodes: '4 श्रम संहिताओं पर प्रमाणित',
      doubleOvertime: '2x वैधानिक ओवरटाइम नियम',
      multilingual: 'बहुभाषी वॉयस एवं टेक्स्ट सहायता',
    },
    tabs: {
      chat: { label: 'वॉयस व चैट साथी', sub: 'Voice & AI Assistant' },
      wage: { label: 'मजदूरी डायरी व ओवरटाइम', sub: 'Wage Diary & 2x Overtime' },
      schemes: { label: 'सरकारी योजनाएं व लाभ', sub: 'e-Shram & Welfare' },
      grievance: { label: 'शिकायत निवारण केंद्र', sub: 'Grievance & Legal Help' },
    },
    footer: {
      tagline: 'असंगठित एवं संगठित भारतीय श्रमिकों का सशक्तिकरण',
      helpline: 'राष्ट्रीय श्रमिक हेल्पलाइन',
      eshram: 'ई-श्रम पोर्टल',
      shramsuvidha: 'श्रम सुविधा',
    },
  },
  kn: {
    heroTitle: 'ಪ್ರತಿಯೊಬ್ಬ ಭಾರತೀಯ ಕಾರ್ಮಿಕರ ನಿಜವಾದ ಡಿಜಿಟಲ್ ಒಡನಾಡಿ',
    heroSubtitle: 'ಭಾರತೀಯ ಕಾರ್ಮಿಕ ಸಂಹಿತೆಗಳ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ನಿಷ್ಪಕ್ಷಪಾತ ಕಾನೂನು ಸಲಹೆ, ಕನಿಷ್ಠ ವೇತನ ಮತ್ತು ಓವರ್‌ಟೈಮ್ ಲೆಕ್ಕಾಚಾರ, ಇ-ಶ್ರಮ್ ಯೋಜನೆಗಳು ಮತ್ತು ದೂರು ಪರಿಹಾರವನ್ನು ಪಡೆಯಿರಿ.',
    heroTagline: 'ಸಾರ್ವಭೌಮ ಭಾರತೀಯ ಕಾರ್ಮಿಕ ಇಂಟೆಲಿಜೆನ್ಸ್',
    sovereignBadge: 'ಸಾರ್ವಭೌಮ ಭಾರತೀಯ ಕಾರ್ಮಿಕ ಇಂಟೆಲಿಜೆನ್ಸ್',
    pills: {
      fourCodes: '4 ಕಾರ್ಮಿಕ ಸಂಹಿತೆಗಳಲ್ಲಿ ಪ್ರಮಾಣೀಕೃತ',
      doubleOvertime: '2x ಶಾಸನಬದ್ಧ ಓವರ್‌ಟೈಮ್ ನಿಯಮ',
      multilingual: 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಮತ್ತು ಪಠ್ಯ ಬೆಂಬಲ',
    },
    tabs: {
      chat: { label: 'ಧ್ವನಿ ಮತ್ತು ಚಾಟ್ ಸಹಾಯಕ', sub: 'Voice & AI Assistant' },
      wage: { label: 'ವೇತನ ಡೈರಿ ಮತ್ತು ಓವರ್‌ಟೈಮ್', sub: 'Wage Diary & 2x Overtime' },
      schemes: { label: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಲಾಭ', sub: 'e-Shram & Welfare' },
      grievance: { label: 'ಕಾರ್ಮಿಕ ದೂರು ಪರಿಹಾರ ಕೇಂದ್ರ', sub: 'Grievance & Legal Help' },
    },
    footer: {
      tagline: 'ಅಸಂಘಟಿತ ಮತ್ತು ಸಂಘಟಿತ ಕಾರ್ಮಿಕರ ಸಬಲೀಕರಣ',
      helpline: 'ರಾಷ್ಟ್ರೀಯ ಕಾರ್ಮಿಕ ಸಹಾಯವಾಣಿ',
      eshram: 'ಇ-ಶ್ರಮ್ ಪೋರ್ಟಲ್',
      shramsuvidha: 'ಶ್ರಮ ಸುವಿಧಾ',
    },
  },
  te: {
    heroTitle: 'ప్రతి భారతీయ కార్మికుడి నిజమైన డిజిటల్ సహచరుడు',
    heroSubtitle: 'భారతీయ కార్మిక చట్టాల ఆధారంగా మీ స్థానిక భాషలో చట్టపరమైన సలహాలు, కనీస వేతనం మరియు ఓవర్‌టైమ్ లెక్కలు, ఇ-శ్రమ్ పథకాలు మరియు ఫిర్యాదుల పరిష్కారాన్ని పొందండి.',
    heroTagline: 'సావరిన్ భారతీయ కార్మిక ఇంటెలిజెన్స్',
    sovereignBadge: 'సావరిన్ భారతీయ కార్మిక ఇంటెలిజెన్స్',
    pills: {
      fourCodes: '4 కార్మిక కోడ్‌లపై ఆధారపడినది',
      doubleOvertime: '2x చట్టబద్ధమైన ఓవర్‌టైమ్ నియమం',
      multilingual: 'బహుభాషా వాయిస్ మరియు టెక్స్ట్ సహాయం',
    },
    tabs: {
      chat: { label: 'వాయిస్ & చాట్ సహాయకుడు', sub: 'Voice & AI Assistant' },
      wage: { label: 'వేతన డైరీ & ఓవర్‌టైమ్', sub: 'Wage Diary & 2x Overtime' },
      schemes: { label: 'ప్రభుత్వ పథకాలు & ప్రయోజనాలు', sub: 'e-Shram & Welfare' },
      grievance: { label: 'కార్మికుల ఫిర్యాదుల కేంద్రం', sub: 'Grievance & Legal Help' },
    },
    footer: {
      tagline: 'అసంఘటిత మరియు సంఘటిత కార్మికుల సాధికారత',
      helpline: 'జాతీయ కార్మిక హెల్ప్‌లైన్',
      eshram: 'ఇ-శ్రమ్ పోర్టల్',
      shramsuvidha: 'శ్రమ సువిధ',
    },
  },
  ta: {
    heroTitle: 'ஒவ்வொரு இந்திய தொழிலாளியின் உண்மையான டிஜிட்டல் தோழன்',
    heroSubtitle: 'இந்திய தொழிலாளர் சட்டங்களின் அடிப்படையில் உங்கள் தாய்மொழியில் சட்ட ஆலோசனைகள், குறைந்தபட்ச ஊதியம், கூடுதல் நேர ஊதியம் மற்றும் நலத்திட்ட உதவிகளைப் பெறுங்கள்.',
    heroTagline: 'இந்திய தொழிலாளர் நுண்ணறிவு தளம்',
    sovereignBadge: 'இந்திய தொழிலாளர் நுண்ணறிவு தளம்',
    pills: {
      fourCodes: '4 தொழிலாளர் சட்டங்களின் பாதுகாப்பு',
      doubleOvertime: '2x இரட்டிப்பு ஓவர்டைம் விதி',
      multilingual: 'பலமொழி குரல் & உரை ஆதரவு',
    },
    tabs: {
      chat: { label: 'குரல் & அரட்டை உதவியாளர்', sub: 'Voice & AI Assistant' },
      wage: { label: 'கூலி டைரி & ஓவர்டைம்', sub: 'Wage Diary & 2x Overtime' },
      schemes: { label: 'அரசு நலத்திட்டங்கள்', sub: 'e-Shram & Welfare' },
      grievance: { label: 'புகார் தீர்வு மையம்', sub: 'Grievance & Legal Help' },
    },
    footer: {
      tagline: 'அமைப்புசாரா மற்றும் அமைப்புசார் தொழிலாளர் மேம்பாடு',
      helpline: 'தேசிய தொழிலாளர் உதவி எண்',
      eshram: 'இ-ஷ்ரம் போர்டல்',
      shramsuvidha: 'ஷ்ரம் சுவிதா',
    },
  },
  mr: {
    heroTitle: 'प्रत्येक भारतीय कामगाराचा खरा डिजिटल सोबती',
    heroSubtitle: 'भारतीय कामगार कायद्यांवर आधारित आपल्या मातृभाषेत कायदेशीर सल्ला, किमान वेतन व ओव्हरटाईम हिशोब, ई-श्रम योजना आणि तक्रार निवारण मिळवा.',
    heroTagline: 'सार्वभौम भारतीय कामगार बुद्धिमत्ता',
    sovereignBadge: 'सार्वभौम भारतीय कामगार बुद्धिमत्ता',
    pills: {
      fourCodes: '4 कामगार संहितेनुसार प्रमाणित',
      doubleOvertime: '2x दुप्पट ओव्हरटाईम नियम',
      multilingual: 'बहुभाषिक व्हॉईस आणि टेक्स्ट मदत',
    },
    tabs: {
      chat: { label: 'व्हॉईस आणि चॅट साथी', sub: 'Voice & AI Assistant' },
      wage: { label: 'मजुरी डायरी व ओव्हरटाईम', sub: 'Wage Diary & 2x Overtime' },
      schemes: { label: 'शासकीय योजना व लाभ', sub: 'e-Shram & Welfare' },
      grievance: { label: 'तक्रार निवारण केंद्र', sub: 'Grievance & Legal Help' },
    },
    footer: {
      tagline: 'असंघटित आणि संघटित कामगारांचे सक्षमीकरण',
      helpline: 'राष्ट्रीय कामगार हेल्पलाइन',
      eshram: 'ई-श्रम पोर्टल',
      shramsuvidha: 'श्रम सुविधा',
    },
  },
  bn: {
    heroTitle: 'প্রত্যেক ভারতীয় শ্রমিকের প্রকৃত ডিজিটাল সহচর',
    heroSubtitle: 'ভারতীয় শ্রম আইনের ভিত্তিতে আপনার মাতৃভাষায় নিরপেক্ষ আইনি পরামর্শ, ন্যূনতম মজুরি ও ওভারটাইম হিসাব, ই-শ্রম প্রকল্প এবং অভিযোগ প্রতিকার পান।',
    heroTagline: 'সার্বভৌম ভারতীয় শ্রমিক ইন্টেলিজেন্স',
    sovereignBadge: 'সার্বভৌম ভারতীয় শ্রমিক ইন্টেলিজেন্স',
    pills: {
      fourCodes: '৪টি শ্রম কোডের সুরক্ষা',
      doubleOvertime: '2x দ্বিগুণ ওভারটাইম নিয়ম',
      multilingual: 'বহুভাষিক ভয়েস ও টেক্সট সহায়তা',
    },
    tabs: {
      chat: { label: 'ভয়েস ও চ্যাট সহকারী', sub: 'Voice & AI Assistant' },
      wage: { label: 'মজুরি ডায়েরি ও ওভারটাইম', sub: 'Wage Diary & 2x Overtime' },
      schemes: { label: 'সরকারি প্রকল্প ও সুবিধা', sub: 'e-Shram & Welfare' },
      grievance: { label: 'অভিযোগ প্রতিকার কেন্দ্র', sub: 'Grievance & Legal Help' },
    },
    footer: {
      tagline: 'অসংগঠিত ও সংগঠিত শ্রমিকদের ক্ষমতায়ন',
      helpline: 'জাতীয় শ্রমিক হেল্পলাইন',
      eshram: 'ই-শ্রম পোর্টাল',
      shramsuvidha: 'শ্রম সুবিধা',
    },
  },
  en: {
    heroTitle: 'The True Digital Companion for Every Indian Worker',
    heroSubtitle: 'Access grounded legal labor advice in your native tongue, calculate statutory minimum wage & 2x overtime, discover e-Shram welfare schemes, and file grievances with ease.',
    heroTagline: 'Sovereign Indian Worker Intelligence',
    sovereignBadge: 'Sovereign Worker Intelligence',
    pills: {
      fourCodes: 'Grounded in 4 Labour Codes',
      doubleOvertime: 'Statutory 2x Overtime Rule',
      multilingual: 'Multilingual Voice & Text Support',
    },
    tabs: {
      chat: { label: 'Voice & AI Companion', sub: 'Evon & Timbre Powered' },
      wage: { label: 'Wage Diary & Overtime', sub: 'Section 14 2x Rule' },
      schemes: { label: 'Govt Schemes & Benefits', sub: 'e-Shram & BOCW Directory' },
      grievance: { label: 'Grievance Redressal', sub: 'National Helpline 14434' },
    },
    footer: {
      tagline: 'Empowering Unorganized & Organized Indian Workers',
      helpline: 'National Labour Helpline',
      eshram: 'e-Shram National Portal',
      shramsuvidha: 'Shram Suvidha Portal',
    },
  },
};

